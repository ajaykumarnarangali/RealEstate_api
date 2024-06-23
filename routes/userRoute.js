const router=require('express').Router();
const userController=require('../controllers/userController');
const {verify}=require('../utils/verify');

router.put('/update/:id',verify,userController.updateUser);
router.delete('/delete/:id',verify,userController.deleteUser);
router.get('/listing/:id',verify,userController.getListing);
router.get('/:id',verify,userController.getUser)


module.exports=router;