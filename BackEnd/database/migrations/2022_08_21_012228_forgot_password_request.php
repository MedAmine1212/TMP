<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;


return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('forgot_password_request', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('collaborator');
            $table->foreign('collaborator')->references('id')->on('collaborator')->onDelete('cascade');
            $table->string('token', 80)->unique();
            $table->timestamp('creationDate')->default(DB::raw('CURRENT_TIMESTAMP'));
        });
        //
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('forgot_password_requests');

    }
};
