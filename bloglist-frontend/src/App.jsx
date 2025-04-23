import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import CreateBlogForm from "./components/CreateBlogForm";
import LoginForm from "./components/LoginForm";
import logoutService from "./services/auth/logout";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

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
    logoutService.logout()
    setUser(null);
    setUsername("");
    setPassword("");
  };

  if (user === null) {
    return (
      <LoginForm setErrorMessage={setErrorMessage} setUser={setUser}/>
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      <p>{user.name} logged in <button onClick={handleLogout}>Log Out</button></p>

      <CreateBlogForm setErrorMessage={setErrorMessage} blogs={blogs} setBlogs={setBlogs}/>
      
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App;
