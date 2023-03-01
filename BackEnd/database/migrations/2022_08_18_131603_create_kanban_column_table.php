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
        Schema::create('kanban_column', function (Blueprint $table) {
            $table->id()->autoIncrement();
            $table->string('name', 50);
            $table->unsignedBigInteger('kanbanTable')->nullable();
            $table->integer("order");
            $table->foreign('kanbanTable')->references('id')->on('kanban_table')->onDelete('cascade');
        });

    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('kanban_column');
    }
};
