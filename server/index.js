const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
//Connect DB
require('./connection');

//Import Files
const Users = require('./models/Users');

//app Use
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const port = process.env.PORT || 3000;

//Routes
app.get('/', (req, res) => {
    res.send('Welcome');
});

app.post('/api/register', async (req, res) => {
    try{
        const{fullname,email,password,phone,address} = req.body;

        if(!fullname || !email || !password || !phone || !address){
            return res.status(400).send({error:"Please fill all the fields"});
        }else{
            const alreadyExist = await Users.findOne({ email });
            if(alreadyExist){ res.status(400).send({error:"User already exist"});
            }else{
            const newUser = new Users({fullname,email,password,phone,address});
            bcryptjs.hash(password,10, (err,hashedPassword) => {
                newUser.set({password:hashedPassword});
                newUser.save();
            })
            return res.status(200).send({message:"User Registered Successfully"});
        }
    }
      
    }catch(err){
        console.log(err, 'Error');
    }
})

app.post('/api/login', async (req, res, next) => {
    try{
        const{email,password} = req.body;

        if(!email || !password){
            return res.status(400).send({error: "Please fill all the fields"});
        }else{
            const user = await Users.findOne({ email });
            if(!user){
                res.status(400).send({error: "User or Password is incorrect"});
            }else{
                const validateUser = await bcryptjs.compare(password,user.password);
                if(!validateUser){
                    res.status(400).send({error: "User email or password is incorrect"});
            }else{
                const payload = {
                    userId: user._id,
                    email: user.email,
                }
                const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'THIS_IS_A_JWT_SECRET_KEY';
                
                jwt.sign(payload,JWT_SECRET_KEY,{expiresIn: 84600}, async (err, token) => {
                    await Users.updateOne({_id:user._id},{
                        $set: {token}
                    })
                    user.save();
                    next();
                })

                res.status(200).json({user: user.email, fullname: user.fullname, token: user.token});
            }
        }
        }
    }catch(err){
        console.log(error, 'Error');
    }
})
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});