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
        Schema::table('bookings', function (Blueprint $table) {
            $table->renameColumn('booking_fee', 'calling_charge');

            // Add commission related fields
            $table->decimal('commission_percentage', 5, 2)->nullable()->after('remaining_amount');
            $table->decimal('commission_amount', 10, 2)->nullable()->after('commission_percentage');
            $table->decimal('provider_amount', 10, 2)->nullable()->after('commission_amount');

            // Rename booking_fee_status to calling_charge_status
            $table->renameColumn('booking_fee_status', 'calling_charge_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->renameColumn('calling_charge', 'booking_fee');
            $table->renameColumn('calling_charge_status', 'booking_fee_status');
            $table->dropColumn(['commission_percentage', 'commission_amount', 'provider_amount']);
        });
    }
};
