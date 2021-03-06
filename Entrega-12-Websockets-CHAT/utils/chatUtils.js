const moment = require('moment');
const fs = require('fs');

const readFile = (fileName) => {
        let readFile = fs.readFileSync(`./utils/${fileName}`, 'utf-8');
        let fileParseado = JSON.parse(readFile);
        return fileParseado
}
const addUser = (socketId, userEmail, avatarPic) => {
    let newUser = {
        id: socketId,
        email: userEmail,
        avatar: avatarPic
    }
    let usersArray = readFile('users.json');
    usersArray.push(newUser);
    fs.writeFileSync('./utils/users.json', JSON.stringify(usersArray, null, '\t'))

    return newUser;
}
const findUser = (socketId) => {
    let usersList = readFile('users.json');
    let userFound = usersList.filter((aUser) => aUser.id === socketId)
    return userFound;
}
const getUsers = () => {
    let usersArray = readFile('users.json')
    return usersArray;
}

const messageFormat = (email, msg, avatar) => {
    let newMessage = {
        email: email,
        msg: msg,
        avatar: avatar,
        time: moment().format('DD/MM/YYYY | h:mm:ss')
    }
    let messagesArray = readFile('messages.json');
    messagesArray.push(newMessage);
    fs.writeFileSync('./utils/messages.json', JSON.stringify(messagesArray, null, '\t'))
    return newMessage;
}
const getRandomAvatar = () => {
    let randomNumber = Math.floor(Math.random() * (10 - 1)) + 1;
    return `avatar${randomNumber}`;
}
module.exports = {
    addUser,
    getUsers,
    messageFormat,
    findUser,
    getRandomAvatar
}