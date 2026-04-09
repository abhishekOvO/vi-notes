import { useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const handleRegister = async () => {
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  if (!emailRegex.test(email)) {
    alert("Invalid email format");
    return;
  }

  if (!passwordRegex.test(password)) {
    alert(
      "Password must be 8+ chars with uppercase, lowercase, number & special character"
    );
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    const res = await API.post("/register", {
      email,
      password,
      confirmPassword,
    });

    alert(res.data.message);
    navigate("/");
  } catch (err) {
    console.log(err);
    alert("Registration error");
  }
};

  return (
    <div>
      <h2>Register</h2>

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

      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={handleRegister}>Register</button>

      <p
        onClick={() => navigate("/")}
        style={{ cursor: "pointer", color: "blue" }}
      >
        Already have an account? Login
      </p>
    </div>
  );
};

export default Register;