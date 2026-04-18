import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (storedUser) setUser(storedUser);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = () => {
    const { name, email, password } = form;

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (isLogin) {
      // LOGIN
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const found = users.find(
        (u) => u.email === email && u.password === password
      );
      if (!found) {
        setError("Invalid email or password.");
        return;
      }
      localStorage.setItem("loggedInUser", JSON.stringify(found));
      setUser(found);
      setShowModal(false);
      setForm({ name: "", email: "", password: "" });
    } else {
      // REGISTER
      if (!name) {
        setError("Please enter your name.");
        return;
      }
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const exists = users.find((u) => u.email === email);
      if (exists) {
        setError("Email already registered.");
        return;
      }
      const newUser = { name, email, password };
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("loggedInUser", JSON.stringify(newUser));
      setUser(newUser);
      setShowModal(false);
      setForm({ name: "", email: "", password: "" });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setUser(null);
    setShowDropdown(false);
    navigate("/");
  };

  const openLogin = () => {
    setIsLogin(true);
    setError("");
    setForm({ name: "", email: "", password: "" });
    setShowModal(true);
  };

  const openRegister = () => {
    setIsLogin(false);
    setError("");
    setForm({ name: "", email: "", password: "" });
    setShowModal(true);
  };

  return (
    <>
      {/* NAVBAR */}
      <div className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="flex justify-between items-center px-10 py-4">
          {/* Logo */}
          <Link to="/">
            <h1 className="text-xl font-bold tracking-wide cursor-pointer">
              🌍 WanderLux
            </h1>
          </Link>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            <Link to="/create">
              <button className="px-4 py-1 border border-black text-black rounded-full text-sm hover:bg-black hover:text-white transition">
                + Create Post
              </button>
            </Link>

            {user ? (
              // LOGGED IN — show avatar + dropdown
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 bg-black text-white px-4 py-1 rounded-full text-sm"
                >
                  <span>👤</span>
                  <span>{user.name}</span>
                  <span className="text-xs">▾</span>
                </button>

                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 bg-white shadow-lg rounded-xl w-48 py-2 border border-gray-100"
                    >
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-semibold">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition"
                      >
                        🚪 Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              // NOT LOGGED IN — show Login + Register
              <>
                <button
                  onClick={openLogin}
                  className="px-4 py-1 border border-gray-300 rounded-full text-sm hover:border-black transition"
                >
                  Login
                </button>
                <button
                  onClick={openRegister}
                  className="px-4 py-1 bg-black text-white rounded-full text-sm hover:bg-gray-800 transition"
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* AUTH MODAL */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center px-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Title */}
              <h2 className="text-2xl font-bold mb-1">
                {isLogin ? "Welcome back 👋" : "Create account ✨"}
              </h2>
              <p className="text-sm text-gray-400 mb-6">
                {isLogin
                  ? "Login to continue your journey"
                  : "Join WanderLux today"}
              </p>

              {/* Name (Register only) */}
              {!isLogin && (
                <input
                  name="name"
                  type="text"
                  placeholder="Your name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-3 text-sm outline-none focus:border-black transition"
                />
              )}

              {/* Email */}
              <input
                name="email"
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-3 text-sm outline-none focus:border-black transition"
              />

              {/* Password */}
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 mb-3 text-sm outline-none focus:border-black transition"
              />

              {/* Error */}
              {error && (
                <p className="text-red-500 text-xs mb-3">⚠️ {error}</p>
              )}

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                className="w-full bg-black text-white py-3 rounded-xl text-sm font-semibold hover:bg-gray-800 transition"
              >
                {isLogin ? "Login" : "Create Account"}
              </button>

              {/* Switch */}
              <p className="text-center text-sm text-gray-400 mt-4">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError("");
                    setForm({ name: "", email: "", password: "" });
                  }}
                  className="text-black font-semibold ml-1 hover:underline"
                >
                  {isLogin ? "Register" : "Login"}
                </button>
              </p>

              {/* Close */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-5 text-gray-400 hover:text-black text-xl"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}