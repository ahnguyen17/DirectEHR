import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { PatientProvider } from './context/PatientContext.jsx'
import { LabsProvider } from './context/LabsContext.jsx'
import { DiagnosticsProvider } from './context/DiagnosticsContext.jsx'
import { ProblemListProvider } from './context/ProblemListContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PatientProvider>
      <LabsProvider>
        <DiagnosticsProvider>
          <ProblemListProvider>
            <App />
          </ProblemListProvider>
        </DiagnosticsProvider>
      </LabsProvider>
    </PatientProvider>
  </React.StrictMode>,
)