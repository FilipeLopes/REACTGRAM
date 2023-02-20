const {body} = require("express-validator");

const userCreateValidation = () => {
    return [
        body("name").isString().withMessage("The name is required.").isLength({min: 3}).withMessage("The name requires at least 3 characters."),
        body("email").isString().withMessage("The email is required").isEmail().withMessage("Insert a valid email."),
        body("password").isString().withMessage("The password is required").isLength({min: 5}).withMessage("The password requires at least 5 characters."),
        body("confirmpassword").isString().withMessage("The confirmation password is required").custom((value,{req})=>{
            if(value != req.body.password){
                throw new Error("The passwords are not the same.");
            }
            return true;
        }),
    ];
};

const loginValidation = () => {
    return [
        body("email").isString().withMessage("The email is required.").isEmail().withMessage("Insert a valid email."),
        body("password").isString().withMessage("The password is required"),
    ];
};

const userUpdateValidation = () => {
    return[
        body("name").optional().isLength({min:3}).withMessage("The name needs at least 3 characters."),
        body("password").optional().isLength({min:5}).withMessage("The password needs at least 5 characters"),
    ];
};

module.exports = {
    userCreateValidation,
    loginValidation,
    userUpdateValidation,
};