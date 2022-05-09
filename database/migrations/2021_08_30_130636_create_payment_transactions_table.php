<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePaymentTransactionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('payment_transactions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->enum('type', ['send', 'receive']);
            $table->decimal('value', 18, 0)->unsigned();
            $table->enum('status', ['completed', 'pending-transfer', 'pending-gateway', 'canceled']);
            $table->text('description')->nullable();

            $table->decimal('balance', 18, 0)->default(0);

            $table->string('gateway_ref')->unique()->nullable();
            $table->string('gateway_name')->nullable();
            $table->string('gateway_url')->nullable();

            $table->string('transfer_bank')->nullable();
            $table->string('transfer_beneficiary')->nullable();
            $table->string('transfer_number')->nullable();
            $table->string('transfer_country')->nullable();
            $table->text('transfer_note')->nullable();

            $table->bigInteger('payment_account_id')->unsigned();
            $table->foreign('payment_account_id')->references('id')
                ->on('payment_accounts')->onDelete('cascade');
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
        Schema::dropIfExists('payment_transactions');
    }
}
