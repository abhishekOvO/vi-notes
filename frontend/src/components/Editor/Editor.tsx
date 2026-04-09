import { useState, useEffect } from "react";
import API from "../../services/api";

type Props = {
  userId: string;
};

const Editor: React.FC<Props> = ({ userId }) => {
  

  useEffect(() => {
  API.get(`/my-note?userId=${userId}`)
    .then((res) => {
      if (res.data.note) {
        setText(res.data.note.textContent);
        setKeystrokes(res.data.note.keystrokes);
        setPasteCount(res.data.note.pasteCount);
      }
    })
    .catch(console.log);
}, [userId]);

  return (
    <div>
      <h2>Editor ✍️ <button>
  Logout
</button></h2>

      
    </div>
  );
};

export default Editor;