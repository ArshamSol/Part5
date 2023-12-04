import React from 'react'
import { render , screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import NewBlogPostForm from './NewBlogPostForm'
import userEvent from '@testing-library/user-event'

test("the new blog form calls the event handler it received as props with the right details", async () => {
  
  const user = userEvent.setup()

  const onSubmitMock = jest.fn()
  
  render(
    <NewBlogPostForm
      onSubmit={onSubmitMock}
      newTitle="Title of new Blog"
      handleTitleChange={() => {}}
      newAuthor="Author of new Blog"
      handleAuthorChange={() => {}}
      newURL="URL of new Blog"
      handleURLChange={() => {}}
    />
  )

  const newBlogButton = screen.getByText('Create')

  const titleInput = screen.getByPlaceholderText('write title')
  await user.type(titleInput, 'Title of new Blog')
  
  const authorInput = screen.getByPlaceholderText('write author')
  await user.type(authorInput, 'Author of new Blog')

  const urlInput = screen.getByPlaceholderText('write url')
  await user.type(urlInput, 'URL of new Blog')

  await user.click(newBlogButton)

  expect(onSubmitMock.mock.calls).toHaveLength(1)
  expect(onSubmitMock.mock.calls[0][0].title).toBe('Title of new Blog')
})