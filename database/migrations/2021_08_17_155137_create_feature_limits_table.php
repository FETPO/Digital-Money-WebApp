<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFeatureLimitsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('feature_limits', function (Blueprint $table) {
            $table->string('name')->primary();

            $table->unsignedDecimal('unverified_limit')->default(0);
            $table->unsignedDecimal('basic_limit')->default(0);
            $table->unsignedDecimal('advanced_limit')->default(0);

            $table->enum('type', ['amount', 'count'])->default('amount');
            $table->enum('period', ['day', 'month', 'year']);
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
        Schema::dropIfExists('feature_limits');
    }
}
