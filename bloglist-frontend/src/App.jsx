import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

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
      showNotification( `wrong username or password`)
      
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
 const handleAuthorChange = (event) => {
  setAuthor(event.target.value)
  }

  const handleTitleChange = (event) => {
    setTitle(event.target.value)
  }

  const handleURLChange = (event) => {
    setURL(event.target.value)
  }
  
  const addBlog = (event) => {
    event.preventDefault()
    
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newURL,
      likes:10,
    }
    //console.log(blogObject)
    blogService
      .create(blogObject)
        .then(returnedBlogs => {
        showNotification( `a new blog ${blogObject.title} ${blogObject.author} added`)
        setBlogs(blogs.concat(returnedBlogs))
        setTitle('')
        setAuthor('')
        setURL('')
      })
  }

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <div>Title: <input 
      value={newTitle}
      onChange={handleTitleChange}
      />
    </div>
    
    <div>Author: <input  
          value={newAuthor}
          onChange={handleAuthorChange}/>
    </div>
    <div>
    URL: <input  
          value={newURL}
          onChange={handleURLChange}/>
    </div>
      <button type="submit">Create</button>
    </form>  
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
  console.log("logout")
  blogService.setToken(null)
  setUser(null)
  }
  
  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notificationMessage} />
      <p>{user.name} logged in 
      <button onClick={() => handleLogout()}>Logout</button></p>
      {blogForm()}
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App