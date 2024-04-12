import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken"; // generates authentication token for users

export const registerController = async(req, res) => {
    try{
        const {email, answer, password} = req.body;
        // validations
        if(!email) return res.send({message: "Email is required."});
        if(!answer) return res.send({message: "Question's answer is required."});
        if(!password) return res.send({message: "Password is required."});
        
        // check user
        const existingUser = await userModel.findOne({email})
        // existing user
        if(existingUser){
            return res.status(200).send({
                success: false,
                message: "Already register please login."                
            })
        } 
        
        // register
        // hash password
        const hashedPassword = await hashPassword(password);
        // save
        const user = await new userModel({ 
            email, 
            answer,
            password:hashedPassword
        }).save()
        
        res.status(201).send({
            success: true,
            message: "User Register Successfully.",
            user
        })
        console.log("here");
    }catch(error){
        console.log(error);
        req.status(500).send({
            success: false,
            message: "Error in Registration",
            error
        })
    }
}

// POST LOGIN
export const loginController = async(req, res) => {
    try {
        const {email, password} = req.body;
        // validation
        if(!email || !password){
            res.status(404).send({
                success: false,
                message: "Invalid email or password"
            })
        }
        // check user
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(404).send({
                success: false,
                message: "Email is not registered"
            })
        }
        // check password
        const match = await comparePassword(password, user.password);
        if(!match){
            return res.status(200).send({
                success: false,
                message: "Invalid Password"
            })
        }
        // token
        const token = await JWT.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'})
        res.status(200).send({
            success: true,
            message: "Logged in successfully",
            user: {
                // name: user.name,
                email: user.email,
                // phone: user.phone,
                // address: user.address
            },
            token,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in login controller",
            error
        })
    }
}

//Forget password
export const forgetPasswordController =async (req, res) => {
    console.log("forget pass backend triggered.");
    try {
        const {email, answer, password:newPassword} = req.body;
        // console.log(req.body);
    if(!email){
        res.status(400).send({message: "Email is required"});
    }
    if(!answer){
        res.status(400).send({message: "Answer is required"});
    }
    if(!newPassword){
        res.status(400).send({message: "New Password is required"});
    }
    //check
    const user = await userModel.findOne({email, answer});
    //validation
    if(!user){
        return res.status(404).send({
            success: false,
            message: "Wrong email or Answer",
        });
    }
    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, {password: hashed});
    res.status(200).send({
        success: true,
        message: "Password Reset Successfully",
    })
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Something went wrong",
        error
      })  
    }
}

// test route
export const testController = (req, res) => {
    res.send("protected route")
}