const User = require("../models/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET;

// Generate user token
const generateToken = (id) => {
    return jwt.sign({ id }, jwtSecret, {
        expiresIn: "7d",
    });
};

// Register user and sign in
const register = async (req, res) => {
    const { name, email, password } = req.body;

    //Check if user exists
    const user = await User.findOne({ email });

    if (user) {
        res.status(422).json({ errors: ["Please, use another email"] });
        return;
    }

    //Generate password hash
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    //Create user
    const newUser = await User.create({
        name,
        email,
        password: passwordHash
    });

    // If user was created successfully, return token
    if (!newUser) {
        res.status(422).json({ errors: ["An error has ocurred. Please try again later."] });
        return;
    }

    res.status(201).json({
        _id: newUser._id,
        token: generateToken(newUser._id),
    });
};

module.exports = {
    register,
};