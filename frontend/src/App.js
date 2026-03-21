import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/HomePage/Home';
import C_CompanyRegister from './components/CompanyManagement/C_CompanyRegister';
import C_CompanyLogin from './components/CompanyManagement/C_CompanyLogin';
import C_CompanyDashboard from './components/CompanyManagement/C_CompanyDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Home Route */}
          <Route path="/" element={<Home />} />
          
          {/* Company Routes */}
          <Route path="/register/company" element={<C_CompanyRegister />} />
          <Route path="/login/company" element={<C_CompanyLogin />} />
          <Route path="/company/dashboard" element={<C_CompanyDashboard />} />
          
          {/* Student Routes - Placeholder */}
          <Route path="/login/student" element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-3xl font-bold mb-4">Student Login</h1>
                <p className="text-gray-600">Student login page coming soon...</p>
              </div>
            </div>
          } />
          
          <Route path="/register/student" element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-3xl font-bold mb-4">Student Registration</h1>
                <p className="text-gray-600">Student registration page coming soon...</p>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;