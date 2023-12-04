import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

describe('<Blog />', () => {
    const mockHandler = jest.fn()

    beforeEach(() => {
        const blog = {
            "title": "Book Title",
            "author": "Me",
            "url": "urll",
            "likes": 25,
            "userId": "655fb9a4321c02101e8f7d1c"
          }
        
          render(<Blog blog={blog} onLikeButtonClicked={mockHandler}/>)
      })

    test("blog renders the blog's title and author, but does not render its URL or number of likes", async () => {
  
          const title = screen.getByText('Book Title', { exact: false })
          expect(title).toBeDefined()
    
          const author = screen.getByText('Me', { exact: false })
          expect(author).toBeDefined()
    
          const url = screen.queryByText('urll', { exact: false })
          expect(url).toBeNull()
    
          const likes = screen.queryByText('likes', { exact: false })
          expect(likes).toBeNull()
    
    })
    
    test("blog's URL and number of likes are shown when the view button has been clicked.", async () => {
      
        const viewButton = screen.getByText('View')
    
        const user = userEvent.setup()
        await user.click(viewButton)
    
        const url = screen.getByText('urll', { exact: false })
        expect(url).toBeDefined()

        const numberOfLikes = screen.getByText('25', { exact: false })
        expect(numberOfLikes).toBeDefined()
    })

    test("if the like button is clicked twice, the event handler the component received as props is called twice.", async () => {
      
        const viewButton = screen.getByText('View')
        
        const user = userEvent.setup()

        await user.click(viewButton)
        const likeButton = screen.getByText('Like')           
        await user.click(likeButton)
        await user.click(likeButton)
        expect(mockHandler.mock.calls).toHaveLength(2)
    })

})
