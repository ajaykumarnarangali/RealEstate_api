const Listing=require('../model/listingSchema');
const {errorHandler}=require('../utils/errorHandler');



module.exports.createListing=async(req,res,next)=>{
    try {
        const {name,description,address,regularPrice,discountedPrice,bathrooms,bedrooms,imageUrls}=req.body
        if(!name || !description || !address || !regularPrice || !discountedPrice ||  !bathrooms || !bedrooms || imageUrls.length==0)
        {
          return next(errorHandler(400,"enter all the fields"));
        }
        const listing=await Listing.create(req.body);
        res.status(201).json({listing})
    } catch (error) {
        next(error);
    }
}

module.exports.getSingleList=async(req,res,next)=>{
    try {
        const singleList=await Listing.findById(req.params.id);
        res.status(200).json(singleList);      
    } catch (error) {
        next(error);
    }
}

module.exports.Search=async(req,res,next)=>{
       try {

        const limit=req.query.limit || 9;
        const startIndex=req.query.startIndex || 0;
       
        let offer=req.query.offer;
        if(offer=='undefined' || offer=='false' || offer==undefined)
        {
            offer={$in:[true,false]};
        }

        let furnished=req.query.furnished;
        if(furnished=='undefined' || furnished=='false' || furnished==undefined)
        {
            furnished={$in:[true,false]};
        }

        let parking=req.query.parking;
        if(parking=='undefined' || parking=='false' || furnished==undefined)
        {
            parking={$in:[true,false]};
        }

        let type=req.query.type;
        if(type=='undefined' || type=='all' || type==undefined)
        {
            type={$in:['sale','rent']};
        }

        const searchTerm=req.query.searchTerm || ''
        const sort=req.query.sort || 'createdAt';
        const order=req.query.order || 'desc';

        const listing=await Listing.find({
            name:{$regex:searchTerm,$options:'i'},
            offer,
            parking,
            furnished,
            type
        }).sort({[sort]:order}).limit(limit).skip(startIndex);


        res.status(200).json({listing});
   
       } catch (error) {
          next(error);
       }
}

module.exports.Offer=async(req,res,next)=>{
    try {
        let listing=await Listing.find({offer:true});
        res.status(200).json({listing});
        
    } catch (error) {
        next(error);
    }
}
module.exports.Sale=async(req,res,next)=>{
    try {
        let listing=await Listing.find({type:'sale'});
        res.status(200).json({listing});
        
    } catch (error) {
        next(error);
    }
}
module.exports.Rent=async(req,res,next)=>{
    try {
        let listing=await Listing.find({type:'rent'});
        res.status(200).json({listing});
    } catch (error) {
        next(error);
    }
}