import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SignUp from './pages/signup'
import EmailConfirmation from './pages/emailConfirmation'
  
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<SignUp />} />  {/* Temporary redirect to signup */}
        <Route path="/email-confirmation" element={<EmailConfirmation />} />
      </Routes>
    </Router>
  )
}

export default App