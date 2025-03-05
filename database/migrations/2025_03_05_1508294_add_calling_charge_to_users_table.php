<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->decimal('calling_charge', 10, 2)->nullable()->after('bio');
            $table->decimal('commission_percentage', 5, 2)->nullable()->after('calling_charge');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('calling_charge');
            $table->dropColumn('commission_percentage');
        });
    }
};
