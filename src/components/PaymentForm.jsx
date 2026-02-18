import { useState } from 'react';
import axios from 'axios';
import './PaymentForm.css';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function PaymentForm({ onDataUpdate, onTypeUpdate, onMessageUpdate }) {
  const [formData, setFormData] = useState({
    cardNumber: '1234 5678 9012 3456',
    cardHolder: 'John Doe',
    expiry: '10/26',
    cvv: '123'
  });
  const [paymentId, setPaymentId] = useState('');
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 19);
    } else if (name === 'expiry') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').slice(0, 5);
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 3);
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/payment/`, {
        cardNumber: formData.cardNumber.replace(/\s/g, ''),
        cardHolder: formData.cardHolder,
        expiry: formData.expiry,
        cvv: formData.cvv
      });
      console.log('Payment submitted:', response.data);
      onMessageUpdate('✅ Payment created successfully!');
      setFormData({ cardNumber: '1234 5678 9012 3456', cardHolder: 'John Doe', expiry: '10/26', cvv: '123' });
    } catch (error) {
      console.error('Error submitting payment:', error.response?.data?.error || error.message);
      onMessageUpdate(`❌ Error: ${error.response?.data?.error || 'Payment failed'}`);
    }
  };

  const handleListPayments = async () => {
    try {
      const response = await axios.get('http://localhost:3000/payment/');
      setPayments(response.data.data);
      onDataUpdate(response.data.data);
      onTypeUpdate('list');
      onMessageUpdate('✅ Payments fetched successfully!');
      setSelectedPayment(null);
    } catch (error) {
      console.error('Error fetching payments:', error);
      onMessageUpdate(`❌ Error: ${error.response?.data?.error || 'Failed to fetch payments'}`);
    }
  };

  const handleGetPaymentById = async () => {
    if (!paymentId.trim()) {
      onMessageUpdate('❌ Please enter a Payment ID');
      return;
    }
    try {
      const response = await axios.get(`http://localhost:3000/payment/${paymentId}`);
      setSelectedPayment(response.data.data);
      onDataUpdate(response.data.data);
      onTypeUpdate('single');
      onMessageUpdate('✅ Payment fetched successfully!');
    } catch (error) {
      console.error('Error fetching payment:', error);
      onMessageUpdate(`❌ Error: ${error.response?.data?.error || 'Payment not found'}`);
      setSelectedPayment(null);
    }
  };

  return (
    <div className="payment-form">
      <form onSubmit={handleSubmit} className="payment-card">

        <div className="form-group">
          <label className="form-label">Card Number</label>
          <input
            type="text"
            name="cardNumber"
            value={formData.cardNumber} 
            onChange={handleChange}
            placeholder="1234 5678 9012 3456"
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Cardholder Name</label>
          <input
            type="text"
            name="cardHolder"
            value={formData.cardHolder}
            onChange={handleChange}
            placeholder="John Doe"
            className="form-input"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Expiry Date</label>
            <input
              type="text"
              name="expiry"
              value={formData.expiry}
              onChange={handleChange}
              placeholder="MM/YY"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">CVV</label>
            <input
              type="text"
              name="cvv"
              value={formData.cvv}
              onChange={handleChange}
              placeholder="123"
              className="form-input"
              required
            />
          </div>
        </div>

        <button type="submit" className="submit-btn">
          Save to DB
        </button>

        <div className="button-group">
          <button type="button" className="action-btn list-btn" onClick={handleListPayments}>
            List All Payments
          </button>
        </div>

        <div className="form-group">
          <label className="form-label">Payment ID</label>
          <input
            type="text"
            value={paymentId}
            onChange={(e) => setPaymentId(e.target.value)}
            placeholder="Enter Payment ID"
            className="form-input"
          />
        </div>

        <div className="button-group">
          <button type="button" className="action-btn get-btn" onClick={handleGetPaymentById}>
            Get Payment by ID
          </button>
        </div>
      </form>
    </div>
  );
}
