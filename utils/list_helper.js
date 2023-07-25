const _ = require('lodash')

const dummy = (blogs) => {
    return 1
  }

const totalLikes = (blogs) => {
    const reducer = (sum, item) => {
        return sum + item
    }
    return blogs.map(blog => blog.likes).reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce( function (acc, curr) {
    if (!acc) {
      return curr
    }
    return curr.likes > acc.likes ? curr : acc
  }, null)
}

const mostBlogs = (blogs) => {
  const authorsCount = _.countBy(blogs, 'author')
  const resultObj = _.map(authorsCount, (count, author) => ({'author':author, 'blogs':count}))
  return _.maxBy(resultObj, 'blogs')

}

const mostLikes = (blogs) => {
  const blogsByAuthor = _.groupBy(blogs, 'author')
  const likes = _.map(blogsByAuthor, (authorBlogs, author) => {
    return {
      'author': author,
      'likes':authorBlogs.reduce((acc, blog) => acc + blog.likes, 0)
    }
  })
  return _.maxBy(likes, 'likes')
}

  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  }