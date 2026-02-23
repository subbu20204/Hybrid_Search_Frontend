import { useState } from 'react';
import axios from 'axios';
import './RefundEvaluationForm.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function RefundEvaluationForm({ onDataUpdate, onTypeUpdate, onMessageUpdate, onLoadingChange }) {
  const [formData, setFormData] = useState({
    orderId: 'ORD-010',
    reason: 'Color faded',
    condition: 'used',
    daysSincePurchase: '15'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'daysSincePurchase') {
      formattedValue = value.replace(/\D/g, '');
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    onLoadingChange(true);
    onMessageUpdate('');
    onDataUpdate(null);
    
    try {
      console.log('Submitting to:', `${API_BASE_URL}/evaluate`);
      console.log('Payload:', {
        orderId: formData.orderId,
        reason: formData.reason,
        condition: formData.condition,
        daysSincePurchase: parseInt(formData.daysSincePurchase)
      });
      
      const response = await axios.post(`${API_BASE_URL}/evaluate`, {
        orderId: formData.orderId,
        reason: formData.reason,
        condition: formData.condition,
        daysSincePurchase: parseInt(formData.daysSincePurchase)
      });
      console.log('Evaluation submitted:', response.data);
      onDataUpdate(response.data);
      onTypeUpdate('json');
    } catch (error) {
      console.error('Full error:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      const errorMsg = error.response?.data?.error || error.message || 'Evaluation failed';
      onMessageUpdate(`❌ Error: ${errorMsg}`);
      onDataUpdate(null);
    } finally {
      onLoadingChange(false);
    }
  };

  return (
    <div className="refund-form">
      <h2 className="refund-title">Refund Evaluation</h2>
      <form onSubmit={handleSubmit} className="refund-card">

        <div className="form-group">
          <label className="form-label">Order ID</label>
          <select
            name="orderId"
            value={formData.orderId} 
            onChange={handleChange}
            className="form-input"
            required
          >
            <option value="ORD-001">ORD-001 - Laptop</option>
            <option value="ORD-002">ORD-002 - Headphones</option>
            <option value="ORD-003">ORD-003 - Dress</option>
            <option value="ORD-004">ORD-004 - Jacket</option>
            <option value="ORD-005">ORD-005 - Sofa</option>
            <option value="ORD-006">ORD-006 - Armchair</option>
            <option value="ORD-007">ORD-007 - Monitor</option>
            <option value="ORD-008">ORD-008 - Keyboard</option>
            <option value="ORD-009">ORD-009 - Shirt</option>
            <option value="ORD-010">ORD-010 - Pants</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Reason</label>
          <input
            type="text"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            placeholder="e.g., Color faded, Not as described, Defective"
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Condition</label>
          <select
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            className="form-input"
            required
          >
            <option value="unopened">Unopened</option>
            <option value="unused">Unused</option>
            <option value="opened">Opened</option>
            <option value="used">Used</option>
            <option value="defective">Defective</option>
            <option value="damaged">Damaged</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Days Since Purchase</label>
          <input
            type="number"
            name="daysSincePurchase"
            value={formData.daysSincePurchase}
            onChange={handleChange}
            placeholder="15"
            className="form-input"
            min="1"
            max="365"
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          Evaluate Refund Request
        </button>
      </form>
    </div>
  );
}
