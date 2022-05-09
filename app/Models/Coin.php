<?php

namespace App\Models;

use App\CoinAdapters\Contracts\Adapter;
use App\CoinAdapters\Resources\Transaction;
use Illuminate\Contracts\Filesystem\FileNotFoundException;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

class Coin extends Model
{
    use HasFactory;

    protected $valueObject;
    protected $feeEstimateObject;
    protected $dollarPrice;
    protected $dollarPriceChange;
    protected $marketChart;
    protected $adapterObject;
    protected $svgIcon;

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'symbol_first' => 'boolean',
        'precision'    => 'int',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = [
        'price',
        'formatted_price',
        'svg_icon',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'adapter'
    ];

    /**
     * The attributes that aren't mass assignable.
     *
     * @var array
     */
    protected $guarded = [];

    /**
     * Scope a query of identifier.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param $identifier
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeId($query, $identifier)
    {
        return $query->where('identifier', $identifier);
    }

    /**
     * Wallet relation
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function wallet()
    {
        return $this->hasOne(Wallet::class, 'coin_id', 'id')->latest();
    }

    /**
     * Get value as coin formatter object
     *
     * @return \App\Helpers\CoinFormatter
     */
    public function getValueObject()
    {
        if (!isset($this->valueObject)) {
            $this->valueObject = coin(1, $this, true);
        }
        return $this->valueObject;
    }

    /**
     * Get coin price
     *
     * @return mixed
     */
    public function getPriceAttribute()
    {
        return $this->getValueObject()->getPrice(defaultCurrency());
    }

    /**
     * Get formatted coin price
     *
     * @return mixed
     */
    public function getFormattedPriceAttribute()
    {
        return $this->getValueObject()->getFormattedPrice(defaultCurrency());
    }

    /**
     * Get currency precision
     *
     * @return mixed
     */
    public function getCurrencyPrecisionAttribute()
    {
        return $this->getCurrencyPrecision();
    }

    /**
     * Get svg icon attribute
     *
     * @return array|string
     */
    public function getSvgIconAttribute()
    {
        if (!isset($this->svgIcon)) {
            $this->svgIcon = $this->adapter->getSvgIcon();
        }
        return $this->svgIcon;
    }

    /**
     * Serialize adapter object.
     *
     * @param string $value
     * @return void
     */
    public function setAdapterAttribute($value)
    {
        $this->attributes['adapter'] = serialize($value);
    }

    /**
     * Unserialize adapter object.
     *
     * @param string $value
     * @return Adapter
     */
    public function getAdapterAttribute($value)
    {
        if (!isset($this->adapterObject)) {
            $this->adapterObject = unserialize($value);
        }
        return $this->adapterObject;
    }

    /**
     * Get cached copy of dollar price
     *
     * @return float
     */
    public function getDollarPrice()
    {
        if (!isset($this->dollarPrice)) {
            $seconds = max(settings()->get('price_cache'), 5);
            $expires = now()->addSeconds($seconds);

            $key = "coin.{$this->identifier}.dollarPrice";

            $this->dollarPrice = Cache::remember($key, $expires, function () {
                return $this->adapter->getDollarPrice();
            });
        }
        return (float) $this->dollarPrice;
    }

    /**
     * Get last 24hr change
     *
     * @return float
     */
    public function getDollarPriceChange()
    {
        if (!isset($this->dollarPriceChange)) {
            $key = "coin.{$this->identifier}.dollarPriceChange";

            $expires = now()->addHours();

            $this->dollarPriceChange = Cache::remember($key, $expires, function () {
                return $this->adapter->getDollarPriceChange();
            });
        }
        return (float) $this->dollarPriceChange;
    }

    /**
     * Get market chart
     *
     * @param int $days
     * @return array
     */
    public function getMarketChart(int $days)
    {
        if (!isset($this->marketChart)) {
            $key = "coin.{$this->identifier}.marketChart.{$days}";

            $expires = now()->addHours();

            $this->marketChart = Cache::remember($key, $expires, function () use ($days) {
                return $this->adapter->marketChart($days);
            });
        }
        return (array) $this->marketChart;
    }

    /**
     * Get transactions director
     *
     * @return string
     */
    protected function transactionResourceDir()
    {
        return "transactions/{$this->identifier}";
    }

    /**
     * Get pendingApproval  directory
     *
     * @return string
     */
    protected function pendingApprovalResourceDir()
    {
        return "approvals/{$this->identifier}";
    }

    /**
     * Default filesystem
     *
     * @return Storage|mixed
     */
    public function filesystem()
    {
        return app('filesystem');
    }

    /**
     * Get all transaction paths
     *
     * @return array
     */
    public function getTransactionResourcePaths()
    {
        return $this->filesystem()->files($this->transactionResourceDir());
    }


    /**
     * Get all pending approval paths
     *
     * @return array
     */
    public function getPendingApprovalResourcePaths()
    {
        return $this->filesystem()->files($this->pendingApprovalResourceDir());
    }

    /**
     * Transaction storage path
     *
     * @param $hash
     * @return string
     */
    public function getTransactionResourcePath($hash)
    {
        return $this->transactionResourceDir() . '/' . $hash;
    }

    /**
     * Pending Approval storage path
     *
     * @param $hash
     * @return string
     */
    public function getPendingApprovalResourcePath($hash)
    {
        return $this->pendingApprovalResourceDir() . '/' . $hash;
    }


    /**
     * Save transaction resource to file
     *
     * @param Transaction $resource
     * @throws \Exception
     */
    public function saveTransactionResource($resource)
    {
        $path = $this->getTransactionResourcePath($resource->getId());
        $this->filesystem()->put($path, serialize($resource));
    }

    /**
     * Save pending approval resource to file
     *
     * @param \App\CoinAdapters\Resources\PendingApproval $resource
     * @throws \Exception
     */
    public function savePendingApprovalResource($resource)
    {
        $path = $this->getPendingApprovalResourcePath($resource->getId());
        $this->filesystem()->put($path, serialize($resource));
    }

    /**
     * Get transaction resource from file
     *
     * @param $path
     * @return mixed
     * @throws FileNotFoundException
     */
    public function getTransactionResource($path)
    {
        return unserialize($this->filesystem()->get($path));
    }

    /**
     * Get Pending Approval resource from file
     *
     * @param $path
     * @return mixed
     * @throws FileNotFoundException
     */
    public function getPendingApprovalResource($path)
    {
        return unserialize($this->filesystem()->get($path));
    }

    /**
     * Remove Transaction resource by hash
     *
     * @param Transaction $resource
     * @return bool
     */
    public function removeTransactionResource($resource)
    {
        $path = $this->getTransactionResourcePath($resource->getId());
        return $this->deleteTransactionResource($path);
    }

    /**
     * Remove PendingApproval resource by hash
     *
     * @param \App\CoinAdapters\Resources\PendingApproval $resource
     * @return bool
     */
    public function removePendingApprovalResource($resource)
    {
        $path = $this->getPendingApprovalResourcePath($resource->getId());
        return $this->deletePendingApprovalResource($path);
    }

    /**
     * Delete transaction resource path
     *
     * @param $path
     * @return bool
     */
    public function deleteTransactionResource($path)
    {
        return $this->filesystem()->delete($path);
    }

    /**
     * Delete PendingApproval resource path
     *
     * @param $path
     * @return bool
     */
    public function deletePendingApprovalResource($path)
    {
        return $this->filesystem()->delete($path);
    }

    /**
     * Get identifier.
     *
     * @return string
     */
    public function getIdentifier()
    {
        return $this->identifier;
    }

    /**
     * Get name.
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Get precision.
     *
     * @return int
     */
    public function getPrecision()
    {
        return $this->precision;
    }

    /**
     * Get currency precision
     *
     * @return mixed
     */
    public function getCurrencyPrecision()
    {
        return $this->adapter->getCurrencyPrecision();
    }

    /**
     * Get sub unit.
     *
     * @return mixed
     */
    public function getBaseUnit()
    {
        return $this->base_unit;
    }

    /**
     * Get symbol.
     *
     * @return string
     */
    public function getSymbol()
    {
        return $this->symbol;
    }

    /**
     * Check is symbol should be first.
     *
     * @return bool
     */
    public function isSymbolFirst()
    {
        return $this->symbol_first;
    }

    /**
     * Get prefix.
     *
     * @return string
     */
    public function getPrefix()
    {
        if (!$this->symbol_first) {
            return '';
        }
        return $this->symbol;
    }

    /**
     * Get suffix.
     *
     * @return string
     */
    public function getSuffix()
    {
        if ($this->symbol_first) {
            return '';
        }
        return $this->symbol;
    }
}
