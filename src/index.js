const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom, getUsersCountInRooms } = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

function postData() {

    app.get('/active', (req, res) => {
        res.send(getUsersCountInRooms())
    })
}
setInterval(postData, 3000)

io.on('connection', (socket) => {
    // console.log('New Websocket Connection')

    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room })

        if (error) {
            return callback(error)
        }

        socket.join(room)


        socket.emit('message', generateMessage('System', 'Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage('System', user.username + ' has joined'))

        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback()
    })

    socket.on('sendMessage', (message, callback) => {

        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('Sorry, profane words are not allowed!')
        }
        const user = getUser(socket.id)
        socket.broadcast.to(user.room).emit('message', generateMessage(user.username, message))
        socket.emit('userMessage', generateMessage(user.username, message))
        callback()
    })
    socket.on('sendLocation', (loc, callback) => {
        const user = getUser(socket.id)
        socket.broadcast.to(user.room).emit('locationMessage', generateLocationMessage(user.username, 'https://google.com/maps/?q=' + loc.latitude + ',' + loc.longitude))
        socket.emit('userLocationMessage', generateLocationMessage(user.username, 'https://google.com/maps/?q=' + loc.latitude + ',' + loc.longitude))
        callback()
    })

    socket.on('disconnect', () => {

        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('message', generateMessage('System', user.username + ' has left!!'))

            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }

    })

})

server.listen(port, () => {
    console.log('Server is up on port ' + port)
})