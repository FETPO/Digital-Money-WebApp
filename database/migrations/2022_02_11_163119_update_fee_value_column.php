<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateFeeValueColumn extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('withdrawal_fees', function (Blueprint $table) {
            $table->unsignedDecimal('value', 36, 18)->nullable()->change();
        });

        Schema::table('exchange_fees', function (Blueprint $table) {
            $table->unsignedDecimal('value', 36, 18)->nullable()->change();
        });
    }
}
