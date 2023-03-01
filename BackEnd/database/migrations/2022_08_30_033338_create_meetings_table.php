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
        Schema::create('meetings', function (Blueprint $table) {
            $table->id()->autoIncrement();
            $table->unsignedBigInteger('idSCRUMTeam')->nullable();
            $table->string('title',120);
            $table->timestamp('date')->default(DB::raw('CURRENT_TIMESTAMP'));
            
        });
        DB::statement('ALTER TABLE meetings
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
        Schema::dropIfExists('meetings');
    }
};
