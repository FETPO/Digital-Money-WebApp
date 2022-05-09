<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateDollarPriceColumn extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('transfer_records', function (Blueprint $table) {
            $table->decimal('dollar_price', 36, 18)->unsigned()->change();
        });

        Schema::table('exchange_trades', function (Blueprint $table) {
            $table->decimal('dollar_price', 36, 18)->unsigned()->change();
        });
    }
}
