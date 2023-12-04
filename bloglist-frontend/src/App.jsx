import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import NewBlogPostForm from './components/NewBlogPostForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [newAuthor, setAuthor] = useState('')
  const [newTitle, setTitle] = useState('')
  const [newURL, setURL] = useState('')
  const [notificationMessage, setNotificationMessage] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      showNotification( 'wrong username or password')

    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const addBlog = (event) => {
    //event.preventDefault()

    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newURL,
      likes:0,
      user: user.id,
    }
    //console.log(blogObject)
    blogService
      .create(blogObject)
      .then(returnedBlogs => {
        showNotification( `a new blog ${blogObject.title} ${blogObject.author} added`)
        //setBlogs(blogs.concat(returnedBlogs))
        blogService.getAll().then(blogs =>
          setBlogs( blogs ))
        setTitle('')
        setAuthor('')
        setURL('')
      })
  }

  const blogForm = () => (
    <Togglable buttonLabel="new blog post">
      <NewBlogPostForm
        newTitle={newTitle}
        newAuthor={newAuthor}
        newURL={newURL}
        handleTitleChange={({ target }) => setTitle(target.value)}
        handleAuthorChange={({ target }) => setAuthor(target.value)}
        handleURLChange={({ target }) => setURL(target.value)}
        onSubmit={addBlog}
      />
    </Togglable>
  )


  const Notification = ({ message }) => {
    const notificationStyle = {
      color: 'green',
      backgroundColor: '#4CAF50',
      fontSize: 20
    }

    if (message === null) {
      return null
    }

    return (
      <div style={notificationStyle}>
        {message}
      </div>
    )
  }

  const showNotification = (message) => {
    setNotificationMessage(message)
    setTimeout(() => {
      setNotificationMessage(null)
    }, 3000)
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={notificationMessage} />
        {loginForm()}
      </div>
    )
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser')
    //console.log('logout')
    blogService.setToken(null)
    setUser(null)
  }

  const addLikeCounts = async (blogToUpdate) => {
    const updatedBlog = {
      ...blogToUpdate,
      likes: blogToUpdate.likes + 1,
    }
    //console.log('updatedBlog')
    //console.log(updatedBlog)
    const response = await blogService.update(blogToUpdate.id, updatedBlog)

    //console.log("response")
    //console.log(response)
    setBlogs((Blogs) =>
      Blogs.map((blog) => (blog.id === blogToUpdate.id ? response : blog)))

  }

  const removeBlog = async (blogToDelete) => {
    if (window.confirm('Delete blog by? ' + blogToDelete.author))
    {
      //console.log(user.username)
      //console.log(blogToDelete)
      if(user.username === blogToDelete.user.username)
      {
        const response = await blogService.deleteBlog(blogToDelete.id)
        setBlogs((blogs) => blogs.filter((blog) => blog.id !== blogToDelete.id))
      }
      else
      {
        showNotification( 'you can only delete blog that are created by you')
      }
    }
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notificationMessage} />
      <p>{user.name} logged in
        <button onClick={() => handleLogout()}>Logout</button></p>
      {blogForm()}
      {blogs
        .sort((a,b) => b.likes- a.likes)
        .map(blog =>
          <Blog key={blog.id} blog={blog} user={user} onLikeButtonClicked={addLikeCounts} handleDeleteBlog ={removeBlog} />
        )}
    </div>
  )
}

export default App