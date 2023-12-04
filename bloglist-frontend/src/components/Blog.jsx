import { useState } from 'react'

const Blog = ({ blog, user, onLikeButtonClicked , handleDeleteBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [visible, setVisible] = useState(false)

  const hide = { display: visible ? 'none' : '' }
  const show = { display: visible ? '' : 'none' }


  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    
    <div
     className="blog"
     style={blogStyle}>
      {!visible && (
      <div style={hide}>
        {blog.title} {blog.author}
        <button id="View" onClick={toggleVisibility}>View</button>
      </div>
      )
      }
      {visible &&
      (<div style={show}>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>Hide</button>
        <p>{blog.url}</p>
        {blog.likes}
        <button id="Like" onClick={() => onLikeButtonClicked(blog)}>Like</button>

        {blog.user && (
          <div>
            <p>{blog.user.name}</p>
          </div>
        )}

        {(user.username === blog.user.username) && (
          <button id="Remove" onClick={() => handleDeleteBlog(blog)}>Remove</button>
        )
        }
      </div>
      )}
    </div>
  )
}
export default Blog