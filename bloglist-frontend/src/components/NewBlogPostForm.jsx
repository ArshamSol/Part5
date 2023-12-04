import PropTypes from 'prop-types'

const NewBlogPostForm = ({
  onSubmit,
  newTitle,
  handleTitleChange,
  newAuthor,
  handleAuthorChange,
  newURL,
  handleURLChange
}) => {
  const handleSubmit = (event) => {
    event.preventDefault()

    onSubmit({
      title: newTitle,
      author: newAuthor,
      url: newURL,
      likes:0,
    })
  }
  return (
    <div>
      <h2>Create a new blog post</h2>

      <form onSubmit={handleSubmit}>
        <div>Title: 
          <input
          id='Title'
          value={newTitle}
          onChange={handleTitleChange}
          placeholder='write title'
        />
        </div>

        <div>Author: 
          <input
          id='Author'
          value={newAuthor}
          onChange={handleAuthorChange}
          placeholder='write author'/>  
        </div>
        <div>URL: 
          <input
            id='URL'
            value={newURL}
            onChange={handleURLChange}
            placeholder='write url'/>
        </div>
        <button id="create-button" type="submit">Create</button>
      </form>
    </div>
  )
}

NewBlogPostForm.propTypes = {
  onSubmit:PropTypes.func.isRequired,
  newTitle: PropTypes.string.isRequired,
  handleTitleChange: PropTypes.func.isRequired,
  newAuthor: PropTypes.string.isRequired,
  handleAuthorChange: PropTypes.func.isRequired,
  newURL: PropTypes.string.isRequired,
  handleURLChange:PropTypes.func.isRequired
}
export default NewBlogPostForm