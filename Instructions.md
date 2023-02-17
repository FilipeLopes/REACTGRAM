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