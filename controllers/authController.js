const User = require('../model/userSchema');
const bcrypt = require('bcrypt');
const { errorHandler } = require('../utils/errorHandler');
const jwt=require('jsonwebtoken');


module.exports.signUp = async (req, res, next) => {
   const { username, email, password } = req.body;
   try {
      if (!username || !email || !password) {
         return next(errorHandler(400, "fill all the fields"));
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, email, password: hashedPassword });
      await newUser.save();
      res.status(201).json({ message: "user created" });
   } catch (error) {
      next(error);
   }
}

module.exports.signIn=async(req,res,next)=>{
   const {email,password}=req.body;
   try {
      if(!email || !password)
      {
         return next(errorHandler(400,"fill all the fields"));
      }
      const validUser=await User.findOne({email:email});
      if(!validUser)
      {
         return next(errorHandler(404,"user not found"));
      }
      const isMatch=await bcrypt.compare(password,validUser.password);
      if(!isMatch)
      {
         return next(errorHandler(401,"invalid credentials"));
      }
      const token=jwt.sign({id:validUser._id},process.env.JWT_SECRET);
      const {password:pass,...rest}=validUser._doc;
      res.cookie("access_token",token).status(200).json({message:"login successfully",user:rest});
   } catch (error) {
    next(error);  
   }
}


module.exports.Google=async(req,res,next)=>{
   try {
      const user=await User.findOne({email:req.body.email});

      if(user)
      {
      //if user exist signIn

      const token=jwt.sign({id:user._id},process.env.JWT_SECRET);

      const {password:pass,...rest}=user._doc;

      return res.cookie("access_token",token).status(200).json({message:"login successfully",user:rest});
      }else{
      //if user doesn't exist signUp
      const generatePassword=Math.random().toString(36).slice(-8)+Math.random().toString(36).slice(-8);
      const hashedPassword=await bcrypt.hash(generatePassword,10)
      
        const newUser=new User({
         username:req.body.username.split(" ").join("").toLowerCase(),
         email:req.body.email,
         password:hashedPassword,
         avatar:req.body.photo
        })
      await newUser.save();
       const token=jwt.sign({id:newUser._id},process.env.JWT_SECRET);
       const {password:pass,...rest}=newUser._doc;
      return res.cookie("access_token",token).status(200).json({message:"login successfully",user:rest});
      }  
   } catch (error) {
      next(error)
   }
}

module.exports.signOut=(req,res,next)=>{
   try {
       res.clearCookie("access_token");
       res.status(200).json({message:"logout successfully"});  
   } catch (error) {
       next(error);
   }
}