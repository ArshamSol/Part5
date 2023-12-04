describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Arsham Soltani',
      username: 'Arsham32',
      password: 'String'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user) 
    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function() {
    cy.contains('Log in to application')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('input:first').type('Arsham32')
      cy.get('input:last').type('String')
      cy.contains('login').click()
    })

    it('fails with wrong credentials', function() {
      cy.get('input:first').type('Arsham32')
      cy.get('input:last').type('wrongPass')
      cy.contains('login').click()
      cy.contains('wrong username or password')
    })
  })

  describe('Blog app', function() {
  
    describe('When logged in', function() {
      beforeEach(function() {
        cy.get('input:first').type('Arsham32')
        cy.get('input:last').type('String')
        cy.contains('login').click()
      })
  
      it('A blog can be created', function() {
        cy.contains('new blog post').click()
        cy.get('#Title').type('New Blog Title')
        cy.get('#Author').type('New Author')
        cy.get('#URL').type('new URL')
        cy.get('#create-button').click()
        cy.contains('New Blog Title')
      })

      describe('After Blog creation', function() {
        beforeEach(function() {
          cy.contains('new blog post').click()
          cy.get('#Title').type('New Blog Title')
          cy.get('#Author').type('New Author')
          cy.get('#URL').type('new URL')
          cy.get('#create-button').click()
          cy.contains('New Blog Title')
          cy.get('#View').click()
        })
    
        it('Users can like a blog', function() {
          cy.get('#Like').click().then(() =>
          cy.contains('1'))
        })
        it('user who created a blog can delete it.', function() {
          cy.get('#Remove').click()
          cy.contains('New Blog Title').should('not.exist')
          
        })
        it('only the creator can see the delete button of a blog', function() {
          cy.contains('Logout').click()
          const user = {
            name: 'new user',
            username: 'newUser',
            password: 'String'
          }
          cy.request('POST', 'http://localhost:3003/api/users/', user)
        
            cy.get('input:first').type('newUser')
            cy.get('input:last').type('String')
            cy.contains('login').click()
            cy.get('#View').click()
            cy.get('#Remove').should('not.exist')
        })
        it.only('blogs are ordered according to likes with the blog with the most likes being first.', function() {
         
          cy.get('#Title').type('New Blog Title 2')
          cy.get('#Author').type('New Author 2')
          cy.get('#URL').type('new URL 2')
          cy.get('#create-button').click()

          
          cy.get('.blog').eq(1).get('#View').click()
          cy.contains('New Blog Title 2').find('#Like').click().then(()=>
          {
            cy.contains('New Blog Title 2').find('#Like').click()
          })
  
          cy.get('.blog').eq(0).should('contain', 'New Blog Title 2')
          cy.get('.blog').eq(1).should('contain', 'New Blog Title')
        })
      })
    })
  })  
})