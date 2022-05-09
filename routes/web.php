<?php

use App\Http\Controllers\Admin\BankController as AdminBankController;
use App\Http\Controllers\Admin\BrandController as AdminBrandController;
use App\Http\Controllers\Admin\ExchangeTradeController as AdminExchangeTradeController;
use App\Http\Controllers\Admin\FeatureLimitController as AdminFeatureLimitController;
use App\Http\Controllers\Admin\GiftcardController as AdminGiftcardController;
use App\Http\Controllers\Admin\LocaleController as AdminLocaleController;
use App\Http\Controllers\Admin\Payment\TransactionController as AdminPaymentTransactionController;
use App\Http\Controllers\Admin\PaymentController as AdminPaymentController;
use App\Http\Controllers\Admin\RequiredDocumentController as AdminRequiredDocumentController;
use App\Http\Controllers\Admin\SettingsController as AdminSettingsController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\StatisticsController;
use App\Http\Controllers\Admin\SystemLogController as AdminSystemLogController;
use App\Http\Controllers\Admin\ThemeController as AdminThemeController;
use App\Http\Controllers\Admin\User\VerificationController as AdminVerificationController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\WalletController as AdminWalletController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\ResetPasswordController;
use App\Http\Controllers\BankController;
use App\Http\Controllers\EmailVerificationController;
use App\Http\Controllers\ExchangeTradeController;
use App\Http\Controllers\FeatureLimitController;
use App\Http\Controllers\GatewayCallbackController;
use App\Http\Controllers\GiftcardController;
use App\Http\Controllers\GlobalController;
use App\Http\Controllers\GridController;
use App\Http\Controllers\IndexController;
use App\Http\Controllers\InstallerController;
use App\Http\Controllers\LocaleController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\TokenController;
use App\Http\Controllers\User\NotificationController;
use App\Http\Controllers\User\VerificationController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Wallet\AccountController;
use App\Http\Controllers\WalletController;
use App\Http\Controllers\WebHook\CoinController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::group([
    'prefix' => 'auth',
    'as'     => 'auth.',
], function () {
    Route::post('login', [LoginController::class, 'login'])->name('login');
    Route::post('register', [RegisterController::class, 'register'])->name('register')->block();
    Route::post('logout', [LoginController::class, 'logout'])->name('logout');

    Route::group([
        'prefix' => 'reset-password',
        'as'     => 'reset-password.'
    ], function () {
        Route::post('reset', [ResetPasswordController::class, 'reset'])->name('reset')->block();
        Route::post('send-email-code', [ResetPasswordController::class, 'sendEmailCode'])->name('send-email-code')->block();
        Route::post('request-token', [ResetPasswordController::class, 'requestToken'])->name('request-token')->block();
    });
});

Route::middleware('auth')->group(function () {
    Route::group([
        'prefix' => 'wallet',
        'as'     => 'wallet.',
    ], function () {
        Route::get('unused', [WalletController::class, 'unused'])->name('unused');

        Route::post('transfer-record-paginate', [
            WalletController::class, 'transferRecordPaginate'
        ])->name('transfer-record-paginate');

        Route::prefix('{wallet}')->group(function () {
            Route::post('create-account', [WalletController::class, 'createAccount'])->name('create-account')->block();
            Route::get('price', [WalletController::class, 'price'])->name('price');
            Route::post('market-chart', [WalletController::class, 'marketChart'])->name('market-chart');
        });

        Route::group([
            'prefix' => 'account',
            'as'     => 'account.',
        ], function () {
            Route::get('all', [AccountController::class, 'all'])->name('all');

            Route::prefix('{id}')->group(function () {
                Route::post('send', [AccountController::class, 'send'])->name('send')->block();
                Route::get('latest-address', [AccountController::class, 'latestAddress'])->name('latest-address');
                Route::post('estimate-fee', [AccountController::class, 'estimateFee'])->name('estimate-fee');
                Route::post('generate-address', [
                    AccountController::class, 'generateAddress'
                ])->name('generate-address')->block();
            });

            Route::get('total-available-price', [
                AccountController::class, 'totalAvailablePrice'
            ])->name('total-available-price');

            Route::get('aggregate-price', [
                AccountController::class, 'aggregatePrice'
            ])->name('aggregate-price');
        });
    });

    Route::group([
        'prefix' => 'bank',
        'as'     => 'bank.',
    ], function () {
        Route::get('get', [BankController::class, 'get'])->name('get');
        Route::post('create-account', [BankController::class, 'createAccount'])->name('create-account')->block();
        Route::get('get-accounts', [BankController::class, 'getAccounts'])->name('get-accounts');

        Route::group([
            'prefix' => 'account/{id}',
            'as'     => 'account.',
        ], function () {
            Route::delete('delete', [BankController::class, 'deleteAccount'])->name('delete')->block();
        });
    });

    Route::group([
        'prefix' => 'payment',
        'as'     => 'payment.',
    ], function () {
        Route::get('account', [PaymentController::class, 'getAccount'])->name('account');
        Route::get('deposit-methods', [PaymentController::class, 'getDepositMethods'])->name('deposit-methods');
        Route::get('daily-chart', [PaymentController::class, 'getDailyChart'])->name('daily-chart');
        Route::post('deposit', [PaymentController::class, 'deposit'])->name('deposit')->block();
        Route::post('withdraw', [PaymentController::class, 'withdraw'])->name('withdraw')->block();

        Route::post('transaction-paginate', [
            PaymentController::class, 'transactionPaginate'
        ])->name('transaction-paginate');
    });

    Route::group([
        'prefix' => 'user',
        'as'     => 'user.',
    ], function () {
        Route::get('data', [UserController::class, 'data'])->name('data');
        Route::get('notification-settings', [UserController::class, 'getNotificationSettings'])->name('notification-settings');
        Route::post('update-notification-settings', [UserController::class, 'updateNotificationSettings'])->name('update-notification-settings');
        Route::post('upload-picture', [UserController::class, 'uploadPicture'])->name('upload-picture')->block();
        Route::post('update', [UserController::class, 'update'])->name('update')->block();
        Route::post('change-password', [UserController::class, 'changePassword'])->name('change-password')->block();
        Route::post('get-two-factor', [UserController::class, 'getTwoFactor'])->name('get-two-factor');
        Route::post('reset-two-factor-token', [UserController::class, 'resetTwoFactorToken'])->name('reset-two-factor-token')->block();
        Route::post('set-two-factor', [UserController::class, 'setTwoFactor'])->name('set-two-factor')->block();
        Route::post('verify-phone-with-token', [UserController::class, 'verifyPhoneWithToken'])->name('verify-phone-with-token');
        Route::post('verify-email-with-token', [UserController::class, 'verifyEmailWithToken'])->name('verify-email-with-token');
        Route::post('set-online', [UserController::class, 'setOnline'])->name('set-online');
        Route::post('set-away', [UserController::class, 'setAway'])->name('set-away');
        Route::post('set-offline', [UserController::class, 'setOffline'])->name('set-offline');
        Route::post('activity-paginate', [UserController::class, 'activityPaginate'])->name('activity-paginate');

        Route::group([
            'prefix' => 'verification',
            'as'     => 'verification.',
        ], function () {
            Route::get('get', [VerificationController::class, 'get'])->name('get');
            Route::post('upload-document', [VerificationController::class, 'uploadDocument'])->name('upload-document')->block();
            Route::post('update-address', [VerificationController::class, 'updateAddress'])->name('update-address')->block();
        });

        Route::group([
            'prefix' => 'notification',
            'as'     => 'notification.',
        ], function () {
            Route::get('total-unread', [NotificationController::class, 'totalUnread'])->name('total-unread');
            Route::post('paginate', [NotificationController::class, 'paginate'])->name('paginate');
            Route::post('mark-all-as-read', [NotificationController::class, 'markAllAsRead'])->name('mark-all-as-read')->block();
            Route::post('clear', [NotificationController::class, 'clear'])->name('clear')->block();

            Route::prefix('{id}')->group(function () {
                Route::patch('mark-as-read', [NotificationController::class, 'markAsRead'])->name('mark-as-read')->block();
            });
        });
    });

    Route::group([
        'prefix' => 'exchange-trade',
        'as'     => 'exchange-trade.',
    ], function () {
        Route::post('calculate-buy', [ExchangeTradeController::class, 'calculateBuy'])->name('calculate-buy');
        Route::post('buy', [ExchangeTradeController::class, 'buy'])->name('buy')->block();
        Route::post('calculate-sell', [ExchangeTradeController::class, 'calculateSell'])->name('calculate-sell');
        Route::post('sell', [ExchangeTradeController::class, 'sell'])->name('sell')->block();
        Route::post('paginate', [ExchangeTradeController::class, 'paginate'])->name('paginate');
    });

    Route::group([
        'prefix' => 'giftcard',
        'as'     => 'giftcard.',
    ], function () {
        Route::get('get', [GiftcardController::class, 'get'])->name('get');
        Route::post('purchase', [GiftcardController::class, 'purchase'])->name('purchase')->block();
        Route::post('paginate', [GiftcardController::class, 'paginate'])->name('paginate');

        Route::group([
            'prefix' => 'content',
            'as'     => 'content.'
        ], function () {
            Route::post('paginate', [GiftcardController::class, 'contentPaginate'])->name('paginate');
        });

        Route::group([
            'prefix' => 'brand',
            'as'     => 'brand.'
        ], function () {
            Route::get('all', [GiftcardController::class, 'getBrands'])->name('all');
        });
    });

    Route::group([
        'prefix' => 'feature-limit',
        'as'     => 'feature-limit.',
    ], function () {
        Route::get('all', [FeatureLimitController::class, 'all'])->name('all');
    });

    Route::group([
        'as' => 'email-verification.',
    ], function () {
        Route::middleware(['signed'])
            ->get('email/verify/{id}/{hash}', [EmailVerificationController::class, "verify"])
            ->name('verify');

        Route::middleware(['throttle:6,60'])
            ->post('email/verification-notification', [EmailVerificationController::class, "sendEmail"])
            ->name('send');
    });

    Route::group([
        'prefix' => 'token',
        'as'     => 'token.',
    ], function () {
        Route::post('send-phone', [TokenController::class, "sendPhone"])->name('send-phone')->block();
        Route::post('send-email', [TokenController::class, "sendEmail"])->name('send-email')->block();
    });

    Route::group([
        'prefix' => 'gateway-callback/{order}',
        'as'     => 'gateway-callback.'
    ], function () {
        Route::get('paypal', [GatewayCallbackController::class, 'handlePaypal'])->name('paypal');
    });

    Route::group([
        'prefix' => 'grid',
        'as'     => 'grid.',
    ], function () {
        Route::group([
            'middleware' => 'permission:access_control_panel',
        ], function () {
            Route::post('set-dimensions', [GridController::class, 'setDimensions'])->name('set-dimensions');
        });

        Route::post('all', [GridController::class, 'all'])->name('all');
    });

    // *** CONTROL PANEL (admin) ***
    Route::group([
        'prefix'     => 'admin',
        'middleware' => 'permission:access_control_panel',
        'as'         => 'admin.'
    ], function () {
        Route::group([
            'prefix' => 'statistics',
            'as'     => 'statistics.'
        ], function () {
            Route::get('total-users', [StatisticsController::class, 'totalUsers'])->name('total-users');
            Route::get('total-earnings', [StatisticsController::class, 'totalEarnings'])->name('total-earnings');
            Route::get('pending-verification', [StatisticsController::class, 'pendingVerification'])->name('pending-verification');
            Route::get('pending-deposit', [StatisticsController::class, 'pendingDeposit'])->name('pending-deposit');
            Route::get('pending-withdrawal', [StatisticsController::class, 'pendingWithdrawal'])->name('pending-withdrawal');
            Route::get('registration-chart', [StatisticsController::class, 'registrationChart'])->name('registration-chart');
            Route::get('system-status', [StatisticsController::class, 'systemStatus'])->name('system-status');
            Route::get('latest-users', [StatisticsController::class, 'latestUsers'])->name('latest-users');
        });

        Route::group([
            'prefix' => 'user',
            'as'     => 'user.'
        ], function () {
            Route::post('paginate', [AdminUserController::class, 'paginate'])->name('paginate');
            Route::post('batch-deactivate', [AdminUserController::class, 'batchDeactivate'])->name('batch-deactivate')->block();
            Route::post('batch-activate', [AdminUserController::class, 'batchActivate'])->name('batch-activate')->block();

            Route::prefix('{user}')->group(function () {
                Route::post('activate', [AdminUserController::class, 'activate'])->name('activate')->block();
                Route::post('deactivate', [AdminUserController::class, 'deactivate'])->name('deactivate')->block();
            });

            Route::group([
                'prefix' => 'verification',
                'as'     => 'verification.',
            ], function () {
                Route::post('address-paginate', [AdminVerificationController::class, 'addressPaginate'])->name('address-paginate');
                Route::post('document-paginate', [AdminVerificationController::class, 'documentPaginate'])->name('document-paginate');

                Route::prefix('{document}')->group(function () {
                    Route::post('approve-document', [AdminVerificationController::class, 'approveDocument'])->name('approve-document')->block();
                    Route::post('reject-document', [AdminVerificationController::class, 'rejectDocument'])->name('reject-document')->block();
                    Route::get('download-document', [AdminVerificationController::class, 'downloadDocument'])->name('download-document');
                });

                Route::prefix('{address}')->group(function () {
                    Route::post('approve-address', [AdminVerificationController::class, 'approveAddress'])->name('approve-address')->block();
                    Route::post('reject-address', [AdminVerificationController::class, 'rejectAddress'])->name('reject-address')->block();
                });
            });
        });

        Route::group([
            'prefix' => 'role',
            'as'     => 'role.'
        ], function () {
            Route::post('paginate', [RoleController::class, 'paginate'])->name('paginate');
            Route::post('create', [RoleController::class, 'create'])->name('create')->block();
            Route::delete('{role}/delete', [RoleController::class, 'delete'])->name('delete')->block();
            Route::put('{role}/update', [RoleController::class, 'update'])->name('update')->block();
            Route::get('get-permissions', [RoleController::class, 'getPermissions'])->name('get-permissions');
            Route::get('all', [RoleController::class, 'all'])->name('all');
            Route::post('assign/{user}', [RoleController::class, 'assign'])->name('assign')->block();
        });

        Route::group([
            'prefix' => 'wallet',
            'as'     => 'wallet.'
        ], function () {
            Route::post('create', [AdminWalletController::class, 'create'])->name('create')->block();

            Route::prefix('{identifier}')->group(function () {
                Route::delete('delete', [AdminWalletController::class, 'delete'])->name('delete')->block();
                Route::post('consolidate', [AdminWalletController::class, 'consolidate'])->name('consolidate')->block();
                Route::post('relay-transaction', [AdminWalletController::class, 'relayTransaction'])->name('relay-transaction')->block();
                Route::post('reset-webhook', [AdminWalletController::class, 'resetWebhook'])->name('reset-webhook')->block();
            });

            Route::get('get-adapters', [AdminWalletController::class, 'getAdapters'])->name('get-adapters');
            Route::post('paginate', [AdminWalletController::class, 'paginate'])->name('paginate');

            Route::get('get-withdrawal-fees', [AdminWalletController::class, 'getWithdrawalFees'])->name('get-withdrawal-fees');
            Route::post('update-withdrawal-fees', [AdminWalletController::class, 'updateWithdrawalFees'])->name('update-withdrawal-fees')->block();

            Route::get('get-exchange-fees', [AdminWalletController::class, 'getExchangeFees'])->name('get-exchange-fees');
            Route::post('update-exchange-fees', [AdminWalletController::class, 'updateExchangeFees'])->name('update-exchange-fees')->block();

            Route::group([
                'prefix' => 'transfer-record',
                'as'     => 'transfer-record.'
            ], function () {
                Route::post('paginate', [AdminWalletController::class, 'transferRecordPaginate'])->name('paginate');
                Route::post('{record}/remove', [AdminWalletController::class, 'transferRecordRemove'])->name('remove')->block();
            });
        });

        Route::group([
            'prefix' => 'payment',
            'as'     => 'payment.'
        ], function () {
            Route::get('get-currencies', [AdminPaymentController::class, 'getCurrencies'])->name('get-currencies');

            Route::group([
                'prefix' => 'supported-currency',
                'as'     => 'supported-currency.'
            ], function () {
                Route::post('paginate', [AdminPaymentController::class, 'supportedCurrencyPaginate'])->name('paginate');
                Route::post('create', [AdminPaymentController::class, 'createSupportedCurrency'])->name('create')->block();

                Route::prefix('{currency}')->group(function () {
                    Route::post('update', [AdminPaymentController::class, 'updateSupportedCurrency'])->name('update')->block();
                    Route::post('make-default', [AdminPaymentController::class, 'makeSupportedCurrencyDefault'])->name('make-default')->block();
                    Route::delete('delete', [AdminPaymentController::class, 'deleteSupportedCurrency'])->name('delete')->block();
                });
            });

            Route::group([
                'prefix' => 'transaction',
                'as'     => 'transaction.'
            ], function () {
                Route::post('paginate', [AdminPaymentTransactionController::class, 'paginate'])->name('paginate');

                Route::post('pending-transfer-receive-paginate', [
                    AdminPaymentTransactionController::class, 'pendingTransferReceivePaginate'
                ])->name('pending-transfer-receive-paginate');

                Route::post('pending-transfer-send-paginate', [
                    AdminPaymentTransactionController::class, 'pendingTransferSendPaginate'
                ])->name('pending-transfer-send-paginate');

                Route::prefix('{transaction}')->group(function () {
                    Route::post('complete-transfer', [AdminPaymentTransactionController::class, 'completeTransfer'])->name('complete-transfer')->block();
                    Route::post('cancel-transfer', [AdminPaymentTransactionController::class, 'cancelTransfer'])->name('cancel-transfer')->block();
                });
            });
        });

        Route::group([
            'prefix' => 'bank',
            'as'     => 'bank.'
        ], function () {
            Route::post('create', [AdminBankController::class, 'create'])->name('create')->block();
            Route::get('get-available-countries', [AdminBankController::class, 'getAvailableCountries'])->name('get-available-countries');
            Route::get('get-operating-banks', [AdminBankController::class, 'getOperatingBanks'])->name('get-operating-banks');
            Route::post('paginate', [AdminBankController::class, 'paginate'])->name('paginate');

            Route::prefix('{bank}')->group(function () {
                Route::put('update', [AdminBankController::class, 'update'])->name('update')->block();
                Route::post('set-logo', [AdminBankController::class, 'setLogo'])->name('set-logo')->block();
                Route::delete('delete', [AdminBankController::class, 'delete'])->name('delete')->block();
            });

            Route::group([
                'prefix' => 'operating-country',
                'as'     => 'operating-country.'
            ], function () {
                Route::post('paginate', [AdminBankController::class, 'operatingCountryPaginate'])->name('paginate');
                Route::post('create', [AdminBankController::class, 'createOperatingCountry'])->name('create')->block();

                Route::prefix('{country}')->group(function () {
                    Route::delete('delete', [AdminBankController::class, 'deleteOperatingCountry'])->name('delete')->block();
                });
            });

            Route::group([
                'prefix' => 'account',
                'as'     => 'account.'
            ], function () {
                Route::post('paginate', [AdminBankController::class, 'accountPaginate'])->name('paginate');
                Route::post('create', [AdminBankController::class, 'createAccount'])->name('create')->block();

                Route::prefix('{account}')->group(function () {
                    Route::delete('delete', [AdminBankController::class, 'deleteAccount'])->name('delete')->block();
                });
            });
        });

        Route::group([
            'prefix' => 'exchange-trade',
            'as'     => 'exchange-trade.'
        ], function () {
            Route::post('paginate', [AdminExchangeTradeController::class, 'paginate'])->name('paginate');

            Route::prefix('{trade}')->group(function () {
                Route::patch('complete-pending-buy', [AdminExchangeTradeController::class, 'completePendingBuy'])->name('complete-pending-buy')->block();
                Route::patch('cancel-pending', [AdminExchangeTradeController::class, 'cancelPending'])->name('cancel-pending')->block();
            });
        });

        Route::group([
            'prefix' => 'giftcard',
            'as'     => 'giftcard.'
        ], function () {
            Route::post('paginate', [AdminGiftcardController::class, 'paginate'])->name('paginate');
            Route::post('create', [AdminGiftcardController::class, 'create'])->name('create')->block();

            Route::prefix('{giftcard}')->group(function () {
                Route::put('update', [AdminGiftcardController::class, 'update'])->name('update')->block();
                Route::post('upload-thumbnail', [AdminGiftcardController::class, 'uploadThumbnail'])->name('upload-thumbnail')->block();
                Route::delete('delete', [AdminGiftcardController::class, 'delete'])->name('delete')->block();

                Route::group([
                    'prefix' => 'content',
                    'as'     => 'content.'
                ], function () {
                    Route::post('paginate', [AdminGiftcardController::class, 'contentPaginate'])->name('paginate');
                    Route::post('create', [AdminGiftcardController::class, 'createContent'])->name('create')->block();

                    Route::prefix('{content}')->group(function () {
                        Route::delete('delete', [AdminGiftcardController::class, 'deleteContent'])->name('delete')->block();
                    });
                });
            });

            Route::group([
                'prefix' => 'content',
                'as'     => 'content.'
            ], function () {
                Route::post('purchased-paginate', [AdminGiftcardController::class, 'purchasedContentPaginate'])->name('purchased-paginate');
            });

            Route::group([
                'prefix' => 'brand',
                'as'     => 'brand.'
            ], function () {
                Route::get('all', [AdminGiftcardController::class, 'getBrands'])->name('all');
                Route::post('paginate', [AdminGiftcardController::class, 'brandPaginate'])->name('paginate');
                Route::post('create', [AdminGiftcardController::class, 'createBrand'])->name('create')->block();

                Route::prefix('{brand}')->group(function () {
                    Route::delete('delete', [AdminGiftcardController::class, 'deleteBrand'])->name('delete')->block();
                    Route::put('update', [AdminGiftcardController::class, 'updateBrand'])->name('update')->block();
                });
            });
        });

        Route::group([
            'prefix' => 'locale',
            'as'     => 'locale.'
        ], function () {
            Route::get('get', [AdminLocaleController::class, 'get'])->name('get');
            Route::post('remove', [AdminLocaleController::class, 'remove'])->name('remove')->block();
            Route::post('add', [AdminLocaleController::class, 'add'])->name('add')->block();
            Route::post('import', [AdminLocaleController::class, 'import'])->name('import')->block();

            Route::group([
                'prefix' => 'group/{group}',
                'as'     => 'group.'
            ], function () {
                Route::get('get', [AdminLocaleController::class, 'getGroup'])->name('get');
                Route::patch('update', [AdminLocaleController::class, 'updateGroup'])->name('update')->middleware('restrict.demo')->block();
                Route::post('export', [AdminLocaleController::class, 'exportGroup'])->name('export')->middleware('restrict.demo')->block();
            });
        });

        Route::group([
            'prefix' => 'theme',
            'as'     => 'theme.'
        ], function () {
            Route::post('set-mode', [AdminThemeController::class, 'setMode'])->name('set-mode')->block();
            Route::post('set-direction', [AdminThemeController::class, 'setDirection'])->name('set-direction')->middleware('restrict.demo')->block();
            Route::post('set-color', [AdminThemeController::class, 'setColor'])->name('set-color')->block();
        });

        Route::group([
            'prefix' => 'brand',
            'as'     => 'brand.'
        ], function () {
            Route::post('upload-favicon', [AdminBrandController::class, 'uploadFavicon'])->name('upload-favicon')->middleware('restrict.demo')->block();
            Route::post('update-social-links', [AdminBrandController::class, 'updateSocialLinks'])->name('update-social-links')->middleware('restrict.demo')->block();
            Route::post('upload-logo', [AdminBrandController::class, 'uploadLogo'])->name('upload-logo')->middleware('restrict.demo')->block();
        });

        Route::group([
            'prefix' => 'settings',
            'as'     => 'settings.'
        ], function () {
            Route::get('get', [AdminSettingsController::class, 'get'])->name('get');
            Route::post('update', [AdminSettingsController::class, 'update'])->name('update')->middleware('restrict.demo')->block();

            Route::get('get-gateway', [AdminSettingsController::class, 'getGateway'])->name('get-gateway');
            Route::post('update-gateway', [AdminSettingsController::class, 'updateGateway'])->name('update-gateway')->middleware('restrict.demo')->block();
        });

        Route::group([
            'prefix' => 'feature-limit',
            'as'     => 'feature-limit.'
        ], function () {
            Route::get('get', [AdminFeatureLimitController::class, 'get'])->name('get');
            Route::post('update', [AdminFeatureLimitController::class, 'update'])->name('update')->block();

            Route::get('get-settings', [AdminFeatureLimitController::class, 'getSettings'])->name('get-settings');
            Route::post('update-settings', [AdminFeatureLimitController::class, 'updateSettings'])->name('update-settings')->block();
        });

        Route::group([
            'prefix' => 'required-document',
            'as'     => 'required-document.'
        ], function () {
            Route::post('paginate', [AdminRequiredDocumentController::class, 'paginate'])->name('paginate');
            Route::post('create', [AdminRequiredDocumentController::class, 'create'])->name('create')->block();

            Route::prefix('{document}')->group(function () {
                Route::delete('delete', [AdminRequiredDocumentController::class, 'delete'])->name('delete')->block();
                Route::put('update', [AdminRequiredDocumentController::class, 'update'])->name('update')->block();
            });
        });

        Route::group([
            'prefix' => 'system-logs',
            'as'     => 'system-logs.'
        ], function () {
            Route::post('paginate', [AdminSystemLogController::class, 'paginate'])->name('paginate');
            Route::post('mark-all-as-seen', [AdminSystemLogController::class, 'markAllAsSeen'])->name('mark-all-as-seen')->block();

            Route::prefix('{log}')->group(function () {
                Route::post('mark-as-seen', [AdminSystemLogController::class, 'markAsSeen'])->name('mark-as-seen')->block();
            });
        });
    });
});

Route::group([
    'prefix' => 'global',
    'as'     => 'global.',
], function () {
    Route::get('wallets', [GlobalController::class, 'wallets'])->name('wallets');
    Route::get('supported-currencies', [GlobalController::class, 'supportedCurrencies'])->name('supported-currencies');
    Route::get('countries', [GlobalController::class, 'countries'])->name('countries');
    Route::get('operating-countries', [GlobalController::class, 'operatingCountries'])->name('operating-countries');
});

// Webhook
Route::group([
    'prefix' => 'webhook',
    'as'     => 'webhook.'
], function () {
    Route::group([
        'prefix' => 'coin',
        'as'     => 'coin.',
    ], function () {
        Route::prefix('{identifier}')->group(function () {
            Route::post('pending-approval', [CoinController::class, 'handlePendingApprovalWebhook'])->name('pending-approval');
            Route::post('transaction', [CoinController::class, 'handleTransactionWebhook'])->name('transaction');
        });
    });
});

// IP Address Data
Route::group([
    'prefix' => 'ip',
    'as'     => 'ip.',
], function () {
    Route::post('info', [IndexController::class, 'ipInfo'])->name('info');
});

// Locale Routes
Route::group([
    'prefix' => 'locale',
    'as'     => 'locale.',
], function () {
    Route::post('set', [LocaleController::class, 'set'])->name('set');
    Route::post('get', [LocaleController::class, 'get'])->name('get');
});

Route::group([
    'as' => 'installer.'
], function () {
    Route::get('installer', [InstallerController::class, 'view']);
    Route::post('installer/register', [InstallerController::class, 'register'])->name('register');
    Route::post('installer/install', [InstallerController::class, 'install'])->name('install');
});



Route::get('{any?}', [IndexController::class, 'view'])
    ->middleware('installer.redirect')
    ->middleware(Spatie\Csp\AddCspHeaders::class)
    ->where('any', '.*')->name('index');
