import User from "../model/User";

export function createUser(req,res)
{
    const user = new User(req.body)

    
    user.save().then(()=>{
        res.json({
            message: "User created successfully"
        })
        .catch(()=>{
            res.json({
                message:"User not created"
            })
        })
    })
}