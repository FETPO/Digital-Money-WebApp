<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGiftcardContentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('giftcard_contents', function (Blueprint $table) {
            $table->id();
            $table->string('serial');
            $table->text('code');
            $table->dateTime('bought_at')->nullable();

            $table->bigInteger('giftcard_id')->unsigned();
            $table->foreign('giftcard_id')->references('id')
                ->on('giftcards')->onDelete('cascade');

            $table->bigInteger('buyer_id')->unsigned()->nullable();
            $table->foreign('buyer_id')->references('id')
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
        Schema::dropIfExists('giftcard_contents');
    }
}
