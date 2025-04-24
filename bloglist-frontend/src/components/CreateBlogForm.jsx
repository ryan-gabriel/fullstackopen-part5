import React, { useState } from "react";
import blogService from "../services/blogs";

const CreateBlogForm = ({
  blogs,
  setBlogs,
  setErrorMessage,
  setSuccessCreateMessage,
  formRef,
}) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const handleCreate = async (event) => {
    event.preventDefault();
    try {
      const newBlog = {
        title,
        author,
        url,
      };
      const createdBlog = await blogService.create(newBlog);
      setBlogs(blogs.concat(createdBlog));

      setSuccessCreateMessage(`A new blog "${title}" by ${author} added`);
      setTimeout(() => {
        setSuccessCreateMessage(null);
      }, 3000);

      setTitle("");
      setAuthor("");
      setUrl("");

      if (formRef && formRef.current) {
        formRef.current.toggleVisibility();
      }
    } catch (error) {
      setErrorMessage(error.response.data.error);
      console.error(error.response.data.error);
    }
  };

  return (
    <div>
      <h2>Create New</h2>
      <form onSubmit={handleCreate}>
        <div>
          title
          <input
            type="text"
            value={title}
            name="title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            type="text"
            value={author}
            name="author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url
          <input
            type="text"
            value={url}
            name="url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default CreateBlogForm;
