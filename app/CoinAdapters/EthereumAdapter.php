<?php

namespace App\CoinAdapters;

use App\CoinAdapters\Contracts\Adapter;
use App\CoinAdapters\Contracts\CoinGecko;
use App\CoinAdapters\Contracts\Consolidates;
use App\CoinAdapters\Exceptions\AdapterException;
use App\CoinAdapters\Resources\Address;
use App\CoinAdapters\Resources\Transaction;
use App\CoinAdapters\Resources\Wallet;
use Brick\Math\BigDecimal;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Arr;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;

class EthereumAdapter implements Adapter, Consolidates, CoinGecko
{
    use CoinPrice;

    const NAME = "Ethereum";
    const IDENTIFIER = "eth";
    const BASE_UNIT = "1000000000000000000";
    const PRECISION = 8;
    const CURRENCY_PRECISION = 2;
    const SYMBOL = "ETH";
    const SYMBOL_FIRST = true;
    const COLOR = "#627EEA";

    /**
     * @var PendingRequest
     */
    protected PendingRequest $client;

    /**
     * Ethereum constructor.
     *
     * @return void
     */
    public function __construct()
    {
        $this->init();
    }

    /**
     * Exclude properties
     *
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
    private function init()
    {
        $this->client = Http::baseUrl('http://ethereum-api:7000/')->acceptJson();
    }

    /**
     * @inheritDoc
     */
    public function adapterName(): string
    {
        return static::NAME;
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
    protected function getSvgIconPath()
    {
        return app_path("CoinAdapters/svgIcons/{$this->getIdentifier()}.json");
    }

    /**
     * @inheritDoc
     * @throws AdapterException
     */
    public function createWallet(string $label, string $passphrase): Wallet
    {
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
        return $this->handleError(function () use ($wallet, $address, $passphrase) {
            return $this->client->post("wallets/{$wallet->getId()}/consolidate", [
                'address'  => $address,
                'password' => $passphrase
            ])->throw()->json('hash');
        });
    }

    /**
     * @inheritDoc
     * @throws AdapterException
     */
    public function send(Wallet $wallet, string $address, $amount, $passphrase)
    {
        return $this->handleError(function () use ($wallet, $address, $amount, $passphrase) {
            $response = $this->client->post("wallets/{$wallet->getId()}/send", [
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
            $response = $this->client->get("wallets/{$wallet->getId()}/transactions/$id")->throw();
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
            return $this->client->post('webhooks/transaction', [
                'url'    => $this->getTransactionWebhookUrl(),
                'wallet' => $wallet->getId(),
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
     * @inheritDoc
     * @throws RequestException
     */
    public function estimateTransactionFee(int $inputs, int $outputs, $amount = 0, int $minConf = null)
    {
        $gasPrice = $this->client->get('gas-price')->throw()->json('gasPrice');

        return (string) BigDecimal::of($gasPrice)
            ->multipliedBy(21000)
            ->multipliedBy(($inputs * 1.5) + 1);
    }

    /**
     * @inheritDoc
     */
    public function getMinimumTransferable()
    {
        return (string) BigDecimal::of("21000000000000");
    }

    /**
     * @inheritDoc
     */
    public function getMaximumTransferable()
    {
        return (string) BigDecimal::of($this->getBaseUnit())->multipliedBy(1000);
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
     * @throws Exceptions\ValidationException
     */
    protected function createWalletResource(Collection $data, $password)
    {
        return new Wallet([
            'id'       => $data->get('id'),
            'password' => encrypt($password),
            'data'     => $data->toArray()
        ]);
    }

    /**
     * Create address resource
     *
     * @param Collection $data
     * @return Address
     * @throws Exceptions\ValidationException
     */
    protected function createAddressResource(Collection $data)
    {
        return new Address([
            'label'   => $data->get('label'),
            'id'      => $data->get('address'),
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
     * @inheritDoc
     */
    public function coinGeckoId(): string
    {
        return "ethereum";
    }
}