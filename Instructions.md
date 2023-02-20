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
Then change it to:

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
2. Access Postman and send a POST filling every variable required, if everything went right we will receive a json with id and token;

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
And inside the code ```module.exports ={...}``` include:
    
    ```javascript
        module.exports = {
            userCreateValidation,
            loginValidation,
        };
    ```