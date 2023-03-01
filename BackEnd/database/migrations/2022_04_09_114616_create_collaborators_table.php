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
        Schema::create('collaborator', function (Blueprint $table) {
            $table->id()->autoIncrement();
            $table->string('firstName', 25)->nullable()->default('');
            $table->string('lastName', 25)->nullable()->default('');
            $table->string('phone', 20)->nullable()->default('');
            $table->enum('memberType', [1,2, 3])->default(3);
            $table->string('email',100)->unique();
            $table->string('password', 255);
            $table->enum('status', [-1,0,1 ])->default(0); // -1 deleted //0 not verified // 1 verified 
            $table->string('invitationToken',80)->unique()->nullable();
            $table->text('picture')->default("default.jpeg");

            $table->timestamp('creationDate')->default(DB::raw('CURRENT_TIMESTAMP'));
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('collaborator');
    }
};
