import { useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";



type Props = {
  onLogin: (id: string, isAdminView: boolean) => void;
};

const Login: React.FC<Props> = ({ onLogin }) => {

  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

const handleLogin = async () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    alert("Invalid email format");
    return;
  }

  if (password.length < 8) {
    alert("Password must be at least 8 characters");
    return;
  }

  try {
    const res = await API.post("/login", { email, password });

    alert(res.data.message);

   if (res.data.success) {
  localStorage.setItem("token", res.data.token);

  
  onLogin(res.data.userId, res.data.isAdmin); 
  

  if (res.data.isAdmin) {
    const goAdmin = window.confirm(
      "Hey Admin! Do you want Admin Dashboard?"
    );

    navigate(goAdmin ? "/dashboard" : "/editor");
  } else {
    navigate("/editor");
  }
}
  } catch (err) {
    console.log(err);
    alert("Login error");
  }
};

  return (
    <div>
      <h2>Login</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={handleLogin}>Login</button>
      <p onClick={() => navigate("/register")} style={{ cursor: "pointer", color: "blue" }}>
  Don't have an account? Register
</p>
    </div>
  );
};

export default Login;