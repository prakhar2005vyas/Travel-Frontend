import { useState } from "react";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

 const handleImage = (e) => {
  const file = e.target.files[0];

  const reader = new FileReader();
  reader.onloadend = () => {
    setPreview(reader.result); // base64 string
  };

  if (file) {
    reader.readAsDataURL(file);
  }
};

  const handleSubmit = () => {
    if (!title || !desc || !preview) {
      alert("Fill all fields");
      return;
    }

    const newPost = {
      id: Date.now(),
      title,
      desc,
      image: preview,
    };

    const oldPosts = JSON.parse(localStorage.getItem("posts")) || [];
    localStorage.setItem("posts", JSON.stringify([newPost, ...oldPosts]));

    alert("Post created!");

    setTitle("");
    setDesc("");
    setImage(null);
    setPreview(null);
  };

  return (
    <div className="p-10 max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Create Travel Post</h2>

      <input
        type="text"
        placeholder="Title"
        className="w-full border p-2 mb-4"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Description"
        className="w-full border p-2 mb-4"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />

      <input type="file" onChange={handleImage} className="mb-4" />

      {preview && (
        <img src={preview} className="h-40 mb-4 object-cover" />
      )}

      <button
        onClick={handleSubmit}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Post
      </button>
    </div>
  );
}