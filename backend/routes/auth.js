const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');
const fetchuser = require('../middleware/fetchuser');
const router = express.Router();
const { body, validationResult } = require('express-validator')


const MY_SIGNATURE = 'hola-como-ustad';


//endpoint - create user
router.post('/createuser', [
    body("name", 'Enter a valid name').isLength({ min: 3 }),
    body("email", 'Enter a valid email').isEmail(),
    body("password", 'Enter a valid password').isLength({ min: 5 }),
], async (req, res) => {

    //check passowrd validity
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(404).json({ errors: errors.array() });
    }

    //check if user already exists
    let user = await UserModel.findOne({ email: req.body.email });
    // console.log(user);
    if (user) {
        return res.status(400).json({ error: "A user with this email already exists." })
    }

    //hashing passwords
    var salt = await bcrypt.genSalt(10);
    var secret = req.body.password;
    var hash = await bcrypt.hash(secret, salt);

    //create user
    try {

        user = await UserModel.create({
            name: req.body.name,
            email: req.body.email,
            password: hash,
        })

        //create jwt token
        var token = jwt.sign(user.id, MY_SIGNATURE);

        return res.json({ jwt: token });
    }
    catch (err) {
        console.log(err);
        return res.json({ error: "internal server error" });

    }

})



//endpoint - login
router.post('/login', [
    body("email", 'Enter a valid email').isEmail(),
    body("password", 'Enter a valid password').isLength({ min: 5 }),
], async (req, res) => {

    //check passowrd validity
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(404).json({ errors: errors.array() });
    }

    try {

        //check if user already exists
        let user = await UserModel.findOne({ email: req.body.email });
        // console.log(user);
        if (!user) {
            return res.status(400).json({ error: "wrong email or password" })
        }

        //hashing passwords
        var secret = req.body.password;
        var hash = user.password

        //compare password
        var isPasswordValid = await bcrypt.compare(secret, hash);


        if (!isPasswordValid) {
            return res.status(400).json({ error: 'wrong password' })
        }
        
        const data = {
            user:{
                id:user.id
            }
        }

        //create jwt token
        var token = jwt.sign(data, MY_SIGNATURE);

        return res.json({ jwt: token });
    }


    catch (err) {
        console.log(err);
        return res.json({ error: "internal server error" });

    }

})

//endpoint - get user
router.post('/getuser', fetchuser, async (req, res) => {

    try {
        console.log(req.user);
        userId = req.user.id;
        const user = await UserModel.findById(userId).select("-password");
        res.send(user);
    }

    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router