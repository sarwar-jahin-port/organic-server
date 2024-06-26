import JWT from 'jsonwebtoken';
import userModel from '../models/userModel.js';

export const requireSignIn = async(req, res, next) => {
    try {
        console.log("require sign in");
        // console.log(req.headers);
        const decode = await JWT.verify(
            req.headers.authorization,
            process.env.JWT_SECRET
        );
        // console.log(decode);
        req.user = decode;
        next();
    } catch (error) {
        console.log(error);
    }
}

// admin access
export const isAdmin = async(req, res, next) => {
    try {
        const user = await userModel.findById(req.user._id);
        console.log(user.role);
        if(user.role !== 1){
            res.status(401).send({
                success: false,
                message: "Unauthorized Access"
            });
        }
        else next();
    } catch (error) {
        console.log(error);
        res.status(401).send({
            success: false,
            error,
            message: "Error in admin middleware."
        })
    }
}