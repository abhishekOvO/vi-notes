import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userId, setUserId] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const handleSubmit = async () => {
    try {
      if (isLogin) {
        const res = await axios.post("http://localhost:5000/login", {
          email,
          password,
        });

        alert(res.data.message);

        if (res.data.userId) {
          setUserId(res.data.userId);

          if (email === "admin@gmail.com") {
            setIsAdmin(true);
          }
        }
      } else {
        const res = await axios.post("http://localhost:5000/register", {
          email,
          password,
        });

        alert(res.data.message);
      }
    } catch (err) {
      console.log(err);
      alert("Error");
    }
  };

  if (userId && isAdmin) {
    return <Dashboard onLogout={() => {
      setUserId("");
      setIsAdmin(false);
    }} />;
  }

  if (userId) {
    return <Editor userId={userId} onLogout={() => {
      setUserId("");
      setIsAdmin(false);
    }} />;
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>{isLogin ? "Login" : "Register"}</h2>

      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <br /><br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={handleSubmit}>
        {isLogin ? "Login" : "Register"}
      </button>

      <p onClick={() => setIsLogin(!isLogin)} style={{ cursor: "pointer", color: "blue" }}>
        Switch to {isLogin ? "Register" : "Login"}
      </p>
    </div>
  );
}

/* ================= EDITOR ================= */

function Editor({ userId, onLogout }) {
  const [text, setText] = useState("");
  const [keystrokes, setKeystrokes] = useState(0);
  const [pasteCount, setPasteCount] = useState(0);
  const [lastSaved, setLastSaved] = useState("Not saved yet");

  useEffect(() => {
    const interval = setInterval(async () => {
      if (text.trim() !== "") {
        await axios.post("http://localhost:5000/save", {
          userId,
          textContent: text,
          keystrokes,
          pasteCount,
        });

        setLastSaved(new Date().toLocaleTimeString());
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [text, keystrokes, pasteCount, userId]);

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={onLogout} style={{ background: "red", color: "white", padding: "8px" }}>
        🚪 Logout
      </button>

      <h2>Vi-Notes Editor ✍️</h2>

      <textarea
        rows="10"
        cols="50"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setKeystrokes((k) => k + 1);
        }}
        onPaste={() => {
          setPasteCount((p) => p + 1);
          alert("⚠️ Pasting detected!");
        }}
      />

      <p>Characters: {text.length}</p>
      <p>Keystrokes: {keystrokes}</p>
      <p>Paste Count: {pasteCount}</p>
      <p>Last Saved: {lastSaved}</p>
    </div>
  );
}

/* ================= DASHBOARD ================= */

function Dashboard({ onLogout }) {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/notes")
      .then((res) => setNotes(res.data))
      .catch((err) => console.log(err));
  }, []);

  const suspicious = notes.filter(n => n.pasteCount > 0);
  const normal = notes.filter(n => n.pasteCount === 0);

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={onLogout} style={{ background: "black", color: "white", padding: "8px" }}>
        🚪 Logout
      </button>

      <h2>📊 Authority Dashboard</h2>

      <h3 style={{ color: "green" }}>🟢 Genuine Users</h3>
      <table border="1" cellPadding="10" style={{ width: "100%", marginBottom: "20px" }}>
        <thead style={{ backgroundColor: "#d4edda" }}>
          <tr>
            <th>Email</th>
            <th>Keystrokes</th>
            <th>Paste Count</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {normal.map((n, i) => (
            <tr key={i}>
              <td>{n.email}</td>
              <td>{n.keystrokes}</td>
              <td>{n.pasteCount}</td>
              <td style={{ color: "green" }}>✔ Genuine</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ color: "red" }}>🔴 Suspicious Users</h3>
      <table border="1" cellPadding="10" style={{ width: "100%" }}>
        <thead style={{ backgroundColor: "#f8d7da" }}>
          <tr>
            <th>Email</th>
            <th>Keystrokes</th>
            <th>Paste Count</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {suspicious.map((n, i) => (
            <tr key={i}>
              <td>{n.email}</td>
              <td>{n.keystrokes}</td>
              <td>{n.pasteCount}</td>
              <td style={{ color: "red" }}>⚠ Cheating</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;