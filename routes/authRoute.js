const router=require('express').Router();
const authController=require('../controllers/authController');

router.post('/signup',authController.signUp);
router.post('/signin',authController.signIn);
router.post('/google',authController.Google);
router.get('/sign-out',authController.signOut)



module.exports=router;