const router=require('express').Router();
const listingController=require('../controllers/listingController');
const {verify}=require('../utils/verify');

router.post('/create',verify,listingController.createListing);
router.get('/get/:id',listingController.getSingleList);
router.get('/search',listingController.Search);
router.get('/offer',listingController.Offer);
router.get('/sale',listingController.Sale);
router.get('/rent',listingController.Rent)

module.exports=router;