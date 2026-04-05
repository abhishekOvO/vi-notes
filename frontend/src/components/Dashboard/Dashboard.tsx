import { useEffect, useState } from "react";
import API from "../../services/api";

type Note = {
  email: string;
  keystrokes: number;
  pasteCount: number;
};

const Dashboard: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    API.get("/notes")
      .then((res) => setNotes(res.data))
      .catch((err) => console.log(err));
  }, []);

  const suspicious = notes.filter((n) => n.pasteCount > 0);
  const normal = notes.filter((n) => n.pasteCount === 0);

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
        📊 Admin Dashboard
      </h2>

      {/* ✅ Genuine Users */}
      <h3 style={{ color: "green" }}>🟢 Genuine Users</h3>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "40px",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#d4edda" }}>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Keystrokes</th>
            <th style={thStyle}>Paste Count</th>
            <th style={thStyle}>Status</th>
          </tr>
        </thead>

        <tbody>
          {normal.map((n, i) => (
            <tr key={i} style={{ textAlign: "center" }}>
              <td style={tdStyle}>{n.email}</td>
              <td style={tdStyle}>{n.keystrokes}</td>
              <td style={tdStyle}>{n.pasteCount}</td>
              <td style={{ ...tdStyle, color: "green" }}>✔ Genuine</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ❌ Suspicious Users */}
      <h3 style={{ color: "red" }}>🔴 Suspicious Users</h3>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f8d7da" }}>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Keystrokes</th>
            <th style={thStyle}>Paste Count</th>
            <th style={thStyle}>Status</th>
          </tr>
        </thead>

        <tbody>
          {suspicious.map((n, i) => (
            <tr key={i} style={{ textAlign: "center" }}>
              <td style={tdStyle}>{n.email}</td>
              <td style={tdStyle}>{n.keystrokes}</td>
              <td style={tdStyle}>{n.pasteCount}</td>
              <td style={{ ...tdStyle, color: "red" }}>⚠ Suspicious</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/* 🔹 Reusable styles */
const thStyle: React.CSSProperties = {
  padding: "12px",
  border: "1px solid #ccc",
};

const tdStyle: React.CSSProperties = {
  padding: "10px",
  border: "1px solid #ccc",
};

export default Dashboard;