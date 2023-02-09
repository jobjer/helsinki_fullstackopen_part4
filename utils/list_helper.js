const dummy = (blogs) => {
  console.log(blogs)
  return 1
}


const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => {
    return sum + blog.likes
  }, 0)
}


const favoriteBlog = (blogs) => {
  const favoredBlog = blogs.reduce((blog, favBlog ) => blog.likes > favBlog.likes ? blog : favBlog)

  return {
    title: favoredBlog.title,
    author: favoredBlog.author,
    likes: favoredBlog.likes
  }
}

const authorWithMostBlogs = (blogs) => {
  
  const blogsPerAuthor = []

  blogs.forEach(blog => {
    let authorAdded = {}
    authorAdded = blogsPerAuthor.find(({author}) => author === blog.author)

    if(authorAdded === undefined){
      let blogToAdd = { author: blog.author, blogs: 1 }
      blogsPerAuthor.push(blogToAdd)
    } else {
      let objIndex = blogsPerAuthor.findIndex((obj => obj.author === blog.author))
      blogsPerAuthor[objIndex].blogs = blogsPerAuthor[objIndex].blogs + 1
    }
  })
  return blogsPerAuthor.reduce((prev, current) => (prev.blogs > current.blogs) ? prev : current)
}

const authorWithMostLikes = (blogs) => {
  const likesPerAuthor = []

  blogs.forEach(blog => {
    let authorAdded = {}
    authorAdded = likesPerAuthor.find(({author}) => author === blog.author)

    if(authorAdded === undefined){
      let blogToAdd = { author: blog.author, likes: blog.likes }
      likesPerAuthor.push(blogToAdd)
    } else {
      let objIndex = likesPerAuthor.findIndex((obj => obj.author === blog.author))
      likesPerAuthor[objIndex].likes = likesPerAuthor[objIndex].likes + blog.likes
    }
  })
  return likesPerAuthor.reduce((prev, current) => (prev.likes > current.likes) ? prev : current)

}

module.exports = {
  dummy, totalLikes, favoriteBlog, authorWithMostBlogs, authorWithMostLikes
}
