<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOperatingCountryBankTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('operating_country_bank', function (Blueprint $table) {
            $table->id();

            $table->string('operating_country_code');
            $table->foreign('operating_country_code')->references('code')
                ->on('operating_countries')->onDelete('cascade');

            $table->bigInteger('bank_id')->unsigned();
            $table->foreign('bank_id')->references('id')
                ->on('banks')->onDelete('cascade');

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
        Schema::dropIfExists('operating_country_bank');
    }
}
