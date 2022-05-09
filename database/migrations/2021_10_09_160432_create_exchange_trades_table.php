<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateExchangeTradesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('exchange_trades', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['buy', 'sell']);
            $table->enum('status', ['completed', 'pending', 'canceled'])->default('pending');

            $table->decimal('wallet_value', 36, 0)->unsigned();
            $table->decimal('fee_value', 36, 0)->unsigned();
            $table->decimal('payment_value', 18, 0)->unsigned();

            $table->decimal('dollar_price')->unsigned();
            $table->dateTime('completed_at')->nullable();

            $table->bigInteger('payment_account_id')->unsigned();
            $table->foreign('payment_account_id')->references('id')
                ->on('payment_accounts')->onDelete('cascade');

            $table->unsignedBigInteger('wallet_account_id');
            $table->foreign('wallet_account_id')->references('id')
                ->on('wallet_accounts')->onDelete('cascade');

            $table->bigInteger('trader_id')->unsigned();
            $table->foreign('trader_id')->references('id')
                ->on('users')->onDelete('cascade');

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
        Schema::dropIfExists('exchange_trades');
    }
}
