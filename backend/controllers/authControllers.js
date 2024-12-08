const Users = require('../models/user');
const bcrypt = require('bcrypt');

const authControllers = {
    // REGISTER
    register: async (req, res) => {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);

            // Create new user
            const newUser = await  new Users({
                username: req.body.username,
                email: req.body.email,
                password: hashed,
            });

            // Save to database
            const user = await newUser.save();
            res.status(200).json(user);

        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    // LOGIN
    loginUser: async (req, res) => {
        try {
            const user = await Users.findOne({ username: req.body.username });
            if  (!user){
                return res.status(400).json({ msg: "Wrong usename" });
            }
            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if (!validPassword){
                return res.status(400).json({ msg: "Wrong password" });
            }
            if (user && validPassword){
                res.status(200).json(user);
            }
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    },
};

module.exports = authControllers;