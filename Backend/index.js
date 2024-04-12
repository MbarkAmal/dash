const express = require('express')
require('dotenv').config()
const cors = require("cors")
const app = express()

const mongoose = require('mongoose')

app.use( express.json() )

app.use (cors())

app.get('/',(req,res)=> {
    res.send('dash admin')
})

const productRouter = require ('./routes/product.router')
const userRouter = require ('./routes/user.router')
const orderRouter = require ('./routes/order.router')

app.use('/Products', productRouter )
app.use('/User',userRouter)
app.use('/Orders',orderRouter)
// connect to db 

mongoose.connect(process.env.CONNECTION_STRING ,
    {
    useNewUrlParser : true,
    useUnifiedTopology : true
    }
)

const db = mongoose.connection;
db.on("error" , console.error.bind(console , "connection error :")) ;
db.once ("open" , function(){
    console.log("database connected successfully ...")
})




app.listen(process.env.PORT, ()=> {
    console.log(`app listing on port ${process.env.PORT}`);
})