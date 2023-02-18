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
10. Copy the code generated and close (like this: 'mongodb+srv://youruser:<password>@cluster0.mz62zxz.mongodb.net/?retryWrites=true&w=majority');
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

1. First of all, open '.env' and include the code ```JWT_SECRET=thisisoursecret``` at the end. (Change the thisisoursecret to a token, you can use a jwt generator on google. It will help you to protect your system);
2. Create 'UserController.js' inside 'controllers' folder and type this code:
    ```javascript
        
    ```
