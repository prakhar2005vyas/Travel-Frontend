import { useState, useEffect } from "react";

export default function Comments({ blogId }) {
  const [text, setText] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    setComments(JSON.parse(localStorage.getItem("comments" + blogId)) || []);
  }, [blogId]);

  const addComment = () => {
    const newComments = [...comments, { user: "User", text }];
    localStorage.setItem("comments" + blogId, JSON.stringify(newComments));
    setComments(newComments);
    setText("");
  };

  return (
    <div className="mt-5">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="border w-full p-2"
      />
      <button
        onClick={addComment}
        className="bg-green-600 text-white px-3 py-1 mt-2"
      >
        Post
      </button>

      {comments.map((c, i) => (
        <div key={i} className="bg-white p-2 mt-2 rounded">
          <b>{c.user}</b>
          <p>{c.text}</p>
        </div>
      ))}
    </div>
  );
}