import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import CreateBlogForm from "./components/CreateBlogForm";
import LoginForm from "./components/LoginForm";
import logoutService from "./services/auth/logout";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successCreateMessage, setSuccessCreateMessage] = useState(null);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedNoteappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
    }
  }, []);

  const handleLogout = async (event) => {
    event.preventDefault();
    logoutService.logout();
    setUser(null);
    setUsername("");
    setPassword("");
  };

  const blogFormRef = useRef();

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility();
      const createdBlog = await blogService.create(blogObject);
      setBlogs(blogs.concat(createdBlog));
      setSuccessCreateMessage(`A new blog "${blogObject.title}" by ${blogObject.author} added`);
      
      setTimeout(() => {
        setSuccessCreateMessage(null);
      }, 3000);
      
    } catch (error) {
      setErrorMessage(error.response.data.error);
      throw error
    }
  };

  if (user === null) {
    return (
      <div>
        {errorMessage && <Notification message={errorMessage} type="error" />}
        <LoginForm setErrorMessage={setErrorMessage} setUser={setUser} />
      </div>
    );
  }

  return (
    <div>
      {successCreateMessage && (
        <Notification message={successCreateMessage} type="success" />
      )}
      <h2>blogs</h2>
      <p>
        {user.name} logged in <button onClick={handleLogout}>Log Out</button>
      </p>
      <Togglable buttonLabel="new note" ref={blogFormRef}>
        <CreateBlogForm createBlog={addBlog} />
      </Togglable>

      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App;
