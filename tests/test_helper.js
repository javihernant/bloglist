const initialUsers = [
    {
        id: '64c289488b7bc25882239d16',
        username: 'geronimo',
        name: 'Geronimo',
        password: '$2b$10$FIlVD03i4xRps63vsutaIeJDGnzozlaUe0QGfko3tEMgSIaFuXAqO',
        blogs: [
            '64c3a53e59f2a1b776d59c07',
            '64c3a57159f2a1b776d59c09',
            '64c3a5cd59f2a1b776d59c0a'
        ],
    }
]
const initialBlogs = [
    {
        id: '64c3a53e59f2a1b776d59c07',
        title: 'Ed sheeran fans',
        author: 'A fan',
        url: 'http://edsheeran.es',
        likes: 9,
        user: '64c289488b7bc25882239d16'
    },
    {
        id: '64c3a57159f2a1b776d59c09',
        title: 'google shit',
        author: 'lol',
        url: 'http://google.es',
        likes: 20,
        user: '64c289488b7bc25882239d16'
    },
    {
        id: '64c3a5cd59f2a1b776d59c0a',
        title: 'shitty wok',
        author: 'southpark',
        url: 'http://southpark.es',
        likes: 999,
        user: '64c289488b7bc25882239d16'
    },
]
module.exports = { initialBlogs, initialUsers }