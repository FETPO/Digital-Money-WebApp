<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGiftcardsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('giftcards', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('label');
            $table->string('thumbnail')->nullable();
            $table->text('description');
            $table->text('instruction');
            $table->decimal('value', 18, 0)->unsigned();
            $table->string('currency');

            $table->bigInteger('brand_id')->unsigned();
            $table->foreign('brand_id')->references('id')
                ->on('giftcard_brands')->onDelete('cascade');
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
        Schema::dropIfExists('giftcards');
    }
}
