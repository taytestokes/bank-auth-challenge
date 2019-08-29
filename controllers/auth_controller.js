const bcrypt = require('bcryptjs');

const register = async (req, res) => {
    // body info
    const {email, first_name, last_name, password} = req.body;
    // database object
    const db = req.app.get('db');
    // find a user if it has matching email
    const foundUser = await db.find_user([email]);
    // check to see if user exists
    if(foundUser[0]) return res.status(409).send('Sorry, email already exists!');
    // create hashed and salted password
    const salt = bcrypt.genSaltSync(15);
    const hashedPassword = bcrypt.hashSync(password, salt);
    // register the user
    const newUser = await db.register_user([email, first_name, last_name, hashedPassword]);
    // set the user to the session
    req.session.user = newUser[0];
    // send a response
    res.status(200).send(req.session.user);
};

const login = async (req, res) => {
    // body info
    const {email, password} = req.body;
    // db instance
    const db = req.app.get('db');
    // find user with email
    const foundUser = await db.find_user([email])
    // check to see if user exists
    if(!foundUser[0]) return res.status(409).send('Sorry, email does not exist. Please try again!');
    // compare passwords
    const authenticated = bcrypt.compareSync(password, foundUser[0].password);
    // check authenticated
    if(authenticated){
        // remove password
        delete foundUser[0].password;
        // set user to session
        req.session.user = foundUser[0];
        // send a response
        res.status(200).send(req.session.user);
    } else {
        // if fails
        res.status(403).send('Invalid email or password. Please try again!')
    }
};

const logout = (req, res) => {
    // destroy session
    req.session.destroy();
    // send a response
    res.status(200).send('User has been logged out!')
};

module.exports = {
    register,
    login,
    logout
};