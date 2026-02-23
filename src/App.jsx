import { useState } from 'react'
import './App.css'
import RefundEvaluationForm from './components/RefundEvaluationForm.jsx'

function App() {
  const [outputData, setOutputData] = useState(null)
  const [outputType, setOutputType] = useState(null)
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="app-container">
      <div className="left-container">
        <RefundEvaluationForm 
          onDataUpdate={setOutputData} 
          onTypeUpdate={setOutputType} 
          onMessageUpdate={setMessage}
          onLoadingChange={setIsLoading}
        />
        {message && (
          <div className={`message-card ${message.includes('✅') ? 'success' : 'error'}`}>
            <p>{message}</p>
          </div>
        )}
      </div>
      <div className="right-container">
        {isLoading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <h2>Evaluating refund request...</h2>
            <p>Analyzing order details and policy rules</p>
          </div>
        ) : outputData ? (
          <>
            <h1>Response</h1>
            <div className="response-summary">
              <div className="summary-item">
                <span className="summary-label">Decision:</span>
                <span className={`summary-value decision-${outputData.decision?.toLowerCase()}`}>
                  {outputData.decision}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Confidence:</span>
                <span className="summary-value confidence">
                  {(outputData.confidence * 100).toFixed(0)}%
                </span>
              </div>
            </div>
            
            {outputData.explanation && (
              <div className="explanation-box">
                <h3>Explanation</h3>
                <p>{outputData.explanation}</p>
              </div>
            )}
            
            <div className="json-section">
              <h3>Full Response</h3>
              <pre className="json-output">{JSON.stringify(outputData, null, 2)}</pre>
            </div>
          </>
        ) : (
          <div className="placeholder">
            <div className="placeholder-icon">📋</div>
            <h2>No evaluation yet</h2>
            <p>Submit a refund request to see the evaluation results</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
