const mongoose = require('mongoose')

require('dotenv').config()
const url = process.env.TEST_MONGODB_URI

mongoose.set('strictQuery', false)

mongoose.connect(url)

// let blogTitle = ''
// let blogAuthor = ''
// let blogUrl = ''
// let blogLikes = ''

// if (process.argv.length > 2) {
//   blogTitle = process.argv[2]
// }

// if (process.argv.length > 3) {
//   blogAuthor = process.argv[3]
// }

// if (process.argv.length > 4) {
//   blogUrl = process.argv[4]
// }

// if (process.argv.length > 5) {
//   blogLikes = process.argv[5]
// }


const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

const Blog = mongoose.model('blog', blogSchema)



// For creating database and first record:

const blogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }  
]

// for (let i = 0; i < blogs.length; i++) {

let index = 5

const blog = new Blog({
  title: blogs[index].title,
  author: blogs[index].author,
  url: blogs[index].url,
  likes: blogs[index].likes
})

blog.save().then(() => {
  console.log('blog saved!')
  mongoose.connection.close()
  
})

// }



// For support of creating new blogs by adding parameters, otherwise list all blogs in DB
// if( blogTitle !== ''){
//   mongoose
//     .connect(url)
//     .then(() => {
//       console.log('connected')
//       // Create blog
//       const blog = new Blog({
//         title: blogTitle,
//         author: blogAuthor,
//         url: blogUrl,
//         likes: blogLikes
//       })
//       return blog.save()})
//     .then(() => {
//       console.log(`added ${blogTitle} Author ${blogAuthor} to blogList`)
//       return mongoose.connection.close()
//     })
//     .catch((err) => console.log(err))
// } else {
//   mongoose
//     .connect(url)
//     .then(() =>
//     {
//       console.log('connected')
//       // // Get all blogs
//       console.log('blogList:')
//       Blog.find({}).then(result => {
//         result.forEach(blog => {
//           console.log(`Title: ${blog.title} Author: ${blog.author} URL: ${blog.url} Likes: ${blog.likes}` )
//         })
//         mongoose.connection.close()
//       })
//         .catch((err) => console.log(err))
//     }
//     )
// }
