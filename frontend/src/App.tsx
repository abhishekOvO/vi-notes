import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Editor from "./components/Editor/Editor";
import Dashboard from "./components/Dashboard/Dashboard";

function App() {
  const [userId, setUserId] = useState<string>("");
  const [isAdminView, setIsAdminView] = useState<boolean>(false);

  const handleLogin = (id: string, adminView: boolean) => {
    setUserId(id);
    setIsAdminView(adminView);
  };

  return (
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
        element={userId && isAdminView ? (<Dashboard />) : (<Navigate to="/" /> )}
/>
    </Routes>
  );
}

export default App;