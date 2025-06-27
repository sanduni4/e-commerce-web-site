import Product from '../model/Product.js';

export async function getProducts(req,res)
{
        console.log(req.user);

        if(req.user==null){
        res.json({
            message:"you are not logged in"
        })
        return;
    }

   try{
    const productList = await Product.find()

    res.json({
        list : productList
    })
}catch(e){
    res.json({
        message : "Error"
    })
}
}

export function createProduct(req, res){

    console.log(req.user);

    if(req.user==null){
        res.json({
            message:"you are not logged in"
        })
        return;
    }

    if(req.user.type !== "Admin"){
        res.json({
            message:"you are not admin"
        })
        return;
    }

    
    const product = new Product(req.body)
    product.save().then(()=>{
        res.json({
            message : "Product created successfully"
        })
    }).catch((err)=>{
        res.json({
            message : "Product not created"
        })
    })
}

export function deleteProduct(req,res){
    Product.deleteOne({name: req.body.name}).then(()=>
    {
        res.json({
            massage : "Product deleted successfully"
        })
    }).catch((err)=>{
        res.json({
            message : "Product not deleted"
        })
    })
}

export function getProductByName(req, res){
    const name = req.body.name;
   Product.find({name : name}).then((productList)=>{
    res.json({
        list : productList
    })
   }).catch((err)=>{
       res.json({
           message : "Error"
       })
   })
}


