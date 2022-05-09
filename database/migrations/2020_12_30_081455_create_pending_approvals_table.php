<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePendingApprovalsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pending_approvals', function (Blueprint $table) {
            $table->id();

            $table->string('ref');
            $table->string('state');
            $table->string('hash')->nullable();

            $table->unsignedBigInteger('transfer_record_id')->unique()->nullable();
            $table->foreign('transfer_record_id')->references('id')
                ->on('transfer_records')->onDelete('cascade');

            $table->longText('resource');
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
        Schema::dropIfExists('pending_approvals');
    }
}
