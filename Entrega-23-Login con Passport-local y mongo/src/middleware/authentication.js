const passport = require('passport');
const passportLocal = require('passport-local');
const usersModel = require('../db/models/users');

const LocalStrategy = passportLocal.Strategy;

const strategyOptions = {
    usernameField: 'username',
    //emailField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}

const registerFunc = async (req, username, password, done) => {
    try {
        const {username, email, password} = req.body;
        if(!username || typeof username !== 'string' || typeof email !== 'string' || !email || !password || typeof password !== 'string'){
            return done(null, false, {error: 'La informacion ingresada es invalida'});
        }

        const checkUsernameOrEmail = {$or: [{username: username}, {email: email}]};
        const findUser = await usersModel.findOne(checkUsernameOrEmail);
        if(findUser) {
            return done(null, false, {error: 'El usuario ya fue registrado'})
        } else {
            const userData = {
                username,
                email, 
                password
            }
            const newUser = new usersModel(userData);
            await newUser.save();
            return done(null, newUser)
        }
    } catch (error) {
        done(error)
    }
};
const loginFunc = async (req, username, password, done) => {
    try {
        const findUser = await usersModel.findOne({username});
        if(!findUser){
            return done(null, false, {error: 'El usuario no existe'})
        }
        const comparePassword = await findUser.isValidPassword(password);
        if(!comparePassword){
            return done(null, false, {error: 'La contraseña no coincide'})
        }
        return done(null, findUser);
    } catch(error) {
        done(error)
    }
}

passport.use('signup', new LocalStrategy(strategyOptions, registerFunc));
passport.use('login', new LocalStrategy(strategyOptions, loginFunc));

passport.serializeUser((user, done) => {
    done(null, user._id)
})
passport.deserializeUser((userId, done) => {
    usersModel.findById(userId, function (error, user) {
        done(error, user);
    });
});

module.exports = passport;
