const dummy = (blogs) => {
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


module.exports = {
  dummy, totalLikes, favoriteBlog
}
