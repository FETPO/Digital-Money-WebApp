<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('email')->unique();
            $table->string('phone')->unique()->nullable();
            $table->dateTime('deactivated_until')->nullable();
            $table->string('password');

            $table->boolean('two_factor_enable')->default(false);
            $table->text('two_factor_secret');

            $table->string('country')->nullable();
            $table->string('currency')->nullable();

            $table->dateTime('phone_verified_at')->nullable();
            $table->dateTime('email_verified_at')->nullable();

            $table->enum('presence', ['online', 'away', 'offline'])
                ->default('offline');

            $table->timestamp('notifications_read_at')->nullable();
            $table->timestamp('last_seen_at')->nullable();
            $table->timestamp('last_login_at')->nullable();

            $table->softDeletes();
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
