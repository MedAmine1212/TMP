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
        Schema::create('join_meetings', function (Blueprint $table) {
            $table->id()->autoIncrement();
            $table->unsignedBigInteger('idMeeting')->nullable();
            $table->unsignedBigInteger('idCollaborator')->nullable();
            $table->integer('status')->default(1);

        });
        DB::statement('ALTER TABLE join_meetings
            ADD CONSTRAINT FOREIGN KEY (idMeeting) REFERENCES meetings(id) on DELETE CASCADE;'
        );
        DB::statement('ALTER TABLE join_meetings
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
        Schema::dropIfExists('join_meetings');
    }
};
