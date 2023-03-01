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
        Schema::create('kanban_table', function (Blueprint $table) {
            $table->id()->autoIncrement();
            $table->string('name', 50);
        });
        DB::statement('ALTER TABLE works_on
        ADD CONSTRAINT FOREIGN KEY (kanbanTable) REFERENCES kanban_table(id) on DELETE CASCADE;');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('kanban_table');
    }
};
