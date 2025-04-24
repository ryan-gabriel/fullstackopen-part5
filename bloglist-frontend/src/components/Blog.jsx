import { useState } from "react";
import blogService from "../services/blogs";

const Blog = ({ blog, updateLike }) => {
  const [visible, setVisible] = useState(false);
  const [likes, setLikes] = useState(blog.likes);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const showWhenVisible = { display: visible ? "" : "none" };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const handleLike = async () => {
    const updatedLikes = likes + 1;
    setLikes(updatedLikes);
    try {
      await updateLike(blog.id);
    } catch (error) {
      setLikes(likes);
      console.error("Failed to update like", error);
    }
  };

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}{" "}
        <button onClick={toggleVisibility}>{visible ? "hide" : "view"}</button>
      </div>
      <div style={showWhenVisible}>
        {blog.url} <br />
        likes {likes} <button onClick={handleLike}>like</button> <br />
        {blog.user.name} <br />
      </div>
    </div>
  );
};

export default Blog;
