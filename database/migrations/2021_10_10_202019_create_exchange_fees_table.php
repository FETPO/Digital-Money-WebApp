<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateExchangeFeesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('exchange_fees', function (Blueprint $table) {
            $table->id();

            $table->enum('category', ['buy', 'sell']);
            $table->enum('type', ['percent', 'fixed']);
            $table->unsignedDouble('value')->nullable();

            $table->unsignedBigInteger('wallet_id');
            $table->foreign('wallet_id')->references('id')
                ->on('wallets')->onDelete('cascade');

            $table->unique(['category', 'wallet_id']);

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
        Schema::dropIfExists('exchange_fees');
    }
}
