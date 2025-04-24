import { useState } from "react";
import blogService from "../services/blogs";

const Blog = ({ blog }) => {
  const [visible, setVisible] = useState(false);
  const [likes, setLikes] = useState(blog.likes)


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

  const handleLike = async() => {
    try{
      const curBlog = await blogService.getBlog(blog.id)
      const newBlog = { ...curBlog, likes: curBlog.likes + 1 };
      const updatedBlog = await blogService.updateLike(newBlog.id, newBlog)
      setLikes(updatedBlog.likes)
    }
    catch(error){
      throw error
    }

  }

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
