const moment = require('moment');
const userModel = require('./models/users');
const mensajesModel = require('./models/mensajes');

class MessagesOperations {
    async addUser(socketId, userEmail, avatarPic) {
        try {
            let newUser = {
                socket_id: socketId,
                email: userEmail,
                avatar: avatarPic
            }
            const addUser = await userModel.create(newUser);
            return newUser;
        } catch (error) {
            throw error;
        }
    }

    getRandomAvatar() {
        let randomNumber = Math.floor(Math.random() * (10 - 1)) + 1;
        return `avatar${randomNumber}`;
    }

    messageFormat = (socketId, email, avatar, msg) => {
        const newMessage = {
            author: {
                id: socketId,
                email: email,
                avatar: avatar
            },
            txt: msg
        }
        return newMessage;
    }

    async getUsers() {
        try {
            const usersList = await userModel.find({});
            return usersList;
        } catch (error){
            throw error
        }
    }

    async findUser(socketID) {
        try {
            const getUser = await userModel.find({socket_id: socketID})
             return getUser;
        } catch (error) {
            throw error
        }
    }

    async saveMessage(msg) {
        try {
            console.log(msg);
            await  mensajesModel.create(msg);
        } catch (error) {
            throw error;
        }
    }
}

const messagesOperations = new MessagesOperations();
module.exports = messagesOperations;