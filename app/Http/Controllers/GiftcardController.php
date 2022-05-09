<?php

namespace App\Http\Controllers;

use Akaunting\Money\Money;
use App\Exceptions\TransferException;
use App\Http\Requests\VerifiedRequest;
use App\Http\Resources\GiftcardBrandResource;
use App\Http\Resources\GiftcardContentResource;
use App\Http\Resources\GiftcardResource;
use App\Models\FeatureLimit;
use App\Models\Giftcard;
use App\Models\GiftcardBrand;
use App\Models\GiftcardContent;
use App\Models\PaymentAccount;
use App\Models\User;
use App\Notifications\GiftcardPurchase;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class GiftcardController extends Controller
{
    /**
     * Get giftcard records
     *
     * @param Request $request
     * @return AnonymousResourceCollection
     * @throws ValidationException
     */
    public function get(Request $request)
    {
        $validated = $this->validate($request, [
            'ids'   => "required|array|min:1",
            'ids.*' => "required|integer|min:1"
        ]);

        $records = Giftcard::whereIn('id', $validated['ids'])->get();

        return GiftcardResource::collection($records);
    }

    /**
     * Purchase giftcards
     *
     * @param VerifiedRequest $request
     * @throws ValidationException
     */
    public function purchase(VerifiedRequest $request)
    {
        $validated = $this->validate($request, [
            'items'            => "required|array|min:1",
            'items.*'          => "required|array:id,quantity",
            'items.*.id'       => "required|exists:giftcards,id",
            'items.*.quantity' => "required|integer|min:1"
        ]);

        $items = collect($validated['items']);

        Auth::user()->acquireLock(function (User $user) use ($items) {
            $account = $user->getPaymentAccount();
            $operator = $this->getOperator($user);

            $account->acquireLock(function (PaymentAccount $account) use ($items, $operator) {
                $limit = FeatureLimit::giftcardTrade();

                if (!$limit->enabled($account->user)) {
                    return abort(403, trans('feature.verification_required'));
                }

                $items->transform(function ($item) use ($account) {
                    $giftcard = Giftcard::find($item['id']);
                    $price = $giftcard->getPrice($account->user);

                    $quantity = $item['quantity'];

                    if ($giftcard->stock < $quantity) {
                        return abort(422, trans('giftcard.insufficient_stock'));
                    }

                    $cost = $price->multiply($quantity);
                    return compact('giftcard', 'cost', 'quantity');
                });

                $total = $items->reduce(function (Money $total, $item) {
                    return $total->add($item['cost']);
                }, $account->parseMoney(0));

                if ($account->getAvailableObject()->lessThan($total)) {
                    return abort(422, trans('payment.insufficient_balance'));
                }

                if (!$limit->checkAvailability($total, $account->user)) {
                    return abort(403, trans('feature.limit_reached'));
                }

                DB::transaction(function () use ($items, $account, $total, $limit, $operator) {
                    $description = $this->getDescription($total);

                    $items->each(function ($item) use ($account) {
                        $contents = $this->getContents($item['giftcard'], $item['quantity']);

                        $contents->each(function (GiftcardContent $content) use ($account) {
                            $purchasedContent = $content->acquireLock(function (GiftcardContent $content) use ($account) {
                                if (!is_null($content->buyer)) {
                                    return abort(422, trans('giftcard.buyer_exists'));
                                }
                                $content->bought_at = now();
                                $content->buyer()->associate($account->user);
                                return tap($content)->save();
                            });

                            if (!$purchasedContent instanceof GiftcardContent) {
                                return abort(422, trans('giftcard.buyer_exists'));
                            }
                        });
                    });

                    $account->debit($total, $description);
                    $payment = $operator->getPaymentAccountByCurrency($account->currency);
                    $payment->credit($total, $description);

                    $limit->setUsage($total, $account->user);
                });

                $account->user->notify(new GiftcardPurchase($items, $total));
            });
        });
    }

    /**
     * Paginate contents
     *
     * @return AnonymousResourceCollection
     */
    public function contentPaginate()
    {
        $query = GiftcardContent::query()
            ->whereHas('buyer', function (Builder $query) {
                $query->where('name', Auth::user()->name);
            });

        $records = paginate($query);

        return GiftcardContentResource::collection($records);
    }

    /**
     * Get giftcard contents
     *
     * @param Giftcard $giftcard
     * @param int $quantity
     * @return \Illuminate\Database\Eloquent\Collection
     */
    protected function getContents(Giftcard $giftcard, int $quantity)
    {
        $contents = $giftcard->contents()->doesntHave('buyer')->limit($quantity)->get();

        return tap($contents, function ($contents) use ($quantity) {
            if ($contents->count() != $quantity) {
                return abort(422, trans('giftcard.insufficient_stock'));
            }
        });
    }

    /**
     * Get purchase description
     *
     * @param Money $total
     * @return string
     */
    protected function getDescription(Money $total)
    {
        return "Giftcard purchase ({$total->format()})";
    }

    /**
     * Get operator
     *
     * @param User $user
     * @return User
     */
    protected function getOperator(User $user)
    {
        return tap(User::giftcardOperator(), function ($operator) use ($user) {
            if (!$operator instanceof User) {
                return abort(403, trans('common.operator_unavailable'));
            }

            if ($user->is($operator)) {
                return abort(403, trans('giftcard.self_trading'));
            }
        });
    }

    /**
     * Get brands
     *
     * @return AnonymousResourceCollection
     */
    public function getBrands()
    {
        return GiftcardBrandResource::collection(GiftcardBrand::all());
    }

    /**
     * Paginate giftcards
     *
     * @return AnonymousResourceCollection
     */
    public function paginate()
    {
        $records = paginate(Giftcard::query());

        return GiftcardResource::collection($records);
    }
}
