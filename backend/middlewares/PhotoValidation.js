const {body} = require("express-validator");

const photoInsertValidation = () => {
    return[
        body("title").not().equals("undefined").withMessage("Title is required.").isString().withMessage("Title is required.").isLength({min:3}).withMessage("Title requires at least 3 characters"),
        body("image").custom((value, {req}) => {
            if(!req.file){
                throw new Error("The image is required.");
            };
            return true;
        }),
    ];
};

module.exports = {
    photoInsertValidation,
};