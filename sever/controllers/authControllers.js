const Users = require('../models/userModel');
const bcrypt = require('bcrypt');

const authControllers = {
    //REGISTER
    register: async (req, res) => {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);

            //create new user
            const newUser = await new Users({
                username: req.body.username,
                email: req.body.email,
                password: hashed,
            });

            //save to database
            const user = await newUser.save();
            res.status(200).json(user);

        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }
}