const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./users')

const app = express()
app.use(express.static('public'))

const server = http.createServer(app)//http raw server

const io = socketio(server)
const port = process.env.port || 3000


io.sockets.on('connection',socket=>{
    console.log('connected')
    socket.on('join',(options,callback)=>{
        debugger
        const {error,user} = addUser({id:socket.id,...options})
        if(error)
            return callback(error)
        console.log(user)
        socket.join(user.room);

        socket.emit('join',`Welcome ${user.username}, you choose to be ${user.color}`)
        socket.broadcast.to(user.room).emit('join',`Hey team, ${user.username} 
        just joined in and he will play ${user.color}`);

        callback({status:1,user})
    });

    socket.on('movepawn', ({color,id}) => {
        console.log(id)
        const user = getUser(socket.id)
        socket.broadcast.to(user.room).emit('movepawn',{color,id})
    })

    socket.on('roll', ({color,number}) => {
        const user = getUser(socket.id)
        socket.broadcast.to(user.room).emit('roll', {color,number})
    })

    socket.on('disconnect', () => {
        debugger
        const user = removeUser(socket.id)

        if (user) {
            // io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`))
            // io.to(user.room).emit('roomData', {
            //     room: user.room,
            //     users: getUsersInRoom(user.room)
            // })
        }
    })
});



server.listen(port,()=>{
    console.log('port is running')
})

