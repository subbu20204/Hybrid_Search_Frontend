import { useState } from 'react'
import './App.css'
import PaymentForm from './components/PaymentForm.jsx'

function App() {
  const [outputData, setOutputData] = useState(null)
  const [outputType, setOutputType] = useState(null)
  const [message, setMessage] = useState('')

  return (
    <div className="app-container">
      <div className="left-container">
        <PaymentForm onDataUpdate={setOutputData} onTypeUpdate={setOutputType} onMessageUpdate={setMessage} />
      </div>
      <div className="right-container">
        {message && (
          <div className={`message-card ${message.includes('✅') ? 'success' : 'error'}`}>
            <p>{message}</p>
          </div>
        )}
        {outputData ? (
          <>
            <h1>{outputType === 'list' ? 'All Payments' : outputType === 'single' ? 'Payment Details' : 'Payment Output'}</h1>
            {outputType === 'list' && Array.isArray(outputData) ? (
              <div className="payments-output">
                {outputData.map((payment) => (
                  <div key={payment._id} className="payment-card-output">
                    <p><strong>ID:</strong> <span className="id-value">{payment._id}</span></p>
                    <p><strong>Card Holder:</strong> {payment.cardHolder}</p>
                    <p><strong>Card Number:</strong> ****-****-****-{payment.cardNumber.slice(-4)}</p>
                    <p><strong>Expiry:</strong> {payment.expiry}</p>
                    <p><strong>Status:</strong> <span className="status-badge">{payment.status}</span></p>
                    <p><strong>Created:</strong> {new Date(payment.createdAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="payment-card-output">
                <p><strong>ID:</strong> <span className="id-value">{outputData._id}</span></p>
                <p><strong>Card Holder:</strong> {outputData.cardHolder}</p>
                <p><strong>Card Number:</strong> ****-****-****-{outputData.cardNumber.slice(-4)}</p>
                <p><strong>Expiry:</strong> {outputData.expiry}</p>
                <p><strong>Status:</strong> <span className="status-badge">{outputData.status}</span></p>
                <p><strong>Created:</strong> {new Date(outputData.createdAt).toLocaleString()}</p>
              </div>
            )}
          </>
        ) : (
          <>

          </>
        )}
      </div>
    </div>
  )
}

export default App
