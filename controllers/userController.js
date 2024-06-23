const { errorHandler } = require('../utils/errorHandler');
const User = require('../model/userSchema');
const Listing = require('../model/listingSchema');
const bcrypt = require('bcrypt');

module.exports.updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(errorHandler(403, "Forbidden"));
    }

    try {
        const isUsernameExist = await User.findOne({ username: req.body.username });
        if (isUsernameExist) {
            if (req.user.id !== isUsernameExist._id) {
                return next(errorHandler(400, "username already exist"));
            }
        }
        const isEmailExist = await User.findOne({ email: req.body.email });
        if (isEmailExist) {
            if (req.user.id !== isEmailExist._id) {
                return next(errorHandler(400, "email already exist"));
            }
        }
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar
            }
        }, { new: true })

        const { password, ...rest } = updatedUser._doc;
        res.status(200).json({ message: " user Updated successfully", success: true, user: rest });

    } catch (error) {
        next(error);
    }
}

module.exports.deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(errorHandler(403, "Forbidden"));
    }
    try {
        const user = await User.findById(req.params.id);
        await user.deleteOne();
        res.clearCookie("access_token");
        res.status(200).json({ message: "user has been deleted" })
    } catch (error) {
        next(error)
    }
}

module.exports.getListing = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(errorHandler(403, "you can access only your Listing"));
    }
    try {
        let userListing = await Listing.find({ userRef: req.params.id });
        res.status(200).json(userListing);
    } catch (error) {
        next(error);
    }
}

module.exports.getUser = async (req, res, next) => {
    try { 
        const user=await User.findById(req.params.id).select("username email");
        if(!user)
        {
            return next(errorHandler(400,"user doesn't exist"));
        }
        res.status(200).json({user});
    } catch (error) {
        next(error);
    }
}