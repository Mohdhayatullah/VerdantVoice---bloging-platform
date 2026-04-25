import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              fontFamily: 'Cabinet Grotesk, sans-serif',
              borderRadius: '12px',
              background: '#1a3a2a',
              color: '#fff',
              fontSize: '0.9rem',
              padding: '14px 20px',
            },
            success: { iconTheme: { primary: '#52b788', secondary: '#fff' } },
            error:   { style: { background: '#c0392b' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
