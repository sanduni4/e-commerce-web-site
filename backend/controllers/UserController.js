import User from "../model/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


export function createUser(req,res)
{
    const newUserData = req.body;

    if (!newUserData.Password) {
    return res.status(400).json({ message: "Password is required" });
  }

    
    newUserData.Password = bcrypt.hashSync(newUserData.Password, 10)
    
    const user = new User(newUserData)
    
    user.save().then(()=>{
        res.json({
            message: "User created successfully"
        })

    }).catch((error)=>{
            res.status(500).json({
                message:"User not created",error
            })
        })
    
}
export function loginUser(req, res){
     User.find({email:req.body.email }).then(
        (user)=>{
            if (user.length ==0){
                res.json({
                    message: "User not found"
                })
            }
            else{
                const users = user[0];

                const IsPasswordValid = bcrypt.compareSync(
                    req.body.Password,
                     users.Password
                    );

                if(IsPasswordValid){
                    const token = jwt.sign({
                         email: users.email,
                         firstName: users.firstName,
                         lastName: users.lastName,
                         isBlocked: users.isBlocked,
                         type: users.type ,
                         profilePicture : users.profilePicture,
                        },
                        process.env.SECRET_KEY, )
                    console.log(token);
                
                 res.json({
                    message: "Login successfully", 
                    token: token,
                 });
                }

                else{
                    res.status(401).json({
                        message: "Try again, password is incorrect",
                    });
                }
            }
        }
    )

}
    