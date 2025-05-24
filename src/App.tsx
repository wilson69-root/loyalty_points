import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import CustomerDetail from './pages/CustomerDetail';
import Rewards from './pages/Rewards';
import Settings from './pages/Settings';
import CheckIn from './pages/CheckIn';
import { LoyaltyProvider } from './context/LoyaltyContext';
import { useEffect } from 'react';
import { initializeDatabase } from './utils/initializeDatabase';

function App() {
  // useEffect(() => {
  //   const init = async () => {
  //     try {
  //       await initializeDatabase();
  //     } catch (error) {
  //       console.error('Failed to initialize database:', error);
  //     }
  //   };
    
  //   init();
  // }, []);
  
  return (
    <LoyaltyProvider>
      <Router>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#6D28D9',
              color: '#fff',
              borderRadius: '8px',
            },
          }}
        />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="customers" element={<Customers />} />
            <Route path="customers/:id" element={<CustomerDetail />} />
            <Route path="rewards" element={<Rewards />} />
            <Route path="settings" element={<Settings />} />
            <Route path="check-in" element={<CheckIn />} />
          </Route>
        </Routes>
      </Router>
    </LoyaltyProvider>
  );
}

export default App;