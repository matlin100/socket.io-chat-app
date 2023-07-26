const users = []

const addUser = (id , userName , room ) => {
 
    if(!userName || !room)
        return {error : 'username and room are required'}

        userName = userName.trim().toLowerCase();
        room = room.trim().toLowerCase();
    const exsistingUser = users.find((user) =>  user.room == room && user.userName == userName)

    if(exsistingUser)
         return {error : 'username alrady used '}

    const user = {id , userName , room }
    users.push(user)

    return {user}
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)
    if (index !== -1)
        return users.splice(index, 1)[0]
}


const getUser = (id) => {
    return users.find((user) => user.id === id)
}

const getUserInRoom = (room) => {
    room.trim().toLowerCase()
    return users.filter((user) => user.room == room)
}


module.exports = { 
    addUser,
    removeUser,
    getUser,
    getUserInRoom
}