const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { body, validationResult } = require('express-validator');

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const jwtSecret = "abcdefghijklmnopqrstuvwxyz12345#"

router.post("/createuser", [
    body('email').isEmail(),
    //incorrect pass => the error msg for the user at frontend
    body('password', 'Invalid Password').isLength({ min: 5 }),
    body('name').isLength({ min: 3 })]
    , async (req, res) => {

        //validation of email password and name
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const salt = await bcrypt.genSalt(10);
        let secPassword = await bcrypt.hash(req.body.password, salt)
        //req.body.password is the password that we req from the user

        try {
            await User.create({
                name: req.body.name,
                password: secPassword,
                //save secPassword in the db instead of raw password entered by user
                email: req.body.email,
                location: req.body.location
            }).then(res.json({ success: true }));
        } catch (error) {
            console.log(error)
            res.json({ success: false });
        }
    })

router.post("/loginuser", [
    body('email').isEmail(),
    body('password', 'Invalid Password').isLength({ min: 5 })],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        let email = req.body.email;
        try {
            let userData = await User.findOne({ email });
            if (!userData) {
                return res.status(400).json({ errors: "Try logging in with the valid email" })
            }

            //to compare the hashed pwd in db with the one the user is entering while login
            const pwdCompare = await bcrypt.compare(req.body.password, userData.password)

            if (!pwdCompare) {
                return res.status(400).json({ errors: "Try logging in with the valid password" })
            }

            const data = {
                user: {
                    id: userData.id
                }
            }

            const authToken = jwt.sign(data, jwtSecret)
            return res.json({ success: true, authToken: authToken })
        } catch (error) {
            console.log(error)
            res.json({ success: false });
        }
    })

module.exports = router;