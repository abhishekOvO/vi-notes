import { useState } from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";

import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Editor from "./components/Editor/Editor";
import Dashboard from "./components/Dashboard/Dashboard";

// Improved Navbar Component
const Navbar = ({ userId, isAdmin }: { userId: string, isAdmin: boolean }) => (
  <nav style={{ 
    padding: '0.75rem 2rem', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    background: '#ffffff', 
    borderBottom: '1px solid #e2e8f0',
    position: 'sticky',
    top: 0,
    zIndex: 1000
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
      <div style={{ width: '28px', height: '28px', background: '#4f46e5', borderRadius: '6px' }}></div>
      <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.025em' }}>
        VI-Notes
      </h2>
    </div>
    
    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
      {userId && (
        <>
          <Link to="/editor" style={{ color: '#64748b', textDecoration: 'none', fontWeight: 500, fontSize: '0.9rem' }}>
            Editor
          </Link>
          {isAdmin && (
            <Link 
              to="/dashboard" 
              style={{ 
                color: '#4f46e5', 
                textDecoration: 'none', 
                fontWeight: 600,
                fontSize: '0.9rem',
                padding: '5px 12px',
                background: '#eef2ff',
                borderRadius: '6px'
              }}
            >
              Admin Dashboard
            </Link>
          )}
        </>
      )}
    </div>
  </nav>
);

function App() {
  const [userId, setUserId] = useState<string>(localStorage.getItem("userId") || "");
  const [isAdminView, setIsAdminView] = useState<boolean>(localStorage.getItem("isAdmin") === "true");

  const handleLogin = (id: string, adminView: boolean) => {
    setUserId(id);
    setIsAdminView(adminView);
    localStorage.setItem("userId", id);
    localStorage.setItem("isAdmin", String(adminView));
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      background: '#f8fafc', 
      fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
      color: '#1e293b'
    }}>
      {/* Professional CSS Overrides */}
      <style>{`
        input {
          width: 100%;
          padding: 10px 12px;
          margin: 8px 0 16px 0;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          box-sizing: border-box;
          font-size: 14px;
          transition: border-color 0.2s;
        }
        input:focus {
          outline: none;
          border-color: #4f46e5;
        }
        
        /* Compact Professional Button Style */
        button {
          background: #4f46e5;
          color: white;
          padding: 8px 20px;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
          width: auto;
          display: inline-block;
        }
        button:hover {
          background: #4338ca;
          transform: translateY(-1px);
        }
        
        /* Form Card Container */
        form {
          background: white;
          padding: 2.5rem;
          border-radius: 12px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          width: 100%;
          max-width: 400px;
          display: flex;
          flex-direction: column;
          align-items: flex-start; /* Aligns smaller buttons to the left */
        }
        
        h1, h2 { color: #0f172a; margin-top: 0; }
        label { font-size: 13px; font-weight: 500; color: #64748b; }
      `}</style>

      {/* Conditionally show Navbar */}
      {userId && <Navbar userId={userId} isAdmin={isAdminView} />}
      
      <main style={{ 
        flex: 1, 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: '2rem'
      }}>
        <Routes>
          {/* Auth Routes */}
          <Route path="/" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/editor"
            element={userId ? <Editor userId={userId} /> : <Navigate to="/" />}
          />

          <Route
            path="/dashboard"
            element={
              userId && isAdminView ? (
                <Dashboard />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;