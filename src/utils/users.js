const users = []

const addUser = ({ id, username, room }) => {
    //Cleaning data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //Checking for invalid user and room
    if (!username || !room) {
        return {
            error: 'Username and room must be valid'
        }
    }


    //Checking for duplicate data
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    //Validating username
    if (existingUser) {
        return {
            error: 'Username is in use'
        }
    }

    //Storing user
    const user = { id, username, room }
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index != -1) {
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
const getUsersCountInRooms = () => {
    const unique = [...new Set(users.map(obj => obj.room))]
    const data = []
    unique.forEach((room) => {
        let count = 0
        users.forEach((user) => {
            if (user.room === room) {
                count += 1
            }
        })

        const tmp = {
            room,
            count
        }
        data.push(tmp)
    })
    return data
}

// addUser({
//     id: '1',
//     username: 'krish',
//     room: '1'
// })
// addUser({
//     id: '2',
//     username: 'abc',
//     room: '1'
// })
// addUser({
//     id: '3',
//     username: 'def',
//     room: '1'
// })
// console.log(getUsersCountInRooms())

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
    getUsersCountInRooms
}
