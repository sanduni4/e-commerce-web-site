import User from "../model/User.js";
import bcrypt from "bcrypt";

export function createUser(req,res)
{
    const newUserData = req.body
    
    newUserData.Password = bcrypt.hashSync(newUserData.Password, 10)
    
    const user = new User(newUserData)
    
    
    user.save().then(()=>{
        res.json({
            message: "User created successfully"
        })

    }).catch((error)=>{
            res.json({
                message:"User not created"
            })
        })
    
}
export function loginUser(req, res){
     User.find({email:req.body.email }).then(
        (user)=>{res.json(user)}
    )

}
    