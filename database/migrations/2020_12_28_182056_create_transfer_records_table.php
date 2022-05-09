<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTransferRecordsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('transfer_records', function (Blueprint $table) {
            $table->id();

            $table->decimal('value', 36, 0)->unsigned();
            $table->text('description')->nullable();
            $table->string('address')->nullable();
            $table->integer('required_confirmations')->default(0);
            $table->integer('confirmations')->default(0);
            $table->decimal('dollar_price')->unsigned();
            $table->enum('type', ['send', 'receive']);
            $table->boolean('external')->default(false);

            $table->decimal('balance', 36, 0)->default(0);

            $table->unsignedBigInteger('wallet_transaction_id')->nullable();
            $table->foreign('wallet_transaction_id')->references('id')
                ->on('wallet_transactions')->onDelete('set null');

            $table->unsignedBigInteger('wallet_account_id');
            $table->foreign('wallet_account_id')->references('id')
                ->on('wallet_accounts')->onDelete('cascade');

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
        Schema::dropIfExists('transfer_records');
    }
}
