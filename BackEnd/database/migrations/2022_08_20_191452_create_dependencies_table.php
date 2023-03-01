<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('dependencies', function (Blueprint $table) {
            $table->id();
            $table->integer('dependencyType')->default(1);
            $table->unsignedBigInteger('mainTask')->nullable();
            $table->unsignedBigInteger('dependentTask')->nullable();
            $table->foreign('mainTask')->references('id')->on('functional_requirement')->onDelete('cascade');
            $table->foreign('dependentTask')->references('id')->on('functional_requirement')->onDelete('cascade');
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
        Schema::dropIfExists('dependencies');
    }
};
