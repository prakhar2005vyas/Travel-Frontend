import { useNavigate } from "react-router-dom";

export default function BlogCard({ blog }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/blog/${blog.id}`)}
      className="bg-white rounded shadow hover:scale-105 transition cursor-pointer"
    >
      <img src={blog.image} className="h-40 w-full object-cover rounded-t" />
      <div className="p-3">
        <h2 className="font-bold">{blog.title}</h2>
      </div>
    </div>
  );
}