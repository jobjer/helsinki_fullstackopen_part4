const mongoose = require('mongoose')

require('dotenv').config()
const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose.connect(url)

let blogTitle = ''
let blogAuthor = ''
let blogUrl = ''
let blogLikes = ''

if (process.argv.length > 2) {
  blogTitle = process.argv[2]
}

if (process.argv.length > 3) {
  blogAuthor = process.argv[3]
}

if (process.argv.length > 4) {
  blogUrl = process.argv[4]
}

if (process.argv.length > 5) {
  blogLikes = process.argv[5]
}


const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

const Blog = mongoose.model('blog', blogSchema)


// For creating database and first record:

// const blog = new Blog({
//   title: 'Jays blog',
//   author: 'Jay',
//   url: 'https://vg.no',
//   likes: 10500
// })

// blog.save().then(() => {
//   console.log('blog saved!')
//   mongoose.connection.close()
// })


// For support of creating new blogs by adding parameters, otherwise list all blogs in DB
if( blogTitle !== ''){
  mongoose
    .connect(url)
    .then(() => {
      console.log('connected')
      // Create blog
      const blog = new Blog({
        title: blogTitle,
        author: blogAuthor,
        url: blogUrl,
        likes: blogLikes
      })
      return blog.save()})
    .then(() => {
      console.log(`added ${blogTitle} Author ${blogAuthor} to blogList`)
      return mongoose.connection.close()
    })
    .catch((err) => console.log(err))
} else {
  mongoose
    .connect(url)
    .then(() =>
    {
      console.log('connected')
      // // Get all blogs
      console.log('blogList:')
      Blog.find({}).then(result => {
        result.forEach(blog => {
          console.log(`Title: ${blog.title} Author: ${blog.author} URL: ${blog.url} Likes: ${blog.likes}` )
        })
        mongoose.connection.close()
      })
        .catch((err) => console.log(err))
    }
    )
}
