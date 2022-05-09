<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateWalletAccountsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('wallet_accounts', function (Blueprint $table) {
            $table->id();

            $table->bigInteger('user_id')->unsigned();
            $table->foreign('user_id')->references('id')
                ->on('users')->onDelete('cascade');

            $table->bigInteger('wallet_id')->unsigned();
            $table->foreign('wallet_id')->references('id')
                ->on('wallets')->onDelete('cascade');

            $table->unique(['user_id', 'wallet_id']);

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
        Schema::dropIfExists('wallet_accounts');
    }
}
