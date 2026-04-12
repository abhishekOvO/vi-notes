import React, { useState, useEffect} from "react";

const Editor = () => {
  const [text, setText] = useState<string>("");
  const [keystrokes, setKeystrokes] = useState<number>(0);
  const [pasteCount, setPasteCount] = useState<number>(0);
  const [lastSaved, setLastSaved] = useState<string>("Not saved yet");

  useEffect(() => {
  const interval = setInterval(async () => {
    if (text.trim() !== "") {
      try {
        await API.post("/save", {
          userId,
          textContent: text,
          keystrokes,
          pasteCount,
        });

        setLastSaved(new Date().toLocaleTimeString());
      } catch (err) {
        console.log("SAVE ERROR 👉", err);
      }
    }
  }, 10000);

  return () => clearInterval(interval);
}, [text, keystrokes, pasteCount, userId]);


  return (
    <div>
      <h2>
        Editor ✍️
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
        >
          Logout
        </button>
      </h2>

      <textarea
        rows={10}
        cols={50}
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
};

export default Editor;