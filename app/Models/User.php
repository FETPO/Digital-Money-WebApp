<?php

namespace App\Models;

use App\Events\UserActivities\EmailChanged;
use App\Events\UserActivities\PhoneChanged;
use App\Events\UserPresenceChanged;
use App\Helpers\Token;
use App\Helpers\TwoFactorAuth;
use App\Helpers\UserVerification;
use App\Models\Traits\Lock;
use App\Models\Traits\TwoFactor;
use App\Notifications\Auth\VerifyEmail;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Arr;
use PHPUnit\Util\Exception;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, Notifiable, TwoFactor, SoftDeletes, HasRoles, Lock;

    protected $allRolesAttribute;
    protected $allPermissionsAttribute;
    protected $rankAttribute;
    protected $locationAttribute;
    protected $notificationSettingsAttribute;
    protected $verificationHelperAttribute;
    protected $countryOperationAttribute;
    protected $currencyAttribute;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'deactivated_until',
        'password',
        'country',
        'currency',
        'two_factor_enable',
        'phone_verified_at',
        'email_verified_at',
        'presence',
        'notifications_read_at',
        'last_seen_at',
        'last_login_at'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_secret',
        'roles',
        'permissions',
        'activities'
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'phone_verified_at'     => 'datetime',
        'email_verified_at'     => 'datetime',
        'two_factor_enable'     => 'boolean',
        'deactivated_until'     => 'datetime',
        'notifications_read_at' => 'datetime',
        'last_seen_at'          => 'datetime',
        'last_login_at'         => 'datetime',
    ];

    /**
     * The relationships that should always be loaded.
     *
     * @var array
     */
    protected $with = ['profile'];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = [
        'location',
        'currency',
        'rank',
        'country_operation',
        'is_super_admin',
        'all_permissions',
        'all_roles',
    ];

    /**
     * The "booted" method of the model.
     *
     * @return void
     */
    protected static function booted()
    {
        static::creating(function ($user) {
            $user->two_factor_secret = app(TwoFactorAuth::class)->generateSecretKey();
        });

        static::updating(function (User $user) {
            if ($user->isDirty('email')) {
                event(new EmailChanged($user));
                $user->email_verified_at = null;
            }

            if ($user->isDirty('phone')) {
                event(new PhoneChanged($user));
                $user->phone_verified_at = null;
            }
        });

        static::created(function (User $user) {
            $user->profile()->save(new UserProfile);
        });
    }

    /**
     * Get path for profile
     *
     * @return string
     */
    public function path()
    {
        return "profile/{$this->id}";
    }

    /**
     * Generate phone token
     *
     * @return array
     */
    public function generatePhoneToken()
    {
        return app(Token::class)->generate($this->phone);
    }

    /**
     * Validate phone token
     *
     * @param $token
     * @return bool
     */
    public function validatePhoneToken($token)
    {
        return app(Token::class)->validate($this->phone, $token);
    }

    /**
     * Generate email token
     *
     * @return array
     */
    public function generateEmailToken()
    {
        return app(Token::class)->generate($this->email);
    }

    /**
     * Validate email token
     *
     * @param $token
     * @return bool
     */
    public function validateEmailToken($token)
    {
        return app(Token::class)->validate($this->email, $token);
    }

    /**
     * Check if user is super_admin
     *
     * @return bool
     */
    public function getIsSuperAdminAttribute()
    {
        return $this->hasRole(Role::superAdmin());
    }

    /**
     * Get location activity
     *
     * @return mixed|null
     */
    public function getLocationAttribute()
    {
        if (!isset($this->locationAttribute)) {
            $activity = $this->activities()->latest()->first();
            $this->locationAttribute = $activity ? $activity->location : null;
        }
        return $this->locationAttribute;
    }

    /**
     * Country operation status
     *
     * @return mixed
     */
    public function getCountryOperationAttribute()
    {
        if (!isset($this->countryOperationAttribute)) {
            $this->countryOperationAttribute = OperatingCountry::where('code', $this->country)->exists();
        }
        return $this->countryOperationAttribute;
    }

    /**
     * Get currency
     *
     * @return string
     */
    public function getCurrencyAttribute($value)
    {
        if (!isset($this->currencyAttribute)) {
            $this->currencyAttribute = SupportedCurrency::find($value) ? strtoupper($value) : defaultCurrency();
        }
        return $this->currencyAttribute;
    }

    /**
     * Check if user's phone is verified
     *
     * @return \Illuminate\Support\Carbon|mixed|null
     */
    public function isPhoneVerified()
    {
        return (bool) $this->phone_verified_at;
    }

    /**
     * Check if user's email is verified
     *
     * @return \Illuminate\Support\Carbon|mixed|null
     */
    public function isEmailVerified()
    {
        return (bool) $this->email_verified_at;
    }

    /**
     * Get rank by role
     *
     * @return int|null
     */
    public function rank()
    {
        if (!isset($this->rankAttribute)) {
            $role = $this->roles()->orderBy('rank')->first();
            $this->rankAttribute = $role?->rank;
        }
        return $this->rankAttribute;
    }

    /**
     * Check if user is superior to another
     *
     * @param User $user
     * @return bool
     */
    public function superiorTo(User $user)
    {
        return !is_null($this->rank()) &&
            (is_null($user->rank()) || $this->rank() < $user->rank());
    }

    /**
     * Query subordinates
     *
     * @return Builder
     */
    public function subordinates()
    {
        if (is_null($this->rank())) {
            throw new Exception("User does not have a rank.");
        }

        return self::whereKeyNot($this->getKey())
            ->whereDoesntHave('roles', function (Builder $query) {
                $query->where('rank', '<=', $this->rank());
            });
    }

    /**
     * Rank
     *
     * @return int|null
     */
    public function getRankAttribute()
    {
        return $this->rank();
    }

    /**
     * Log user activity
     *
     * @param $action
     * @param string $ip
     * @param null $source
     * @param null $agent
     * @return \Illuminate\Database\Eloquent\Model
     */
    public function log($action, $ip = '127.0.0.1', $source = null, $agent = null)
    {
        return $this->activities()->create([
            'action'   => $action,
            'source'   => $source,
            'ip'       => $ip,
            'location' => geoip($ip)->toArray(),
            'agent'    => $agent
        ]);
    }

    /**
     * Send the email verification notification.
     *
     * @return void
     */
    public function sendEmailVerificationNotification()
    {
        $this->notify(new VerifyEmail);
    }

    /**
     * The channels the user receives notification broadcasts on.
     *
     * @return string
     */
    public function receivesBroadcastNotificationsOn()
    {
        return 'Auth.User.' . $this->id;
    }

    /**
     * Route notifications for the Nexmo channel.
     *
     * @return string
     */
    public function routeNotificationForNexmo()
    {
        return preg_replace('/\D+/', '', $this->phone);
    }

    /**
     * Route notifications for the SNS channel.
     *
     * @return string
     */
    public function routeNotificationForSns()
    {
        return $this->phone;
    }

    /**
     * Route notifications for the Twilio channel.
     *
     * @return string
     */
    public function routeNotificationForTwilio()
    {
        return $this->phone;
    }

    /**
     * Route notifications for the Africas Talking channel.
     *
     * @return string
     */
    public function routeNotificationForAfricasTalking()
    {
        return $this->phone;
    }

    /**
     * User profile
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function profile()
    {
        return $this->hasOne(UserProfile::class, 'user_id', 'id');
    }

    /**
     * Get wallet address label
     *
     * @return mixed|string
     */
    public function getWalletAddressLabel()
    {
        return $this->email;
    }

    /**
     * Get user roles
     *
     * @return array
     */
    public function getAllRolesAttribute()
    {
        if (!isset($this->allRolesAttribute)) {
            $this->allRolesAttribute = $this->roles()->orderBy('rank')
                ->get()->pluck('name')->toArray();
        }
        return $this->allRolesAttribute;
    }

    /**
     * Get user permissions
     *
     * @return array
     * @throws \Exception
     */
    public function getAllPermissionsAttribute()
    {
        if (!isset($this->allPermissionsAttribute)) {
            $this->allPermissionsAttribute = $this->getAllPermissions()->pluck('name')->toArray();
        }
        return $this->allPermissionsAttribute;
    }

    /**
     * Update authenticated user's presence
     *
     * @param $presence
     * @return User|\Illuminate\Contracts\Auth\Authenticatable|null
     */
    public function updatePresence($presence)
    {
        $oldPresence = $this->presence;

        $this->fill([
            'last_seen_at' => $this->freshTimestamp(),
            'presence'     => $presence,
        ])->save();

        if ($oldPresence != $presence) {
            broadcast(new UserPresenceChanged($this));
        }
    }

    /**
     * Check if user is deactivated
     *
     * @return bool
     */
    public function deactivated()
    {
        return $this->deactivated_until && $this->deactivated_until > now();
    }

    /**
     * User's wallet accounts
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany|WalletAccount
     */
    public function walletAccounts()
    {
        return $this->hasMany(WalletAccount::class, 'user_id', 'id');
    }

    /**
     * User's activities
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function activities()
    {
        return $this->hasMany(UserActivity::class, 'user_id', 'id');
    }

    /**
     * User's transfer records
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasManyThrough
     */
    public function transferRecords()
    {
        return $this->hasManyThrough(
            TransferRecord::class,
            WalletAccount::class,
            'user_id',
            'wallet_account_id',
            'id',
            'id'
        );
    }

    /**
     * User's exchange trades
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasManyThrough
     */
    public function exchangeTrades()
    {
        return $this->hasManyThrough(
            ExchangeTrade::class,
            WalletAccount::class,
            'user_id',
            'wallet_account_id',
            'id',
            'id'
        );
    }

    /**
     * Get notification settings
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function notificationSetting()
    {
        return $this->hasMany(UserNotificationSetting::class, 'user_id', 'id');
    }

    /**
     * Get notification settings
     *
     * @return mixed
     */
    public function getNotificationSettings()
    {
        $settings = config('notifications.settings', []);

        if (!isset($this->notificationSettingsAttribute)) {
            $this->updateNotificationSettings();

            $attribute = $this->notificationSetting()->get()
                ->map(function ($saved) use ($settings) {
                    $name = $saved['name'];

                    if (isset($settings[$name])) {
                        foreach ($settings[$name] as $channel => $status) {
                            if (is_null($status) && isset($saved[$channel])) {
                                unset($saved[$channel]);
                            }
                        }
                        $saved['title'] = trans("notifications.$name.title");
                        return $saved;
                    } else {
                        return null;
                    }
                })
                ->filter()->values()->toArray();

            $this->notificationSettingsAttribute = $attribute;
        }

        return $this->notificationSettingsAttribute;
    }

    /**
     * Update user settings
     *
     * @param array $names
     * @return \Illuminate\Database\Eloquent\Collection|void
     */
    protected function updateNotificationSettings()
    {
        $settings = config('notifications.settings', []);

        $saved = $this->notificationSetting()->get()->toArray();
        $savedNames = Arr::pluck($saved, 'name');

        $updated = array_diff(array_keys($settings), $savedNames);

        collect($updated)->each(function ($name) use ($settings) {
            $this->notificationSetting()->updateOrCreate(compact('name'), [
                'email'    => (bool) $settings[$name]['email'],
                'database' => (bool) $settings[$name]['database'],
                'sms'      => (bool) $settings[$name]['sms'],
            ]);
        });
    }

    /**
     * Get user's documents
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function documents()
    {
        return $this->hasMany(UserDocument::class, 'user_id', 'id');
    }

    /**
     * User's address
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function address()
    {
        return $this->hasOne(UserAddress::class, 'user_id', 'id');
    }

    /**
     * User's payment accounts
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function paymentAccounts()
    {
        return $this->hasMany(PaymentAccount::class, 'user_id', 'id')
            ->has('supportedCurrency');
    }

    /**
     * Current payment account.
     *
     * @return PaymentAccount
     */
    public function getPaymentAccount()
    {
        return $this->paymentAccounts()
            ->where('currency', $this->currency)
            ->firstOr(function () {
                return $this->paymentAccounts()->create([
                    'currency' => $this->currency
                ]);
            });
    }

    /**
     * Get payment account by currency
     *
     * @param string $currency
     * @return PaymentAccount
     */
    public function getPaymentAccountByCurrency(string $currency)
    {
        return $this->paymentAccounts()
            ->where('currency', $currency)
            ->firstOr(function () use ($currency) {
                return $this->paymentAccounts()->create([
                    'currency' => $currency
                ]);
            });
    }

    /**
     * User's bank accounts
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function bankAccounts()
    {
        return $this->hasMany(BankAccount::class, 'user_id', 'id')
            ->where('currency', $this->currency)
            ->where(function ($query) {
                $query->whereHas('bank.operatingCountries', function (Builder $query) {
                    $query->where('code', $this->country);
                })->orDoesntHave('bank');
            })
            ->has('supportedCurrency');
    }

    /**
     * Get operating banks
     *
     * @return Builder
     */
    public function getOperatingBanks()
    {
        return Bank::country($this->country);
    }

    /**
     * Get deposit bank account
     *
     * @return BankAccount
     */
    public function getDepositBankAccount()
    {
        return BankAccount::doesntHave('user')
            ->whereHas('bank.operatingCountries', function (Builder $query) {
                $query->where('code', $this->country);
            })
            ->has('supportedCurrency')->where('currency', $this->currency)
            ->latest()->first();
    }

    /**
     * Get verification helper
     *
     * @return UserVerification
     */
    public function verification()
    {
        if (!isset($this->verificationHelperAttribute)) {
            $this->verificationHelperAttribute = UserVerification::make($this);
        }
        return $this->verificationHelperAttribute;
    }

    /**
     * Super admin users
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeSuperAdmin($query)
    {
        return $query->role(Role::superAdmin())->latest();
    }

    /**
     * Operator users
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeOperator($query)
    {
        return $query->role(Role::operator())->latest();
    }

    /**
     * permission: view user
     *
     * @param User $user
     * @return bool
     */
    public function canViewUser(User $user)
    {
        return $this->is($user) || $this->can("view_users");
    }

    /**
     * permission: update user
     *
     * @param User $user
     * @return bool
     */
    public function canUpdateUser(User $user)
    {
        return $this->isNot($user) && $this->superiorTo($user) && $this->can("update_users");
    }

    /**
     * permission: delete user
     *
     * @param User $user
     * @return bool
     */
    public function canDeleteUser(User $user)
    {
        return $this->isNot($user) && $this->superiorTo($user) && $this->can("update_users");
    }

    /**
     * Get exchange operator
     *
     * @return User
     */
    public static function exchangeOperator()
    {
        return self::operator()->first();
    }

    /**
     * Get giftcard operator
     *
     * @return User
     */
    public static function giftcardOperator()
    {
        return self::operator()->first();
    }

    /**
     * Get wallet operator
     *
     * @return User
     */
    public static function walletOperator()
    {
        return self::operator()->first();
    }
}
