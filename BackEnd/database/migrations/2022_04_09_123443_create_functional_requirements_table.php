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
        Schema::create('functional_requirement', function (Blueprint $table) {
            $table->id()->autoIncrement();
            $table->unsignedBigInteger('version')->nullable();
            $table->unsignedBigInteger('author')->nullable();
            $table->unsignedBigInteger('parentId')->nullable();
            $table->unsignedBigInteger ('labelId')->nullable(); 
            $table->text('title');
            $table->text('description')->nullable();
            $table->integer('estimationTime')->nullable();
            $table->integer('elapsedTime')->nullable();
            $table->integer('status')->default(0);
            $table->unsignedBigInteger('responsible')->nullable();
            $table->foreign('parentId')->references('id')->on('functional_requirement')->onDelete('cascade');
            $table->foreign('version')->references('id')->on('version')->onDelete('cascade');
            $table->foreign('author')->references('id')->on('collaborator')->onDelete('cascade');
            $table->foreign('responsible')->references('id')->on('collaborator')->onDelete('cascade');
            $table->unsignedBigInteger('statusKanban')->references('id')->on('kanban_column')->onDelete('cascade');
           $table->foreign('labelId')->references('id')->on('labels')->onUpdate('cascade') ->onDelete('cascade');
            
            
            $table->timestamp('creationDate')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->unsignedBigInteger('backlogID')->references('id')->on('backlog')->onDelete('cascade');
        });

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('functional_requirement');
    }
};
