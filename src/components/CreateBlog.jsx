export default function CreateBlog({ setBlogs }) {
  const handleSubmit = (e) => {
    e.preventDefault();

    const title = e.target.title.value;
    const content = e.target.content.value;
    const file = e.target.image.files[0];

    const reader = new FileReader();

    reader.onload = () => {
      const blogs = JSON.parse(localStorage.getItem("blogs")) || [];

      const newBlog = {
        id: Date.now(),
        title,
        content,
        image: reader.result,
      };

      blogs.push(newBlog);
      localStorage.setItem("blogs", JSON.stringify(blogs));
      setBlogs(blogs);
    };

    reader.readAsDataURL(file);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-2">
      <input name="title" placeholder="Title" className="border p-2 w-full" />
      <textarea name="content" className="border p-2 w-full" />
      <input type="file" name="image" />
      <button className="bg-green-600 text-white px-4 py-2 rounded">
        Post
      </button>
    </form>
  );
}