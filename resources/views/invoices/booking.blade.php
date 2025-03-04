<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice #{{ $booking->reference_number }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 14px;
            color: #333;
            line-height: 1.5;
        }
        .container {
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .invoice-header {
            text-align: center;
            margin-bottom: 30px;
        }
        .invoice-header h1 {
            font-size: 24px;
            color: #2c3e50;
            margin-bottom: 5px;
        }
        .invoice-number {
            font-size: 16px;
            color: #7f8c8d;
        }
        .invoice-status {
            margin-top: 10px;
            padding: 5px 10px;
            display: inline-block;
            border-radius: 4px;
            font-weight: bold;
        }
        .status-completed {
            background-color: #dff0d8;
            color: #3c763d;
        }
        .status-pending {
            background-color: #fcf8e3;
            color: #8a6d3b;
        }
        .status-cancelled {
            background-color: #f2dede;
            color: #a94442;
        }
        .company-details, .client-details {
            margin-bottom: 30px;
        }
        .section-title {
            font-size: 16px;
            font-weight: bold;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
            margin-bottom: 10px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        th, td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background-color: #f9f9f9;
        }
        .text-right {
            text-align: right;
        }
        .total-row {
            font-weight: bold;
            font-size: 16px;
        }
        .payment-info, .notes {
            margin-bottom: 30px;
        }
        .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 12px;
            color: #7f8c8d;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="invoice-header">
            <h1>INVOICE</h1>
            <div class="invoice-number">Invoice #{{ $booking->reference_number }}</div>
            <div class="invoice-status status-{{ $booking->status }}">
                {{ ucfirst($booking->status) }}
            </div>
        </div>

        <div class="row">
            <div class="company-details">
                <div class="section-title">Provider Details</div>
                <p><strong>{{ $provider->name }}</strong></p>
                <p>{{ $provider->email }}</p>
                <p>{{ $provider->phone ?? 'N/A' }}</p>
                <p>{{ $provider->address ?? 'N/A' }}</p>
            </div>

            <div class="client-details">
                <div class="section-title">Client Details</div>
                <p><strong>{{ $client->name }}</strong></p>
                <p>{{ $client->email }}</p>
                <p>{{ $booking->phone }}</p>
                <p>{{ $booking->address }}</p>
            </div>
        </div>

        <div class="booking-details">
            <div class="section-title">Booking Details</div>
            <p><strong>Service:</strong> {{ $service->title }}</p>
            <p><strong>Booking Date:</strong> {{ date('d/m/Y', strtotime($booking->booking_date)) }}</p>
            <p><strong>Booking Time:</strong> {{ date('h:i A', strtotime($booking->booking_time)) }}</p>
            <p><strong>Booking Created:</strong> {{ date('d/m/Y', strtotime($booking->created_at)) }}</p>
            @if($booking->completed_at)
                <p><strong>Service Completed:</strong> {{ date('d/m/Y', strtotime($booking->completed_at)) }}</p>
            @endif
        </div>

        <table>
            <thead>
                <tr>
                    <th>Description</th>
                    <th class="text-right">Amount</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{{ $service->title }}</td>
                    <td class="text-right">£{{ number_format($booking->total_amount, 2) }}</td>
                </tr>
                @if($booking->booking_fee > 0)
                <tr>
                    <td>Booking Fee ({{ $booking->booking_fee_status }})</td>
                    <td class="text-right">£{{ number_format($booking->booking_fee, 2) }}</td>
                </tr>
                <tr>
                    <td>Remaining Balance</td>
                    <td class="text-right">£{{ number_format($booking->remaining_amount, 2) }}</td>
                </tr>
                @endif
                <tr class="total-row">
                    <td>Total</td>
                    <td class="text-right">£{{ number_format($booking->total_amount, 2) }}</td>
                </tr>
            </tbody>
        </table>

        <div class="payment-info">
            <div class="section-title">Payment Information</div>
            <p><strong>Payment Method:</strong> {{ ucfirst(str_replace('_', ' ', $booking->payment_method)) }}</p>
            <p><strong>Payment Status:</strong> {{ ucfirst($booking->payment_status) }}</p>
            @if($booking->transaction_id)
                <p><strong>Transaction ID:</strong> {{ $booking->transaction_id }}</p>
            @endif
        </div>

        @if($booking->notes)
        <div class="notes">
            <div class="section-title">Notes</div>
            <p>{{ $booking->notes }}</p>
        </div>
        @endif

        <div class="footer">
            <p>Thank you for your business!</p>
            <p>This invoice was automatically generated.</p>
        </div>
    </div>
</body>
</html>
