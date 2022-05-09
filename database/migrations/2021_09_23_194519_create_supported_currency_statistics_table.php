<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSupportedCurrencyStatisticsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('supported_currency_statistics', function (Blueprint $table) {
            $table->id();
            $table->decimal('balance', 14, 4)->default(0);
            $table->decimal('balance_on_trade', 14, 4)->default(0);

            $table->string('supported_currency_code');
            $table->foreign('supported_currency_code')->references('code')
                ->on('supported_currencies')->onDelete('cascade');
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
        Schema::dropIfExists('supported_currency_statistics');
    }
}
