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
        Schema::create('works_on', function (Blueprint $table) {
            $table->id()->autoIncrement();
            $table->unsignedBigInteger('idProject');
            $table->unsignedBigInteger('idSCRUMTeam');
            $table->unsignedBigInteger('kanbanTable')->nullable();
            $table->timestamp('startDate')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('endDate')->nullable();
            $table->integer(1);
            $table->foreign('idProject')->references('id')->on('project')->onDelete('cascade');
        });
        DB::statement('ALTER TABLE works_on
            ADD CONSTRAINT FOREIGN KEY (idSCRUMTeam) REFERENCES scrum_team(id) on DELETE CASCADE;'
        );
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('works_on');
    }
};
