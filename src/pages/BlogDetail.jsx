import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const posts = JSON.parse(localStorage.getItem("posts")) || [];
  const post = posts.find((p) => p.id == id);

  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const storedLikes = JSON.parse(localStorage.getItem("likedPosts")) || {};
    const storedComments = JSON.parse(localStorage.getItem("comments")) || {};
    setLiked(storedLikes[id] || false);
    setComments(storedComments[id] || []);
  }, [id]);

  const toggleLike = () => {
    const storedLikes = JSON.parse(localStorage.getItem("likedPosts")) || {};
    const updated = { ...storedLikes, [id]: !storedLikes[id] };
    localStorage.setItem("likedPosts", JSON.stringify(updated));
    setLiked(updated[id]);
  };

  const handleComment = () => {
    if (!input.trim()) return;

    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const commenterName = loggedInUser ? loggedInUser.name : "Guest";

    const newComment = {
      text: input.trim(),
      name: commenterName,
      time: new Date().toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const storedComments = JSON.parse(localStorage.getItem("comments")) || {};
    const updated = {
      ...storedComments,
      [id]: [...(storedComments[id] || []), newComment],
    };
    localStorage.setItem("comments", JSON.stringify(updated));
    setComments(updated[id]);
    setInput("");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied!");
  };

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-2xl text-gray-400">Post not found 😕</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 bg-black text-white px-6 py-2 rounded-full"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">

      {/* ✅ NAVBAR */}
      <Navbar />

      {/* ✅ HERO IMAGE */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="pt-16"
      >
        <img
          src={post.image}
          className="w-full h-[50vh] object-cover"
          alt={post.title}
        />
      </motion.div>

      {/* ✅ CONTENT */}
      <div className="max-w-2xl mx-auto px-6 py-10">

        {/* ✅ TITLE */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold mb-2"
        >
          {post.title}
        </motion.h1>

        {/* ✅ AUTHOR + DATE — right below the title */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <span>
            ✍️{" "}
            <span className="font-medium text-gray-600">
              {post.author || "Unknown"}
            </span>
          </span>
          <span>•</span>
          <span>🕒 {post.createdAt || "Unknown date"}</span>
        </div>

        {/* ✅ DESCRIPTION */}
        <p className="text-gray-600 text-base leading-relaxed mb-8">
          {post.desc}
        </p>

        {/* ✅ LIKE + SHARE */}
        <div className="flex gap-6 text-2xl mb-10 border-t border-b border-gray-100 py-4">
          <motion.button whileTap={{ scale: 1.3 }} onClick={toggleLike}>
            {liked ? "❤️" : "🤍"}{" "}
            <span className="text-sm text-gray-500">Like</span>
          </motion.button>
          <motion.button whileTap={{ scale: 1.2 }} onClick={handleShare}>
            🔗 <span className="text-sm text-gray-500">Share</span>
          </motion.button>
        </div>

        {/* ✅ COMMENTS SECTION */}
        <h2 className="text-lg font-semibold mb-4">💬 Comments</h2>

        <div className="space-y-3 mb-6">
          {comments.length === 0 ? (
            <p className="text-gray-400 text-sm">
              No comments yet. Be the first!
            </p>
          ) : (
            comments.map((c, i) => (
              <div
                key={i}
                className="bg-white rounded-xl px-4 py-3 shadow-sm"
              >
                {/* ✅ COMMENTER NAME + TIME */}
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-sm">
                    {typeof c === "object" ? c.name : "User"}
                  </span>
                  <span className="text-xs text-gray-400">
                    {typeof c === "object" ? c.time : ""}
                  </span>
                </div>
                {/* ✅ COMMENT TEXT */}
                <span className="text-sm text-gray-700">
                  {typeof c === "object" ? c.text : c}
                </span>
              </div>
            ))
          )}
        </div>

        {/* ✅ COMMENT INPUT */}
        <div className="flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleComment()}
            placeholder="Write a comment..."
            className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm outline-none"
          />
          <button
            onClick={handleComment}
            className="bg-black text-white px-5 py-2 rounded-full text-sm"
          >
            Post
          </button>
        </div>

      </div>
    </div>
  );
}