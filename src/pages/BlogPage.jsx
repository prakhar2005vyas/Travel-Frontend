import { useParams } from "react-router-dom";
import Comments from "../components/Comments";

export default function BlogPage() {
  const { id } = useParams();
  const blogs = JSON.parse(localStorage.getItem("blogs")) || [];

  const blog = blogs.find((b) => b.id == id);

  if (!blog) return <p className="p-5">Blog not found</p>;

  return (
    <div className="p-5">
      <img src={blog.image} className="w-full rounded mb-4" />
      <h1 className="text-2xl font-bold">{blog.title}</h1>
      <p className="mt-2">{blog.content}</p>

      <Comments blogId={id} />
    </div>
  );
}