import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { jsPDF } from "jspdf";
import Layout from "../components/Layout";
import subscriptionService from "../services/subscriptionService";

const PaymentHistory = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [receiptError, setReceiptError] = useState(""); // New state for receipt errors

    useEffect(() => {
        fetchPaymentHistory();
    }, []);

    const fetchPaymentHistory = async () => {
        try {
            setLoading(true);
            setError("");
            setReceiptError(""); // Clear any previous receipt errors
            const history = await subscriptionService.getPaymentHistory();
            setPayments(history || []);
        } catch (err) {
            console.error("Error fetching payment history:", err);
            setError("Failed to load payment history. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount, currency = "INR") => {
        // Simple currency formatting without Intl
        if (currency === "INR") {
            return `₹${amount.toFixed(2)}`;
        }
        return `${currency} ${amount.toFixed(2)}`;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusBadge = (status) => {
        const statusClasses = {
            completed: "bg-green-100 text-green-800",
            pending: "bg-yellow-100 text-yellow-800",
            failed: "bg-red-100 text-red-800",
            refunded: "bg-blue-100 text-blue-800",
        };

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusClasses[status] || "bg-gray-100 text-gray-800"}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const generatePDFReceipt = async (paymentId) => {
        try {
            // Clear any previous errors
            setReceiptError("");
            
            // Fetch receipt data
            const receiptData = await subscriptionService.generateReceipt(paymentId);
            
            // Create PDF document
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            // Set font styles
            doc.setFont('helvetica');

            // Header
            doc.setFillColor(34, 197, 94); // Green color
            doc.rect(0, 0, 210, 40, 'F'); // Full width header

            // Company logo/name
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(24);
            doc.setFont(undefined, 'bold');
            doc.text('XALORA', 20, 25);

            // Receipt title
            doc.setFontSize(16);
            doc.text('PAYMENT RECEIPT', 150, 25);

            // Company details
            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            doc.text(receiptData.companyDetails.address, 20, 45);
            doc.text(`Email: ${receiptData.companyDetails.email}`, 20, 50);
            doc.text(`Website: ${receiptData.companyDetails.website}`, 20, 55);

            // Receipt details
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.setFont(undefined, 'bold');
            doc.text('RECEIPT DETAILS', 20, 70);

            // Horizontal line
            doc.setDrawColor(200, 200, 200);
            doc.line(20, 75, 190, 75);

            // Receipt info
            doc.setFont(undefined, 'normal');
            doc.setFontSize(10);
            doc.text(`Receipt ID: ${receiptData.receiptId}`, 20, 85);
            doc.text(`Payment ID: ${receiptData.paymentId}`, 20, 92);
            doc.text(`Date: ${formatDate(receiptData.paymentDate)}`, 20, 99);
            doc.text(`Status: ${receiptData.status.charAt(0).toUpperCase() + receiptData.status.slice(1)}`, 20, 106);

            // Customer details
            doc.setFont(undefined, 'bold');
            doc.text('CUSTOMER DETAILS', 20, 125);
            doc.setFont(undefined, 'normal');
            doc.line(20, 130, 190, 130);
            doc.text(`Name: ${receiptData.userDetails.name}`, 20, 140);
            doc.text(`Email: ${receiptData.userDetails.email}`, 20, 147);
            doc.text(`User ID: ${receiptData.userDetails.userId}`, 20, 154);

            // Payment details
            doc.setFont(undefined, 'bold');
            doc.text('PAYMENT DETAILS', 20, 175);
            doc.setFont(undefined, 'normal');
            doc.line(20, 180, 190, 180);
            doc.text(`Plan: ${receiptData.planName}`, 20, 190);
            doc.text(`Amount: ${formatCurrency(receiptData.amount, receiptData.currency)}`, 20, 197);

            // Footer
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text('Thank you for your payment!', 20, 250);
            doc.text('This is an automated receipt. No signature required.', 20, 255);
            doc.text('Page 1 of 1', 170, 280);

            // Save the PDF
            doc.save(`xalora-receipt-${receiptData.receiptId}.pdf`);
        } catch (err) {
            console.error("Error generating PDF receipt:", err);
            setReceiptError("Failed to generate PDF receipt. Please try again later.");
        }
    };

    const handleDownloadReceipt = async (paymentId) => {
        try {
            await generatePDFReceipt(paymentId);
        } catch (err) {
            console.error("Error downloading receipt:", err);
            setReceiptError("Failed to download receipt. Please try again later.");
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black py-12">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-center h-96">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black py-12">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-white">Payment History</h1>
                                <p className="mt-2 text-white/70">
                                    View your payment history and download receipts
                                </p>
                            </div>
                            <Link
                                to="/profile"
                                className="text-emerald-400 hover:text-emerald-300 text-sm font-medium flex items-center transition-colors duration-300"
                            >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to Profile
                            </Link>
                        </div>
                    </div>

                    {/* Error messages */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-900/30 border border-red-700 text-red-300 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Receipt error messages */}
                    {receiptError && (
                        <div className="mb-6 p-4 bg-red-900/30 border border-red-700 text-red-300 rounded-lg">
                            {receiptError}
                        </div>
                    )}

                    {/* Payment History Table */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg border border-white/10 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-700">
                            <h2 className="text-xl font-semibold text-white">Transaction History</h2>
                        </div>

                        {payments.length === 0 ? (
                            <div className="px-6 py-12 text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="mt-2 text-lg font-medium text-white">No payment history</h3>
                                <p className="mt-1 text-gray-400">
                                    You haven't made any payments yet.
                                </p>
                                <div className="mt-6">
                                    <Link
                                        to="/pricing"
                                        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-300"
                                    >
                                        View Plans
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-700">
                                    <thead>
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                Payment ID
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                Plan
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                Amount
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700">
                                        {payments.map((payment) => (
                                            <tr key={payment.paymentId} className="hover:bg-white/5 transition-colors duration-200">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                    <div className="font-mono">{payment.paymentId}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                    {formatDate(payment.paymentDate)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                    {payment.notes?.planId ? 
                                                        `Xalora ${payment.notes.planId.charAt(0).toUpperCase() + payment.notes.planId.slice(1)}` : 
                                                        "Subscription"}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                    {formatCurrency(payment.amount, payment.currency)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    {getStatusBadge(payment.status)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <button
                                                        onClick={() => handleDownloadReceipt(payment.paymentId)}
                                                        className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center"
                                                    >
                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                        </svg>
                                                        Download Receipt
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Info Section */}
                    <div className="mt-8 bg-gradient-to-r from-emerald-900/30 to-teal-900/30 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-700/30 p-6">
                        <div className="flex items-start">
                            <svg className="h-6 w-6 text-emerald-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <h3 className="text-lg font-medium text-white">Need help with your payments?</h3>
                                <p className="mt-2 text-emerald-100">
                                    If you have any questions about your payments or need assistance with receipts, 
                                    please contact our support team at support@xalora.com or visit our Help Center.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default PaymentHistory;