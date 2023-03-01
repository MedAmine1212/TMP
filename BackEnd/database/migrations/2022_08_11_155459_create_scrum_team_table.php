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
        Schema::create('scrum_team', function (Blueprint $table) {
            $table->id()->autoIncrement();
            $table->string('name', 50);
            $table->unsignedBigInteger('productOwner')->nullable();
            $table->timestamp('creationDate')->default(DB::raw('CURRENT_TIMESTAMP'));
        });
        DB::statement('ALTER TABLE scrum_team
            ADD CONSTRAINT FOREIGN KEY (productOwner) REFERENCES collaborator(id) on DELETE CASCADE;'
        );
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('scrum_team');
    }
};
