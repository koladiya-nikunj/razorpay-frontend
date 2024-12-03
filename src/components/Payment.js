import React, { useState } from 'react';
import axios from 'axios';

const Payment = () => {
    const [amount, setAmount] = useState(0);
    const [paymentStatus, setPaymentStatus] = useState('');

    // Function to handle order creation
    const createOrder = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/payment/order', { amount });
            const order = response.data.order;
            const options = {
                key: process.env.REACT_APP_RAZORPAY_KEY_ID, // Your Razorpay Key ID
                amount: order.amount,
                currency: order.currency,
                name: "Your Business Name",
                description: "Test Payment",
                image: "https://example.com/your_logo.png",
                order_id: order.id,
                handler: function (response) {
                    verifyPayment(response);
                },
                prefill: {
                    name: "Koladiya Nikunj",
                    email: "koladiyanikunj@gmail.com",
                    contact: "9998167873",
                },
                notes: {
                    address: "Test Address",
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error("Error creating order:", error);
        }
    };

    // Function to handle payment verification
    const verifyPayment = async (paymentResponse) => {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentResponse;

        try {
            const response = await axios.post('http://localhost:5000/api/payment/verify', {
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
            });

            if (response.data.success) {
                setPaymentStatus('Payment successful');
            } else {
                setPaymentStatus('Payment verification failed');
            }
        } catch (error) {
            console.error("Error verifying payment:", error);
            setPaymentStatus('Payment verification failed');
        }
    };

    return (
        <div>
            <h1>Razorpay Integration</h1>
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
            />
            <button onClick={createOrder}>Payment</button>
            {paymentStatus && <p>{paymentStatus}</p>}
        </div>
    );
};

export default Payment;
