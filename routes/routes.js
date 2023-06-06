const express = require('express');

const router = express.Router()

const Model = require('../models/model');

const jwt = require("jsonwebtoken");


const bcrypt = require('bcryptjs');

const User = require('../models/user'); 

const auth = require('../middleware/auth')

module.exports = router;
// user methods


router.get('/',(req,res)=>{



    res.send('welcome to backend');
})


router.post("/register",async (req,res)=>{


    try{


        const {firstname,lastname,email,password} = req.body;

        if(!(email && password && lastname && firstname)){

            req.status(401).send("All files are required")
        }

        const existingUser = await User.findOne({email});

        if(existingUser){

            res.status(401).send("user already found in database");
        }
const myEncyPassword = await bcrypt.hash(password,10);


const user = await User.create({
    firstname,
    lastname,
    email,
    password:myEncyPassword
})

console.log(user);

const token =  jwt.sign({
    id:user._id,email
},'shhhh',{expiresIn:'2h'})

user.token = token
//const newObj = Object.assign({},{...user,token:token})
user.password = undefined;

console.log(user.token);

res.status(201).json(user);

    }catch(err){
console.log(err);
console.log("Error in response route");


    }
})

router.post("/login",async (req,res)=>{
try{

    const {email,password} = req.body;


    if(!(email && password)){

      return  res.status(401).send("email and password are required");
    }

    const user  = await User.findOne({email});

    if(user && (await bcrypt.compare(password,user.password))){

        const token = jwt.sign({id:user._id,email},'shhhh',{expiresIn:'2h'});

        user.password = undefined;
        user.token = token;


        const options = {

            expires:new Date(Date.now() + 3*24*60*60*1000),

            httpOnly:true
        }

     return   res.status(200).cookie("token",token,options).json({

            success:true,
            token,
            user
        })


    }
  return  res.status(400).send("email or password is incorrect");

}catch(err){

        console.log(err);
    }


})

// router.get("/dashboard",auth,(req,res)=>{


//     res.send('Welcome to dashboard');
// })


//Post Method
router.post('/savepost',auth,async (req, res) => {
    const data = new Model({
        title: req.body.title,
        body: req.body.body
    })

    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
})

//Get all Method
router.get('/post',auth, async (req, res) => {
    try{
        const data = await Model.find();
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

//Get by ID Method
router.get('/getOne/:id', (req, res) => {
    res.send('Get by ID API')
})

//Update by ID Method
router.patch('/update/:id', (req, res) => {
    res.send('Update by ID API')
})

//Delete by ID Method
router.delete('/delete/:id', (req, res) => {
    res.send('Delete by ID API')
})

//Get by ID Method
router.get('/getOne/:id', (req, res) => {
    res.send(req.params.id)
})