const listHelper = require('../utils/list_helper')
const helper = require('./test_helper')

test('dummy returns one', () => {

  const blogs = []
  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  const emptyBlog = []

  test('of empty list is zero', () => {
    const result = listHelper.totalLikes(emptyBlog)
    expect(result).toBe(0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(helper.initialBlogs)
    expect(result).toBe(36)
  })


})

describe('favorite blog has 12 likes', () => {

  const favoredBlog = {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    likes: 12
  }

  test('favorite blog has the most likes', () => {
    const result = listHelper.favoriteBlog(helper.initialBlogs)
    expect(result).toEqual(favoredBlog)
  })

  describe('the most published author data is correct', () => {
  
    const amountOfBlogsOfMostPublishedAuthor = {
      author: 'Robert C. Martin',
      blogs: 3
    }
  
    test('the most published author data is correct', () => {
      const result = listHelper.authorWithMostBlogs(helper.initialBlogs)
      expect(result).toEqual(amountOfBlogsOfMostPublishedAuthor)
    })
  })
  describe('the most liked author data is correct', () => {
      
    const mostLikedAuthor = {
      author: 'Edsger W. Dijkstra',
      likes: 17
    }
  
    test('the most liked author data is correct', () => {
      const result = listHelper.authorWithMostLikes(helper.initialBlogs)
      expect(result).toEqual(mostLikedAuthor)
    })
  })
})