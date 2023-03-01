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
        Schema::create('join_team', function (Blueprint $table) {
            $table->id()->autoIncrement();
            $table->unsignedBigInteger('idCollaborator')->nullable();
            $table->unsignedBigInteger('idSCRUMTeam')->nullable();
            $table->string('role', 30)->nullable()->default('');
            $table->integer('status')->default(0);
            $table->timestamp('dateJoined')->default(DB::raw('CURRENT_TIMESTAMP'));
        });

        DB::statement('ALTER TABLE join_team
            ADD CONSTRAINT FOREIGN KEY (idSCRUMTeam) REFERENCES scrum_team(id) on DELETE CASCADE;'
        );

        DB::statement('ALTER TABLE join_team
            ADD CONSTRAINT FOREIGN KEY (idCollaborator) REFERENCES collaborator(id) on DELETE CASCADE;'
        );
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('join_team');
    }
};
