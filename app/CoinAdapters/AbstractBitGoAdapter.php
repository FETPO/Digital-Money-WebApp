<?php

namespace App\CoinAdapters;


use App\CoinAdapters\Contracts\Adapter;
use App\CoinAdapters\Contracts\CoinGecko;
use App\CoinAdapters\Contracts\Approval;
use App\CoinAdapters\Exceptions\AdapterException;
use App\CoinAdapters\Resources\Address;
use App\CoinAdapters\Resources\PendingApproval;
use App\CoinAdapters\Resources\Transaction;
use App\CoinAdapters\Resources\Wallet;
use Brick\Math\BigDecimal;
use Exception;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\File;
use NeoScrypts\BitGo\BitGo;
use NeoScrypts\BitGo\BitGoException;

abstract class AbstractBitGoAdapter implements Adapter, Approval, CoinGecko
{
    use CoinPrice;

    /**
     * Bitgo Instance
     *
     * @var BitGo
     */
    protected BitGo $bitgo;

    /**
     * BitGoAdapter constructor.
     *
     * @throws Exception
     */
    public function __construct()
    {
        $this->init();
    }

    /**
     * Initialize BitGo Helper class
     *
     * @throws Exception
     */
    private function init()
    {
        $bitgo = app(BitGo::class);

        if (config('services.bitgo.env') != "prod") {
            $bitgo->setCoin($this->getBitgoTestIdentifier());
        } else {
            $bitgo->setCoin($this->getBitgoIdentifier());
        }

        $this->bitgo = $bitgo;
    }

    /**
     * Exclude bitgo property
     *
     * @return array
     */
    public function __sleep()
    {
        return [];
    }

    /**
     * @throws Exception
     */
    public function __wakeup()
    {
        $this->init();
    }

    /**
     * Get bitgo identifier
     *
     * @return string
     */
    abstract protected function getBitgoIdentifier(): string;

    /**
     * Get bitgo test identifier
     *
     * @return string
     */
    abstract protected function getBitgoTestIdentifier(): string;

    /**
     * {@inheritdoc}
     */
    public function adapterName(): string
    {
        return static::NAME . " (BitGo)";
    }

    /**
     * {@inheritdoc}
     */
    public function getName(): string
    {
        return static::NAME;
    }

    /**
     * {@inheritdoc}
     */
    public function getIdentifier(): string
    {
        return static::IDENTIFIER;
    }

    /**
     * {@inheritdoc}
     */
    public function getBaseUnit()
    {
        return static::BASE_UNIT;
    }

    /**
     * {@inheritdoc}
     */
    public function getPrecision()
    {
        return static::PRECISION;
    }

    /**
     * {@inheritdoc}
     */
    public function getCurrencyPrecision()
    {
        return static::CURRENCY_PRECISION;
    }

    /**
     * {@inheritdoc}
     */
    public function getSymbol(): string
    {
        return static::SYMBOL;
    }

    /**
     * {@inheritdoc}
     */
    public function showSymbolFirst(): bool
    {
        return static::SYMBOL_FIRST;
    }

    /**
     * {@inheritdoc}
     */
    public function getColor(): string
    {
        return static::COLOR;
    }

    /**
     * {@inheritdoc}
     */
    public function getSvgIcon()
    {
        return rescue(function () {
            return json_decode(File::get($this->getSvgIconPath()), true);
        });
    }

    /**
     * Get absolute path to icon
     *
     * @return string
     */
    protected function getSvgIconPath()
    {
        return app_path("CoinAdapters/svgIcons/{$this->getIdentifier()}.json");
    }

    /**
     * {@inheritdoc}
     * @throws BitGoException
     * @throws Exceptions\ValidationException
     * @throws GuzzleException
     */
    public function createWallet(string $label, string $passphrase): Wallet
    {
        $data = collect($this->bitgo->generateWallet($label, $passphrase));
        return $this->createWalletResource($data);
    }

    /**
     * {@inheritdoc}
     * @throws GuzzleException
     * @throws Exceptions\ValidationException
     * @throws BitGoException
     */
    public function createAddress(Wallet $wallet, $label = 'Default'): Address
    {
        $this->bitgo->setWalletId($wallet->getId());
        $data = collect($this->bitgo->createAddress(false, 0, null, $label));
        return $this->createAddressResource($data, $label);

    }

    /**
     * Send transaction
     *
     * {@inheritdoc}
     * @return Transaction|PendingApproval
     * @throws AdapterException
     * @throws GuzzleException
     * @throws Exceptions\ValidationException
     * @throws BitGoException
     */
    public function send(Wallet $wallet, string $address, $amount, $passphrase)
    {
        $this->bitgo->setWalletId($wallet->getId());
        $response = $this->bitgo->sendTransaction($address, $amount, $passphrase);
        if (isset($response['pendingApproval'])) {
            return $this->createPendingApprovalResource(collect($response['pendingApproval']));
        } else if (isset($response['transfer'])) {
            return $this->createTransactionResource(collect($response['transfer']));
        } else {
            throw new BitGoException('Invalid transaction data!');
        }
    }

    /**
     * Parse addresses
     *
     * @param $address
     * @return array
     * @throws AdapterException
     */
    protected static function parseAddress($address)
    {
        if (!is_array($address)) {
            throw new AdapterException("Invalid address format.");
        } else {
            return collect($address)->map(function ($object) {
                if (!is_array($object)) {
                    throw new AdapterException("Address is expected to be an array of objects.");
                }
                if (!isset($object['value']) && isset($object['valueString'])) {
                    $object['value'] = $object['valueString'];
                }
                if (!Arr::has($object, ['address', 'value'])) {
                    throw new AdapterException("Objects should contain address, value pairs.");
                }

                return Arr::only($object, ['address', 'value']);
            })->toArray();
        }
    }

    /**
     * Get pending approval
     *
     * @inheritDoc
     * @throws BitGoException
     * @throws Exceptions\ValidationException
     * @throws GuzzleException
     */
    public function getPendingApproval(Wallet $wallet, $id): PendingApproval
    {
        $this->bitgo->setWalletId($wallet->getId());
        $data = collect($this->bitgo->getPendingApproval($id));
        return $this->createPendingApprovalResource($data);
    }

    /**
     * Set pending approval webhook url for wallet.
     *
     * @param Wallet $wallet
     * @return void
     * @throws BitGoException
     * @throws GuzzleException
     */
    protected function setPendingApprovalWebhook(Wallet $wallet)
    {
        $this->bitgo->setWalletId($wallet->getId());
        $this->bitgo->addWalletWebhook($this->getPendingApprovalWebhookUrl(), "pendingapproval");
    }

    /**
     * Unset webhook for pending approval.
     *
     * @param Wallet $wallet
     * @return void
     * @throws GuzzleException
     * @throws Exception
     */
    protected function unsetPendingApprovalWebhook(Wallet $wallet)
    {
        $this->bitgo->setWalletId($wallet->getId());
        $this->bitgo->removeWalletWebhook($this->getPendingApprovalWebhookUrl(), "pendingapproval");
    }

    /**
     * Handle coin webhook and return the pending approval data
     *
     * @inheritDoc
     * @throws GuzzleException
     * @throws Exception
     */
    public function handlePendingApprovalWebhook(Wallet $wallet, $payload)
    {
        if ($id = Arr::get($payload, 'pendingApprovalId')) {
            return $this->getPendingApproval($wallet, $id);
        }
    }

    /**
     * Get transaction by id
     *
     * {@inheritdoc}
     * @throws AdapterException
     * @throws GuzzleException
     * @throws Exception
     */
    public function getTransaction(Wallet $wallet, $id): Transaction
    {
        $this->bitgo->setWalletId($wallet->getId());
        $data = collect($this->bitgo->getTransfer($id));
        return $this->createTransactionResource($data);
    }

    /**
     * Reset transaction webhook
     *
     * {@inheritdoc}
     * @throws GuzzleException
     */
    public function resetTransactionWebhook(Wallet $wallet, int $minConf = 3)
    {
        $this->unsetTransactionWebhook($wallet);
        $this->setTransactionWebhook($wallet, $minConf);
    }

    /**
     * Set transaction webhook url for wallet.
     *
     * {@inheritdoc}
     * @throws GuzzleException
     * @throws Exception
     */
    public function setTransactionWebhook(Wallet $wallet, int $minConf = 3)
    {
        $this->bitgo->setWalletId($wallet->getId());
        $this->bitgo->addWalletWebhook($this->getTransactionWebhookUrl(), "transfer");
        $this->setPendingApprovalWebhook($wallet);
    }

    /**
     * Unset webhook for wallet.
     *
     * @param Wallet $wallet
     * @return void
     * @throws GuzzleException
     * @throws Exception
     */
    protected function unsetTransactionWebhook(Wallet $wallet)
    {
        $this->bitgo->setWalletId($wallet->getId());
        $this->bitgo->removeWalletWebhook($this->getTransactionWebhookUrl(), "transfer");
        $this->unsetPendingApprovalWebhook($wallet);
    }

    /**
     * Handle coin webhook and return the transaction data
     *
     * {@inheritdoc}
     * @return Transaction|void
     * @throws GuzzleException
     * @throws Exception
     */
    public function handleTransactionWebhook(Wallet $wallet, $payload)
    {
        if ($hash = Arr::get($payload, 'hash')) {
            return $this->getTransaction($wallet, $hash);
        }
    }

    /**
     * Get fee per byte estimate
     *
     * @param int|null $minConf
     * @return string
     * @throws BitGoException
     * @throws GuzzleException
     */
    protected function getFeeEstimate(int $minConf = null)
    {
        return (string) BigDecimal::of($this->bitgo->feeEstimate()['feePerKb'])->exactlyDividedBy(1000);
    }

    /**
     * Get transaction webhook url
     *
     * @return string
     */
    final public function getTransactionWebhookUrl()
    {
        return $this->generateUrl('webhook.coin.transaction', ['identifier' => $this->getIdentifier()]);
    }

    /**
     * Get pending approval webhook url
     *
     * @return string
     */
    final public function getPendingApprovalWebhookUrl()
    {
        return $this->generateUrl('webhook.coin.pending-approval', ['identifier' => $this->getIdentifier()]);
    }

    /**
     * Generate url
     *
     * @param $name
     * @param array $parameters
     * @return string
     */
    private function generateUrl($name, $parameters = [])
    {
        return rtrim($this->getBaseUrl(), '/') . route($name, $parameters, false);
    }

    /**
     * Get base url
     *
     * @return string
     */
    private function getBaseUrl()
    {
        return app()->environment("production") ? url('/') : env('WEBHOOK_URL');
    }

    /**
     * Create wallet resource
     *
     * @param Collection $data
     * @return Wallet
     * @throws Exceptions\ValidationException
     */
    protected function createWalletResource(Collection $data)
    {
        return new Wallet([
            'id'   => $data->get('id'),
            'data' => $data->toArray()
        ]);
    }

    /**
     * Create address resource
     *
     * @param Collection $data
     * @param $label
     * @return Address
     * @throws Exceptions\ValidationException
     */
    protected function createAddressResource(Collection $data, $label)
    {
        return new Address([
            'label'   => $label,
            'id'      => $data->get('id'),
            'address' => $data->get('address'),
            'data'    => $data->toArray(),
        ]);
    }

    /**
     * Create transaction resource
     *
     * @param Collection $data
     * @return Transaction
     * @throws AdapterException
     * @throws Exceptions\ValidationException
     */
    protected function createTransactionResource(Collection $data)
    {
        return new Transaction([
            'id'            => $data->get('id'),
            'value'         => $data->get('value', $data->get('valueString')),
            'hash'          => $data->get('txid'),
            'confirmations' => $data->get('confirmations') ?: 0,
            'input'         => static::parseAddress($data->get('inputs', [])),
            'output'        => static::parseAddress($data->get('outputs', [])),
            'type'          => $data->get('type'),
            'date'          => $data->get('date') ?: now()->toDateString(),
            'data'          => $data->toArray(),
        ]);
    }

    /**
     * Create pending approval resource
     *
     * @param Collection $data
     * @return PendingApproval
     * @throws Exceptions\ValidationException
     */
    protected function createPendingApprovalResource(Collection $data)
    {
        return new PendingApproval([
            'id'    => $data->get('id'),
            'state' => $data->get('state'),
            'hash'  => data_get($data->get('info'), "transactionRequest.validTransactionHash"),
            'data'  => $data->toArray(),
        ]);
    }
}
