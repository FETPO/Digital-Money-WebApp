<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateWalletStatisticsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('wallet_statistics', function (Blueprint $table) {
            $table->id();
            $table->decimal('balance', 36, 18)->default(0);
            $table->decimal('balance_on_trade', 36, 18)->default(0);

            $table->bigInteger('wallet_id')->unsigned();
            $table->foreign('wallet_id')->references('id')
                ->on('wallets')->onDelete('cascade');
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
        Schema::dropIfExists('wallet_statistics');
    }
}
