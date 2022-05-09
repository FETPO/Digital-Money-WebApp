<?php

namespace App\CoinAdapters;

use App\CoinAdapters\Contracts\Adapter;
use App\CoinAdapters\Contracts\CoinGecko;
use App\CoinAdapters\Contracts\Consolidates;
use App\CoinAdapters\Contracts\Properties;
use App\CoinAdapters\Exceptions\AdapterException;
use App\CoinAdapters\Exceptions\ValidationException;
use App\CoinAdapters\Resources\Address;
use App\CoinAdapters\Resources\Transaction;
use App\CoinAdapters\Resources\Wallet;
use Brick\Math\BigDecimal;
use Brick\Math\RoundingMode;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Arr;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\File;

abstract class AbstractTokenAdapter implements Adapter, Consolidates, CoinGecko, Properties
{
    use TokenPrice;

    /**
     * @var PendingRequest
     */
    protected PendingRequest $client;

    /**
     * Token constructor.
     *
     * @return void
     */
    public function __construct()
    {
        $this->init();
    }

    /**
     * @return array
     */
    public function __sleep()
    {
        return [];
    }

    /**
     * @return void
     */
    public function __wakeup()
    {
        $this->init();
    }

    /**
     * Initialize Http client
     *
     * @return void
     */
    abstract protected function init();

    /**
     * Get chain ID
     *
     * @return mixed
     */
    abstract protected function chainId();

    /**
     * @inheritDoc
     */
    public function adapterName(): string
    {
        return static::NAME;
    }

    /**
     * @inheritDoc
     */
    public function getName(): string
    {
        return static::NAME;
    }

    /**
     * @inheritDoc
     */
    public function getIdentifier(): string
    {
        return static::IDENTIFIER;
    }

    /**
     * @inheritDoc
     */
    public function getBaseUnit()
    {
        return static::BASE_UNIT;
    }

    /**
     * @inheritDoc
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
     * @inheritDoc
     */
    public function getSymbol(): string
    {
        return static::SYMBOL;
    }

    /**
     * @inheritDoc
     */
    public function showSymbolFirst(): bool
    {
        return static::SYMBOL_FIRST;
    }

    /**
     * @inheritDoc
     */
    public function getColor(): string
    {
        return static::COLOR;
    }

    /**
     * Network base unit
     *
     * @return string
     */
    protected function getNetworkBaseUnit()
    {
        return static::NETWORK_BASE_UNIT;
    }

    /**
     * @return string
     */
    public function getContract()
    {
        return static::CONTRACT;
    }

    /**
     * @return string
     */
    public static function configName()
    {
        return "coin-" . static::IDENTIFIER;
    }

    /**
     * @inheritDoc
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
    abstract protected function getSvgIconPath();

    /**
     * Check availability status
     *
     * @return void
     * @throws AdapterException
     */
    public function assertAvailable()
    {
        $response = $this->client->get("tokens/{$this->getContract()}/status");

        if ($response->failed() || !$response->json('status')) {
            throw new AdapterException("Token is unavailable.");
        }
    }

    /**
     * @inheritDoc
     * @throws AdapterException
     */
    public function createWallet(string $label, string $passphrase): Wallet
    {
        $this->assertAvailable();

        return $this->handleError(function () use ($label, $passphrase) {
            $response = $this->client->post('wallets', ['password' => $passphrase])->throw();
            return $this->createWalletResource($response->collect(), $passphrase);
        });
    }

    /**
     * @inheritDoc
     * @throws AdapterException
     */
    public function createAddress(Wallet $wallet, $label = 'Default'): Address
    {
        $this->assertAvailable();

        return $this->handleError(function () use ($wallet, $label) {
            $passphrase = decrypt($wallet->get('password'));
            $response = $this->client->post("wallets/{$wallet->getId()}/addresses", ['password' => $passphrase])->throw();
            $resource = $response->collect()->put('label', $label);
            return $this->createAddressResource($resource);
        });
    }

    /**
     * @inheritDoc
     * @throws AdapterException
     */
    public function consolidate(Wallet $wallet, string $address, $passphrase): string
    {
        $this->assertAvailable();

        return $this->handleError(function () use ($wallet, $address, $passphrase) {
            return $this->client->post("wallets/{$wallet->getId()}/tokens/{$this->getContract()}/consolidate", [
                'address'  => $address,
                'password' => $passphrase,
            ])->throw()->json('hash');
        });
    }

    /**
     * @inheritDoc
     * @throws AdapterException
     */
    public function send(Wallet $wallet, string $address, $amount, $passphrase)
    {
        $this->assertAvailable();

        return $this->handleError(function () use ($wallet, $address, $amount, $passphrase) {
            $response = $this->client->post("wallets/{$wallet->getId()}/tokens/{$this->getContract()}/send", [
                'address'  => $address,
                'value'    => $amount,
                'password' => $passphrase,
            ])->throw();
            return $this->createTransactionResource($response->collect());
        });
    }

    /**
     * @inheritDoc
     * @throws AdapterException
     */
    public function getTransaction(Wallet $wallet, $id): Transaction
    {
        return $this->handleError(function () use ($wallet, $id) {
            $response = $this->client->get("wallets/{$wallet->getId()}/tokens/{$this->getContract()}/transfer/$id")->throw();
            return $this->createTransactionResource($response->collect());
        });
    }

    /**
     * @inheritDoc
     * @throws AdapterException
     */
    public function handleTransactionWebhook(Wallet $wallet, $payload)
    {
        if ($hash = Arr::get($payload, 'hash')) {
            return $this->getTransaction($wallet, $hash);
        }
    }

    /**
     * @inheritDoc
     * @throws AdapterException
     */
    public function setTransactionWebhook(Wallet $wallet, int $minConf = 3)
    {
        $this->handleError(function () use ($wallet) {
            return $this->client->post('webhooks/token-transfer', [
                'contract' => $this->getContract(),
                'url'      => $this->getTransactionWebhookUrl(),
                'wallet'   => $wallet->getId(),
            ])->throw();
        });
    }

    /**
     * @inheritDoc
     * @throws AdapterException
     */
    public function resetTransactionWebhook(Wallet $wallet, int $minConf = 3)
    {
        $this->setTransactionWebhook($wallet, $minConf);
    }

    /**
     * @return array|mixed
     * @throws RequestException
     */
    protected function getGasPrice()
    {
        return $this->client->get('gas-price')->throw()->json('gasPrice');
    }

    /**
     * @inheritDoc
     * @throws RequestException
     */
    public function estimateTransactionFee(int $inputs, int $outputs, $amount = 0, int $minConf = null)
    {
        $gasLimit = $this->config('gas_limit');
        $gasPrice = $this->getGasPrice();
        return (string) BigDecimal::of($gasPrice)->multipliedBy(1.5)
            ->multipliedBy((21000 + $gasLimit) * $inputs + $gasLimit)
            ->multipliedBy($this->getNetworkDollarPrice())
            ->multipliedBy($this->getBaseUnit())
            ->exactlyDividedBy($this->getNetworkBaseUnit())
            ->dividedBy($this->getDollarPrice(), 0, RoundingMode::HALF_UP);
    }

    /**
     * @inheritDoc
     */
    public function getProperties(Wallet $wallet): array
    {
        return ["root" => $wallet->get("address")];
    }

    /**
     * Get transaction webhook url
     *
     * @return string
     */
    protected function getTransactionWebhookUrl()
    {
        return $this->generateUrl('webhook.coin.transaction', ['identifier' => $this->getIdentifier()]);
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
     * @param $password
     * @return Wallet
     * @throws ValidationException
     */
    protected function createWalletResource(Collection $data, $password)
    {
        return new Wallet([
            'id'       => $data->get('id'),
            'address'  => $data->get('address'),
            'password' => encrypt($password),
            'data'     => $data->toArray()
        ]);
    }

    /**
     * Create address resource
     *
     * @param Collection $data
     * @return Address
     * @throws ValidationException
     */
    protected function createAddressResource(Collection $data)
    {
        return new Address([
            'id'      => $data->get('address'),
            'label'   => $data->get('label'),
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
     * @throws ValidationException
     */
    protected function createTransactionResource(Collection $data)
    {
        $date = $this->dateFromTimestamp($data->get('timestamp'));

        return new Transaction([
            'id'            => $data->get('hash'),
            'value'         => $data->get('value'),
            'hash'          => $data->get('hash'),
            'confirmations' => $data->get('confirmations') ?: 0,
            'input'         => $data->get('from'),
            'output'        => $data->get('to'),
            'type'          => $data->get('type'),
            'date'          => $date->toDateTimeString(),
            'data'          => $data->toArray(),
        ]);
    }

    /**
     * Create date from timestamp
     *
     * @param $timestamp
     * @return Carbon
     */
    protected function dateFromTimestamp($timestamp)
    {
        return $timestamp ? Carbon::createFromTimestamp($timestamp) : Carbon::now();
    }

    /**
     * Handle Request Exceptions
     *
     * @param callable $callback
     * @return mixed
     * @throws AdapterException
     */
    protected function handleError(callable $callback)
    {
        try {
            return $callback();
        } catch (RequestException $e) {
            throw new AdapterException($e->response->json('message'));
        }
    }

    /**
     * Get config
     *
     * @param string $key
     * @return mixed
     */
    protected function config(string $key)
    {
        return config(static::configName() . "." . $key);
    }
}