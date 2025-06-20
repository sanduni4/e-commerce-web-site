import Product from '../model/Product.js';

export function getProducts(req,res)
{
    Product.find().then(
        (productList)=>{
            res.satus(200).json({
                list: productList
            })
        }
    ).catch(
        (err)=>{
            res.json({
                message : "Error"
            })
        }

    )
}

export function createProduct(req, res){
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


