# REACT GRAM

##  Configs

1. Create folder 'backend' and 'frontend';
2. Access 'backend' page and open the terminal;
3. Type 'npm init -y' and run;
4. Type 'npm i bcryptjs cors dotenv express express-validator jsonwebtoken mongoose multer' and run;
5. Type 'npm i --save-dev nodemon' and run;
6. Inside backend folder create 'app.js' file;
7. Open the app.js file and type the following:
    ```javascript
        const express = require("express");
        const path = require("path");
        const cors = require("cors");

        const port = 5000;

        const app = express();

        //config JSON and form data response
        app.use(express.json());
        app.use(express.urlencoded({extended: false}));

        app.listen(port, () => {
            console.log(`App running at port ${port}` );
        });
    ```
8. Open the 'package.json' file and create a new script inside Debug > Scripts line
    ```json
        "server": "nodemon ./app.js"
    ```
9. In the terminal type 'npm run server' and run. If everything is right we will receive the success message 
10. Create other file called '.env' inside backend package and write the following code:
    ```PORT=5000```
11. Go back to 'app.js' file and type in the first line the following code:
    ```javascript
        require("dotenv").config();
    ```
12. Find the line with ```const port = 5000;``` and edit to ```const port = process.env.PORT;```
13. If everything went right you will be able to change the port number through the file .env;

## Configs API test route

1. Inside the folder 'backend' create a new folder called 'models', 'controllers' and 'routes';
2. Inside the folder 'routes' add a 'Router.js' file;
3. In 'Router.js' write the following code:
    ```javascript
        const express = require("express");
        const router = express();

        //test route
        router.get("/", (req,res) =>{
            res.send("API Working!");
        });

        module.exports = router;
    ```
    And inside 'app.js' find the code ```app.listen(port,() => {...})``` and type over above it the following code:
    ```javascript
        //routes
        const router = require("./routes/Router.js");

        app.use(router);
    ```
4. Open the app 'Postman' -> Access My Workspace -> Click in "New" -> Select "Collection" -> Rename to "ReactGram" -> Select "add a request";
5. Rename to "Test Route" -> Select GET and write in the input "http://localhost:5000/" and send;
6. If everything went right the message "API Working!" will appear;
7. Back to 'Postman' at ReactGram collection select "Variables" and add the following:
    |VARIABLE|INITIAL VALUE        |CURRENT VALUE        |
    |--------|---------------------|---------------------|
    |URL     |http://localhost:5000|http://localhost:5000|
8. Select again the 'Test Route' and change de field get to ```{{URL}}```. Click to 'Send', if the message 'API Working!' it's working;

## Importing middlewares

1. Open 'app.js' file and find te following code ```app.use(express.urlencoded({extended: false}));```. Bellow this code include de following:
    ```javascript
        // Solve CORS
        app.use(cors({credentials: true, origin: "http:localhost:3000"}));

        // Upload directory
        app.use("/uploads", express.static(path.join(__dirname,"/uploads")));

        // DB connection
        require("./config/db.js");
    ```
2. Inside 'backend' package create a 'uploads' package and inside it create the 'users' and 'photos' package;
3. Inside 'backend' create a 'config' folder and create a file called 'db.js';
4. Open the 'db.js' file and type:
    ```javascript
        const mongoose = require("mongoose");
        // Connection

    ```
## Creating connection

1. Access [mongoDB Atlas](https://www.mongodb.com/cloud/atlas/register);
2. Create an account with a free db and login;
3. Go to the 'All projects';
4. Select 'New Project' -> name as 'ReactGram' and next ->  Create project -> Click 'Create database' and select free;
5. Select the provider, then select the closest region from you and create cluster;
6. Define user and password;
7. Go down to 'Add entries to your IP Access List' (In a real system you should config the IP of the server where your system is);
8. Click 'Add my Current IP Address' then 'finish and close';
9. Select the button 'Connect' inside your database to define how you will connect -> Select 'Connect your application';
10. Copy the code generated and close (like this: 'mongodb+srv://yourUser:<password>@cluster0.mz62zxz.mongodb.net/?retryWrites=true&w=majority');
11. Open the 'db.js' file and write the following bellow '// Connection':
    ```javascript
        const dbUser = process.env.DB_USER;
        const dbPassword = process.env.DB_PASS;

        const conn = async () => {
            try {
                const dbConn = await mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.mz62zxz.mongodb.net/?retryWrites=true&w=majority`); //Past the code from step 10 and edit user and password. Use the ` symbol
                console.log("Connected on DB");
                return dbConn;
            } catch (error) {
                console.log(error);
            }
        };

        conn();

        module.exports = conn;

    ```
12. Open the '.env' file and write the following code:
    ```
        DB_USER=yourUserDB
        DB_PASS=yourPassword
    ```
13. When save the 'db.js' file the terminal will try to connect. If everything went right the message "Connected on DB" will show up;

## Preparing models

1. Inside 'models' folder create 'User.js' and type the following code:
    ```javascript
        const mongoose = require("mongoose");
        const {Schema} = mongoose;

        const userSchema = new Schema({
            name: String,
            email: String,
            password: String,
            profileImage: String,
            bio: String,
        },{
            timestamps: true
        });

        const User = mongoose.model("User", userSchema);

        module.exports = User;
    ```
2. Inside 'models' folder create 'Photo.js' file and type the following code:
    ```javascript
        const mongoose = require("mongoose");
        const {Schema} = mongoose;

        const photoSchema = new Schema({
            image: String,
            title: String,
            likes: Array,
            comments: Array,
            userId: mongoose.ObjectId,
            userName: String,
        },{
            timestamps: true
        });

        const Photo = mongoose.model("Photo", photoSchema);

        module.exports = Photo;
    ```
## Creating User Controller

1. First of all, open '.env' and include the code ```JWT_SECRET=thisIsOurSecret``` at the end. (Change the thisIsOurSecret to a token, you can use a jwt generator on google. It will help you to protect your system);
2. Create 'UserController.js' inside 'controllers' folder and type this code:
    ```javascript
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
        const register = async (req,res) => {
            res.send("Register");
        }

        module.exports = {
            register,
        }
    ```
3. Access 'routes' folder and create 'UserRoutes.js' and write the code:
    ```javascript
        const express = require("express");
        const router = express.Router();

        //Controller
        const {register} = require("../controllers/UserController");

        //Routes
        router.post("/register", register);

        module.exports = router;
    ```
4. Open 'Router.js' in 'routes' folder. Find the code ```const router = express();``` and bellow it write the following:
    ```javascript
        router.use("/api/users", require("./UserRoutes"));
    ```
5. Open the 'Postman' app and access collection > ReactGram. Right click on 'ReactGram' and create a new folder;
6. Rename to 'Users';
7. Inside 'Users' create a 'New Request';
8. Rename to 'Register an user and sign in' > Change 'GET' to 'POST' > Inside the input type '{{URL}}/api/users/register' and send;
9. If everything went right the message "Register" will show up;

## Starting validations

1. Create a folder inside 'backend' called 'middlewares'. Inside it create 'handleValidation.js' file;
2. Write the following code:
    ```javascript
        const {validationResult} = require("express-validator");

        const validate = (req, res, next) => {

            const errors = validationResult(req);

            if(errors.isEmpty()){
                return next();
            }

            const extractedErrors = [];

            errors.array().map((err) => extractedErrors.push(err.msg));

            return res.status(422).json({
                errors: extractedErrors,
            });
        };

        module.exports = validate;
    ```
3. Open 'routes > UserRoutes.js' and above ```//Routes``` type the code:
    ```javascript
        //Middlewares
        const validate = require("../middlewares/handleValidation");
        const {userCreateValidation} = require("../middlewares/userValidations");
    ```
4. In the same file find the code ```router.post("/register", register);``` and update it to: ```router.post("/register",userCreateValidation(), validate, register);```

5. In 'middlewares' create other file called 'userValidations.js' and write:
    ```javascript
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
        }

        module.exports = {
            userCreateValidation,
        }
    ```
    1. To test before send a POST in Postman go to body > select raw > define text to json > and write the code:
        ```json
            {
                "name":"Filipe",
                "email":"filipe@gmail.com"
            }
        ```
    2. Doing it you can test the errors and the success message;

## User register

1. Go back to 'controllers'>'UserController.js' and find the code 
    ```javascript
        const register = async (req, res) => {
            res.send("Register");
        };
    ```
2. Then change it to:

    ```javascript
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
    ```
3. Access Postman and send a POST filling every variable required, if everything went right we will receive a json with id and token;

## Validation and login

1. Access 'middlewares' > 'userValidations.js' and above the code ```module.exports ={``` write the following:
    ```javascript
        const loginValidation = () => {
            return [
                body("email").isString().withMessage("The email is required.").isEmail().withMessage("Insert a valid email."),
                body("password").isString().withMessage("The password is required"),
            ]
        }; 
    ```
2. And inside the code ```module.exports ={...}``` include:
    
    ```javascript
        module.exports = {
            userCreateValidation,
            loginValidation,
        };
    ```
3. Access 'controllers' > 'UserController.js' and include above ```module.exports ={``` the code:
    ```javascript
        //Sign user in
        const login = (req,res) => {
            res.send("login");
        };
    ```
4. And inside ```module.exports = {``` update to:
    ```javascript
        module.exports = {
            register,
            login,
        };
    ```
5. Access 'routes' > 'UserRouter.js' find the code ```const {register} = require("../controllers/UserController");``` and update to:
    ```javascript
        const {register, login} = require("../controllers/UserController");
    ```
6. In 'UserRouter.js' find the code ```const {userCreateValidation} = require("../middlewares/userValidations");```and update to:
    ```javascript
        const {userCreateValidation, loginValidation} = require("../middlewares/userValidations");
    ```
7. Bellow the code ```router.post("/register",userCreateValidation(), validate, register);```type this code:
    ```javascript
        router.post("/login",loginValidation(), validate, login);
    ```
8. Open 'Postman' and create a new request in the folder 'ReactGram'>'Users';
9. Rename to 'Sign user in'. Change from GET to POST and include in the input '{{URL}}/api/users/login';
10. If everything is right. On click in SEND we will receive the created message errors;
11. You can change the values in the body to try to see the every error message;

## User login

1. Go to 'controller' > 'UserController.js' and find ```const login = (req,res) =>{...}``` and update to:
    ```javascript
        const login = async (req,res) => {
            const {email, password} = req.body;

            const user = await User.findOne({email});

            //Check if user exists
            if(!user){
                res.status(404).json({errors: ["User not found."]});
                return;
            };

            //Check if password matches
            if(!(await bcrypt.compare(password, user.password))){
                res.status(422).json({errors: ["Invalid password."]});
                return;
            };

            //Return user with token
            res.status(201).json({
                _id: user._id,
                profileImage: user.profileImage,
                token: generateToken(user._id),
            });
        };
    ```
2. Try to login with Postman, if everything went right we will receive an id and token;

## Auth validation

1. Inside 'middlewares' create 'authGuard.js' and type this code:
    ```javascript
        const User = require("../models/User");
        const jwt = require("jsonwebtoken");
        const jwtSecret = process.env.JWT_SECRET;

        const authGuard = async (req, res, next) => {
            const authHeader = req.headers["authorization"];
            const token = authHeader && authHeader.split(" ")[1];

            //Check if header has a token
            if (!token) return res.status(401).json({ errors: ["Denied access!"] });

            //Check if token is valid
            try {
                const verified = jwt.verify(token, jwtSecret);
                req.user = await User.findById(verified.id).select("-password");

                next();
            } catch (error) {
                res.status(401).json({ errors: ["Invalid token."] });
            };
        };

        module.exports = authGuard;
    ```
2. Access 'controllers' > 'UserController.js' and find ```module.exports = {...}```. Above this, write the following:
    ```javascript
        //Get current logged in user
        const getCurrentUser = async(req,res) =>{
            const user = req.user;

            res.status(200).json(user);
        };
    ```
3. And inside ```module.exports = {}``` update to:
    ```javascript
        module.exports = {
            register,
            login,
            getCurrentUser,
        };
    ```
4. Go to 'routes' > 'UserRoutes.js' find the tag //Routes and include the code:
    ```javascript
        router.get("/profile", authGuard, getCurrentUser);
    ```
5. In the same 'UserRoutes.js' find the tag //Middlewares and include the code:
    ```javascript
        const authGuard = require("../middlewares/authGuard");
    ```
6. Access Postman 'ReactGram' > 'User' and create a new Request;
7. Rename to 'Get current user' > define as GET and include in the input '{{URL}}/api/users/profile;
8. Wen send, the message will be "Denied access';
9. Click in 'ReactGram' > Authorization and change type from 'No Auth' to 'Bearer Token'. Other input called 'Token' will appear and type something like 'asd' and save (ctrl + s);
10. Back to 'Get current user' and try to send again. The message will be "Invalid token";
11. Go to Postman access 'ReactGram' > Users > open "Sign user in" and send with a valid body. Take the token that will show up and go to 'ReactGram' authorization and change the input token with the copied token;
12. In 'Get current user' try to send again and the message should show you the user values;

## Image upload middleware

1. Inside 'middlewares' create 'imageUpload.js' file;
2. Type the code:
    ```javascript
        const multer = require("multer");
        const path = require("path");

        // Destination to store image
        const imageStorage = multer.diskStorage({
            destination: function(req,file, cb){
                let folder = "";

                if(req.baseUrl.includes("users")){
                    folder = "users";
                } else if(req.baseUrl.includes("photos")){
                    folder = "photos";
                };

                cb(null, `uploads/${folder}/`);
            },
            filename: (req, file, cb) => {
                cb(null, Date.now()+path.extname(file.originalname));
            }
        });

        const imageUpload = multer ({
            storage: imageStorage,
            fileFilter(req, file, cb){
                if(!file.originalname.match(/\.(png|jpg)$/)){
                    //upload only png and jpg formats
                    return cb(new Error("Please, upload only png or jpg files."));
                };

                cb(undefined,true);
            }
        })

        module.exports = {imageUpload};
    ```
## Update user middleware

1. Access 'middlewares' > 'userValidations.js' and find the code ```module.exports = {}``` and above this write the following code:
    ```javascript
        const userUpdateValidation = () => {
            return[
                body("name").optional().isLength({min:3}).withMessage("The name needs at least 3 characters."),
                body("password").optional().isLength({min:5}).withMessage("The password needs at least 5 characters"),
            ];
        };
    ```
2. And inside the ```module.exports``` update to:
    ```javascript
        module.exports = {
            userCreateValidation,
            loginValidation,
            userUpdateValidation,
        };
    ```
3. Go to 'routes' > 'UserRoutes.js' , find the tag '//Routes' and include the route:
    ```javascript
        router.put("/", authGuard, userUpdateValidation(), validate, imageUpload.single("profileImage"), update); 
    ```
   1. Inside 'UserRoutes.js' find the tag '//Middlewares' and include ```const {imageUpload} = require("../middlewares/imageUpload");```
   2. Still in 'UserRoutes.js' find ```const {userCreateValidation, loginValidation} = require("../middlewares/userValidations");``` and update to ```const {userCreateValidation, loginValidation, userUpdateValidation} = require("../middlewares/userValidations");```
   3. Now find the tag '//Controller' and update this code ```const {register, login, getCurrentUser} = require("../controllers/UserController");``` to ```const {register, login, getCurrentUser, update} = require("../controllers/UserController");```;

4. Go to 'controllers' > 'UserController.js' and above the code ```module.exports ={}``` include:
    ```javascript
        // Update a user
        const update = async (req,res)=>{
            res.send("Update");
        };
    ```
5. And inside ```module.exports={}``` update to:
    ```javascript
        module.exports = {
            register,
            login,
            getCurrentUser,
            update,
        };
    ```
6. Open Postman and create a new request inside 'ReactGram' > 'Users';
7. Call it 'Update an user' > change GET to PUT > type inside input '{{URL}}/api/users/ and click send;
8. If everything went right the message 'Update' will appear;

## Updating user

1. Go to 'controllers' > 'UserController.js' and find the function ```const update = async (req,res) =>{}```. Clean inside the brace {} and update to:
    ```javascript
        const {name, password, bio} = req.body;

        let profileImage = null;
        
        if(req.file){
            profileImage = req.file.filename;
        }

        const reqUser = req.user;

        const user = await User.findById(mongoose.Types.ObjectId(reqUser._id)).select("-password");

        if(name){
            user.name = name;
        }

        if(password){
            //Generate password hash
            const salt = await bcrypt.genSalt();
            const passwordHash = await bcrypt.hash(password, salt);

            user.password = passwordHash;
        };
        
        if(profileImage){
            user.profileImage=profileImage;
        };

        if(bio){
            user.bio = bio;
        }
        
        await user.save();

        res.status(200).json(user);
    ```
2. Inside 'UserController.js' find the code ```const jwt = require("jsonwebtoken");``` and bellow this code write:
    ```const mongoose = require("mongoose");```
3. Open Postman > User > select the request 'Update an user' > go to Body > select 'form-data' and in te table type:
    |KEY| VALUE|
    |---|------|
    |name|typeAnyNameHere|
    |bio|typeAnyBioHere|
    |profileImage(change the 'input' to 'file')|selectFileHere|
4. Click to 'Send'. The user will be shown up, if everything went right the name, bio will be changed and you will can find the image in 'uploads' > 'users';

## Getting user by ID

1. Open 'controllers' > 'UserController.js' and above ```module.exports ={}``` include the following code:
    ```javascript
        //Get user by id
        const getUserById = async (req,res) => {
            const {id} = req.params;

            try {
                const user = await User.findById(mongoose.Types.ObjectId(id)).select("-password");

                //Check if user exists
                if (!user) {
                    res.status(404).json({ errors: ["User not found."] });
                };

                res.status(200).json(user);
                
            } catch (error) {
                res.status(422).json({ errors: ["User not found."] });
            };
        };
    ```
2. And inside ```module.exports={}``` update to:
    ```javascript
        module.exports = {
            register,
            login,
            getCurrentUser,
            update,
            getUserById,
        };
    ```
3. Go to 'routes' > 'UserRoutes.js' find the tag '//Routes' and include:
    ```javascript
        router.get("/:id", getUserById);
    ```
    1. Now find the tag '//Controller' and update the code ```const {register, login, getCurrentUser, update} = require("../controllers/UserController");``` to: 
        ```javascript
            const {register, login, getCurrentUser, update, getUserById} = require("../controllers/UserController");
        ```
4. Create a new request in 'Postman' > 'ReactGram' > 'Users' a call it as 'Get user by id' > In the input type '{{URL}}/api/users/idHere';
5. Using a wrong id the error message must show up;
6. We can take the id from 'Update an user' and use in the input to test. If everything went right the user will be printed;

## Initial config to photos routes

1. In the package 'controllers' create the file 'PhotoController.js';
2. Inside 'routes' package create the file 'PhotoRoutes.js'
3. Open 'PhotoRoutes.js' file and write:
    ```javascript
        const express = require("express");
        const router = express.Router();

        //Controller

        //Middlewares

        //Routes

        module.exports = router;
    ```
4. Go to 'middlewares' and create the 'PhotoValidation.js' file and write the following code:
    ```javascript
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
    ```
5. Go to 'routes > 'PhotoRoutes.js' and write inside the tag '//Middlewares':
    ```javascript
        const {photoInsertValidation} = require("../middlewares/PhotoValidation");   
        const authGuard = require("../middlewares/authGuard");
        const validate = require("../middlewares/handleValidation");
    ```
6. Access 'controllers' > 'PhotoController.js' and type:
    ```javascript
        const Photo = require("../models/Photo");

        const mongoose = require("mongoose");

        //Insert a photo, with an user related to it
        const insertPhoto = async(req,res) => {
            const {title} = req.body;
            const image = req.file.filename;

            console.log(req.body);

            res.send("Photo insert");
        };

        module.exports = {
            insertPhoto,
        };
    ```
7. Access 'routes' > 'PhotoRoutes.js' find the tag '//Controller' and insert:
    ```javascript
        const {insertPhoto} = require("../controllers/PhotoController");
    ```
    1. Inside 'PhotoRoutes.js' find the tag '//Routes' and include:
        ```javascript
            router.post("/", authGuard, imageUpload.single("image"), photoInsertValidation(), validate, insertPhoto); 
        ```
    2. Also inside 'PhotoRoutes.js' find the tag '//Middlewares and include:
        ```javascript
            const {imageUpload} = require("../middlewares/imageUpload");
        ```
8. Access 'routes' > 'Router.js' and find the code ```router.use("/api/users", require("./UserRoutes"));``` and include bellow:
    ```javascript
        router.use("/api/photos", require("./PhotoRoutes"));
    ```
9. Open Postman > 'ReactGram' > Create a new folder in 'ReactGram' and call it as 'Photos';
10. In 'Photos' create a new request > name as 'Insert a photo' > Define as POST > In the input write '{{URL}}/api/photos/';
11. The custom error messages must show up;
12. Go to 'PhotoController.js' inside 'controllers' and find the function ```const insertPhoto = async...```, update this function to:
    ```javascript
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
                return;
            };

            res.status(201).json(newPhoto);
        };
    ```
    1. Inside 'PhotoController.js' find the code ```const Photo = require("../models/Photo");``` and write bellow it the following:
        ```javascript
            const User = require("../models/User");
        ```
13. Go back to Postman > 'Insert a photo' > go to Body > form-data and insert:
    |KEY| VALUE|
    |---|------|
    |title|typeAnyImageNameHere|
    |image(change the 'input' to 'file')|selectFileHere|
14. Click to Send. If everything went right the message with data from this photo will shown up and you can find the photo in 'uploads'>'photos';

## Deleting photos

1. Into 'controllers' > 'PhotoController.js' above the code ```module.exports ={}``` write the following:
    ```javascript
        //Remove a photo from DB
        const deletePhoto = async (req, res) => {
            const { id } = req.params;
            const reqUser = req.user;

            try {
                const photo = await Photo.findById(mongoose.Types.ObjectId(id));

                //Check if photo exists
                if (!photo) {
                    res.status(404).json({ errors: ["Photo not found!"] });
                    return;
                };

                //Check if photo belongs to user
                if (!photo.userId.equals(reqUser._id)) {
                    res.status(422).json({ errors: ["There was a problem. Please try again later."] });
                    return;
                };

                await Photo.findByIdAndDelete(photo._id);

                res.status(200).json({ id: photo._id, message: "The photo has been deleted." });
            } catch (error) {
                res.status(404).json({ errors: ["Photo not found!"] });
                return;
            }

        };
    ```
    1. And inside this code ```module.exports ={}``` update like this:
        ```javascript
            module.exports = {
                insertPhoto,
                deletePhoto,
            };
        ```
2. Access 'routes' > 'PhotoRouter.js' find the tag '//Routes' and include another route following this code:
    ```javascript
        router.delete("/:id", authGuard, deletePhoto);
    ```
    1. In 'PhotoRouter.js' find the code ```const {insertPhoto} = require("../controllers/PhotoController");``` and update to:
        ```javascript
            const {insertPhoto, deletePhoto} = require("../controllers/PhotoController");
        ```
3. In Postman > 'ReactGram' > Photos > create a new request and name as 'Delete a photo' > Change from GET to DELETE > In the input type '{{URL}}/api/photos/typeOneId';
4. Insert one photo and take it's id. Paste it in the step 3 and if everything went right, the success message will appear;

## Getting all photos

1. Inside the 'controllers' > 'PhotoController.js' above the code ```module.exports ={}``` write the following:
    ```javascript
        // Get all photos
        const getAllPhotos = async (req,res)=> {
            const photos = await Photo.find({}).sort([["createdAt",-1]]).exec();

            return res.status(200).json(photos);
        };
    ```
    1. And inside this code ```module.exports ={}``` update like this:
        ```javascript
            module.exports = {
                insertPhoto,
                deletePhoto,
                getAllPhotos,
            };
        ```
2. Go to 'routes' > 'PhotoRoutes.js' and find the tag '//Routes' and include other route:
    ```javascript
        router.get("/", authGuard, getAllPhotos);
    ```
    1. In 'PhotoRouter.js' find the code ```const {insertPhoto, deletePhoto} = require("../controllers/PhotoController");``` and update to:
        ```javascript
            const {insertPhoto, deletePhoto, getAllPhotos} = require("../controllers/PhotoController");
        ```
3. In Postman > 'ReactGram' > Photos > create a new request and name as 'Get all photos' > In the input type '{{URL}}/api/photos/';
4. If everything went right you will receive a message with all photos;

## Getting all photos from an specific user

1. Inside the 'controllers' > 'PhotoController.js' above the code ```module.exports ={}``` write the following:
    ```javascript
        // Get user photos
        const getUserPhotos = async (req, res) => {
            const {id} = req.params;

            const photos = Photo.find({userId: id}).sort([['createdAt', -1]]).exec();

            return res.status(200).json(photos);

        };
    ```
    1. And inside this code ```module.exports ={}``` update like this:
        ```javascript
            module.exports = {
                insertPhoto,
                deletePhoto,
                getAllPhotos,
                getUserPhotos,
            };
        ```
2. Go to 'routes' > 'PhotoRoutes.js' and find the tag '//Routes' and include other route:
    ```javascript
        router.get("/user/:id", authGuard, getUserPhotos);
    ```
    1. In 'PhotoRouter.js' find the code ```const {insertPhoto, deletePhoto, getAllPhotos} = require("../controllers/PhotoController");``` and update to:
        ```javascript
            const {insertPhoto, deletePhoto, getAllPhotos, getUserPhotos} = require("../controllers/PhotoController");
        ```
3. In Postman > 'ReactGram' > Photos > create a new request and name as 'Get user photos' > In the input type '{{URL}}/api/photos/user/typeUserId';

4. If everything went right you will receive a message with all user photos;

## Getting photo by id

1. Inside the 'controllers' > 'PhotoController.js' above the code ```module.exports ={}``` write the following:
    ```javascript
        //Get photo by id
        const getPhotoById = async (req,res) => {
            const {id} = req.params;
            const photo = await Photo.findById(mongoose.Types.ObjectId(id));

            //check if photo exists
            if(!photo){
                res.status(404).json({errors: ["Photo not found."]});
                return;
            };

            res.status(200).json(photo);
        };
    ```
    1. And inside this code ```module.exports ={}``` update like this:
        ```javascript
            module.exports = {
                insertPhoto,
                deletePhoto,
                getAllPhotos,
                getUserPhotos,
                getPhotoById,
            };
        ```
2. Go to 'routes' > 'PhotoRoutes.js' and find the tag '//Routes' and include other route:
    ```javascript
        router.get("/:id", authGuard, getPhotoById);
    ```
    1. In 'PhotoRouter.js' find the code ```const {insertPhoto, deletePhoto, getAllPhotos, getUserPhotos} = require("../controllers/PhotoController");``` and update to:
        ```javascript
            const {insertPhoto, deletePhoto, getAllPhotos, getUserPhotos, getPhotoById} = require("../controllers/PhotoController");
        ```
3. In Postman > 'ReactGram' > Photos > create a new request and name as 'Get photo by id' > In the input type '{{URL}}/api/photos/typePhotoId';

## Updating photo

1. Inside the 'controllers' > 'PhotoController.js' above the code ```module.exports ={}``` write the following:
    ```javascript
        //Update a photo
        const updatePhoto = async (req, res) => {
            const { id } = req.params;
            const { title } = req.body;

            const reqUser = req.user;

            const photo = await Photo.findById(id);

            //Check if photo exists
            if (!photo) {
                res.status(404).json({ errors: ["Photo not found"] });
                return;
            };

            //Check if photo belongs to user
            if (!photo.userId.equals(reqUser._id)) {
                res.status(422).json({ errors: ["There was a problem. Please try again later."] });
                return;
            };

            if (title) {
                photo.title = title;
            };

            await photo.save();

            res.status(200).json({ photo, message: "Photo successfully updated." });
        };
    ```
    1. And inside this code ```module.exports ={}``` update like this:
        ```javascript
            module.exports = {
                insertPhoto,
                deletePhoto,
                getAllPhotos,
                getUserPhotos,
                getPhotoById,
                updatePhoto,
            };
        ```
2. Go to 'routes' > 'PhotoRoutes.js' and find the tag '//Routes' and include other route:
    ```javascript
        router.put("/:id", authGuard, updatePhoto);
    ```
    1. In 'PhotoRouter.js' find the code ```const {insertPhoto, deletePhoto, getAllPhotos, getUserPhotos, getPhotoById} = require("../controllers/PhotoController");``` and update to:
        ```javascript
            const {insertPhoto, deletePhoto, getAllPhotos, getUserPhotos, getPhotoById, updatePhoto} = require("../controllers/PhotoController");
        ```
3. Go to 'middlewares' > 'PhotoValidation.js' and above the code ```module.exports ={}``` write the following:
    ```javascript
        const photoUpdateValidation = () => {
            return[
                body("title").optional().isString().withMessage("Title is required.").isLength({min:3}).withMessage("Title needs at least 3 characters."),
            ];
        };
    ```
    1. And inside this code ```module.exports ={}``` update like this:
        ```javascript
            module.exports = {
                photoInsertValidation,
                photoUpdateValidation,
            };
        ```
4. Back to 'routes' > 'PhotoRoutes.js' and update the code ```router.put("/:id", authGuard, updatePhoto);``` to:
    ```javascript
        router.put("/:id", authGuard, photoUpdateValidation(), validate, updatePhoto);
    ```
    1. Na tag '//Middlewares update the code ```const {photoInsertValidation} = require("../middlewares/PhotoValidation");``` to:
        ```javascript
            const {photoInsertValidation, photoUpdateValidation} = require("../middlewares/PhotoValidation"); 
        ```
5. Open Postman > 'ReactGram' > 'Photos' and create a new request called 'Update a photo' > change from GET to PUT > and include the url   '{{URL}}/api/photos/idOfSomePhoto' > Open body > define to raw > select json > and write the new title and click send. If everything went right we will see the photo with a new title;

## Like photo functionalities

1. Inside the 'controllers' > 'PhotoController.js' above the code ```module.exports ={}``` write the following:
    ```javascript
        // Like functionality
        const likePhoto = async (req,res)=>{
            const {id} = req.params;
            
            const reqUser = req.user;

            const photo = await Photo.findById(id);

            //Check if photo exists
            if (!photo) {
                res.status(404).json({ errors: ["Photo not found"] });
                return;
            };

            //Check if user already liked the photo
            if(photo.likes.includes(reqUser._id)){
                res.status(422).json({errors: ["You already liked this photo."]});
                return;
            };

            //Put user id in likes array
            photo.likes.push(reqUser._id);

            photo.save();

            res.status(200).json({photoId: id, userId: reqUser._id, message: "the photo has been successfully liked."});

        };
    ```
    1. And inside this code ```module.exports ={}``` update like this:
        ```javascript
            module.exports = {
                insertPhoto,
                deletePhoto,
                getAllPhotos,
                getUserPhotos,
                getPhotoById,
                updatePhoto,
                likePhoto,
            };
        ```
2. Go to 'routes' > 'PhotoRoutes.js' and find the tag '//Routes' and include other route:
    ```javascript
        router.put("/like/:id", authGuard, likePhoto);
    ```
    1. In 'PhotoRouter.js' find the code ```const {insertPhoto, deletePhoto, getAllPhotos, getUserPhotos, getPhotoById, updatePhoto} = require("../controllers/PhotoController");``` and update to:
        ```javascript
            const {insertPhoto, deletePhoto, getAllPhotos, getUserPhotos, getPhotoById, updatePhoto, likePhoto} = require("../controllers/PhotoController");
        ```
3. Open Postman > 'ReactGram' > 'Photos' and create a new request called 'Like a photo' > change from GET to PUT > and include the url   '{{URL}}/api/photos/like/idOfSomePhoto';
4. If everything went right we will see the photo info with a like included;

## Photos comments

1. Inside the 'controllers' > 'PhotoController.js' above the code ```module.exports ={}``` write the following:
    ```javascript
        // Comments functionality
        const commentPhoto = async (req, res) => {
            const {id} = req.params;
            const {comment} = req.body;

            const reqUser = req.user;
            
            const user = await User.findById(reqUser._id);

            const photo = await Photo.findById(id);

            //Check if photo exists
            if (!photo) {
                res.status(404).json({ errors: ["Photo not found"] });
                return;
            };

            //put comment in the array comments
            const userComment ={
                comment,
                userName: user.name,
                userImage: user.profileImage,
                userId: user._id
            }; 

            photo.comments.push(userComment);
            await photo.save();

            res.status(200).json({
                comment: userComment,
                message: "The comment was successfully included.",
            });

        };
    ```
    1. And inside this code ```module.exports ={}``` update like this:
        ```javascript
            module.exports = {
                insertPhoto,
                deletePhoto,
                getAllPhotos,
                getUserPhotos,
                getPhotoById,
                updatePhoto,
                likePhoto,
                commentPhoto,
            };
        ```
2. Go to 'routes' > 'PhotoRoutes.js' and find the tag '//Routes' and include other route:
    ```javascript
        router.put("/comment/:id", authGuard, commentValidation(), validate, commentPhoto);
    ```
    1. In 'PhotoRouter.js' find the code ```const {insertPhoto, deletePhoto, getAllPhotos, getUserPhotos, getPhotoById, updatePhoto, likePhoto} = require("../controllers/PhotoController");``` and update to:
        ```javascript
            const {insertPhoto, deletePhoto, getAllPhotos, getUserPhotos, getPhotoById, updatePhoto, likePhoto, commentPhoto} = require("../controllers/PhotoController");
        ```
3. Access 'middlewares' > 'PhotoValidation.js' and above the code ```module.exports ={}``` write the following:
    ```javascript
        const commentValidation = () => {
            return [
                body("comment").isString().withMessage("The comment is required."),
            ];
        };
    ```
4. In 'PhotoRouter.js' find ```const {photoInsertValidation, photoUpdateValidation} = require("../middlewares/PhotoValidation");``` and update to:       
    ```javascript
        const {photoInsertValidation, photoUpdateValidation, commentValidation} = require("../middlewares/PhotoValidation"); 
    ```
5. Open Postman > 'ReactGram' > 'Photos' and create a new request called 'Comment a photo' > change from GET to PUT > and include the url   '{{URL}}/api/photos/comment/idOfSomePhoto' > Open body > define to raw > select json > and write the comment and click send. If everything went right we will see the photo data with comments;

## Searching photos functionalities