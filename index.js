const express=require('express');
const app=express();
const dotenv=require('dotenv');
dotenv.config({path:'./config/config.env'});
const {connection}=require('./model/connection');
const cookieParser=require('cookie-parser');
const cors=require('cors');

const userRouter=require('./routes/userRoute');
const authRouter=require('./routes/authRoute');
const listingRouter=require('./routes/listingRoute');

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(cors());

app.use('/api/user',userRouter);
app.use('/api/auth',authRouter);
app.use('/api/listing',listingRouter);

app.use((err,req,res,next)=>{
   const  statusCode=err.statusCode || 500;
   const message=err.message || "internal server error";
   return res.status(statusCode).json({
    success:false,
    statusCode,
    message
   })
})

connection();
app.listen(process.env.PORT,()=>{console.log(`server running successfully on ${process.env.PORT}`)});