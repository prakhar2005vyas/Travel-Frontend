import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Explore from "../components/Explore";
import Navbar from "../components/Navbar";

export default function Home() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState({});
  const [comments, setComments] = useState({});
  const [input, setInput] = useState({});

  // Load posts, likes, comments from localStorage on mount
  useEffect(() => {
    const storedPosts = JSON.parse(localStorage.getItem("posts")) || [];
    const storedLikes = JSON.parse(localStorage.getItem("likedPosts")) || {};
    const storedComments = JSON.parse(localStorage.getItem("comments")) || {};
    setPosts(storedPosts);
    setLikedPosts(storedLikes);
    setComments(storedComments);
  }, []);

  // Persist likes
  const toggleLikePost = (id) => {
    const updated = { ...likedPosts, [id]: !likedPosts[id] };
    setLikedPosts(updated);
    localStorage.setItem("likedPosts", JSON.stringify(updated));
  };

  // Persist comments
  const handleComment = (postId) => {
    if (!input[postId]?.trim()) return;
    const newComment = input[postId].trim();
    const updated = {
      ...comments,
      [postId]: [...(comments[postId] || []), newComment],
    };
    setComments(updated);
    localStorage.setItem("comments", JSON.stringify(updated));
    setInput((prev) => ({ ...prev, [postId]: "" }));
  };

  // Share
  const handleShare = (postId) => {
    const url = `${window.location.origin}/blog/${postId}`;
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!");
  };

  return (
    <div className="bg-white text-black">

      {/* NAVBAR */}
      <Navbar />

      {/* HERO */}
      <div className="h-screen relative">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
          className="absolute w-full h-full object-cover"
          alt="hero"
        />
        <div className="absolute inset-0 bg-black/45 flex flex-col justify-center items-center text-white px-4">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-5xl md:text-6xl font-bold mb-6 text-center leading-tight"
          >
            Discover Luxury <br /> Travel Experiences
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white text-black rounded-full px-6 py-3 flex items-center gap-4 shadow-xl"
          >
            <input
              placeholder="Where to?"
              className="outline-none w-40 md:w-60 text-sm"
            />
            <button className="bg-black text-white px-4 py-1 rounded-full text-sm">
              Search
            </button>
          </motion.div>
        </div>
      </div>

      {/* EXPLORE */}
      <Explore />

      {/* POSTS FEED */}
      <div className="p-10 bg-[#fafafa]">
        <h2 className="text-2xl font-semibold mb-8">📸 Latest Travel Posts</h2>

        {posts.length === 0 ? (
          <div className="text-center text-gray-400 py-20">
            <p className="text-5xl mb-4">✈️</p>
            <p className="text-lg">No posts yet. Be the first to share!</p>
            <Link to="/create">
              <button className="mt-4 bg-black text-white px-6 py-2 rounded-full">
                Create Post
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="rounded-2xl overflow-hidden shadow-md bg-white"
              >
                {/* Clickable image → blog detail */}
                <div
                  className="cursor-pointer relative group"
                  onClick={() => navigate(`/blog/${post.id}`)}
                >
                  <img
                    src={post.image}
                    className="h-60 w-full object-cover group-hover:scale-105 transition duration-300"
                    alt={post.title}
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                    <span className="text-white font-semibold text-sm bg-black/50 px-4 py-1 rounded-full">
                      Read More →
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-lg">{post.title}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{post.desc}</p>

                  {/* Action Buttons */}
                  <div className="flex gap-4 mt-3 text-xl">
                    {/* Like */}
                    <motion.button
                      whileTap={{ scale: 1.3 }}
                      onClick={() => toggleLikePost(post.id)}
                    >
                      {likedPosts[post.id] ? "❤️" : "🤍"}
                    </motion.button>

                    {/* Share */}
                    <motion.button
                      whileTap={{ scale: 1.2 }}
                      onClick={() => handleShare(post.id)}
                      title="Copy link"
                    >
                      🔗
                    </motion.button>
                  </div>

                  {/* Comments */}
                  <div className="mt-4">
                    {(comments[post.id] || []).length > 0 && (
                      <div className="mb-2 space-y-1">
                        {(comments[post.id] || []).map((c, i) => (
                          <p key={i} className="text-sm text-gray-700">
                            <span className="font-semibold">User</span> {c}
                          </p>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2 mt-2">
                      <input
                        value={input[post.id] || ""}
                        onChange={(e) =>
                          setInput({ ...input, [post.id]: e.target.value })
                        }
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleComment(post.id)
                        }
                        placeholder="Add a comment..."
                        className="border border-gray-200 rounded-full px-3 py-1 text-sm flex-1 outline-none"
                      />
                      <button
                        onClick={() => handleComment(post.id)}
                        className="bg-black text-white px-3 py-1 text-sm rounded-full"
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}