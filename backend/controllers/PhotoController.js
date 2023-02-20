const Photo = require("../models/Photo");
const User = require("../models/User");

const mongoose = require("mongoose");

//Insert a photo, with an user related to it
const insertPhoto = async(req,res) => {
    const {title} = req.body;
    const image = req.file.filename;

    const reqUser = req.user;

    const user = await User.findById(reqUser._id);

    //Create a photo
    const newPhoto = await Photo.create({
        image,
        title,
        userId: user._id,
        userName: user.name,
    });

    // If photo was create successfully, return data
    if(!newPhoto){
        res.status(422).json({
            errors: ["There was a problem. Please try again latter."],
        });
    };

    res.status(201).json(newPhoto);
};

module.exports = {
    insertPhoto,
};