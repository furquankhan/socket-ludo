const users = []
const MAXPLAYERSINAROOM = 4
const userDetailsInRoom = {};
const colors = ['Red','Green','Blue','Yellow']
const addUser = ({ id, username, room }) => {
    // Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // Validate the data
    if (!username || !room) {
        return {
            error: 'Username and room are required!'
        }
    }

    //Check no. of users in room
    const allUsers = getUsersInRoom(room);
    const noOfUserInRoom = allUsers.length
    if(noOfUserInRoom >= MAXPLAYERSINAROOM){
        return {
            error:'Only four users allowed in a room'
        }
    }


    // Check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    // Validate username
    if (existingUser) {
        return {
            status:0,
            error: 'Username is in use!'
        }
    }
    debugger
    // Get color
    
    let color = colors[0]
    if(allUsers.length > 0){
        const usedColors = allUsers.map(user=>{
            return user.color;
        });
        colors.forEach(c=>{
            if(!usedColors.includes(c)){
                color = c;
                return;
            }
        })
        
    }
    
    // Store user
    const user = { id, username, room, color }
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    return users.find((user) => user.id === id)
}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room)
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}