import React, { useState } from "react";

const Editor = () => {
  const [text, setText] = useState<string>("");
  const [keystrokes, setKeystrokes] = useState<number>(0);

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
      />

      <p>Characters: {text.length}</p>
      <p>Keystrokes: {keystrokes}</p>
    </div>
  );
};

export default Editor;