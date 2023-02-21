# REACT GRAM - Frontend notes

Some notations to remember me the process to create this project.

## React install and config

1. In a terminal type: ```npx create-react-app frontend``` to install react in a folder 'frontend';
2. type: ```cd frontend``` to access the folder were we installed React;
3. To install some packages that we will use type:
    ```
        npm i react-icons react-router-dom @reduxjs/toolkit
    ```
4. Clean all css file and App.js div;
5. Go to 'src' > 'index.js' and remove ```reportWebVitals();``` and the comments above it;
    1. Also remove its import like ```import reportWebVitals from './reportWebVitals';```. They won't be necessary;


## Font-family

1. Access google > search 'google fonts' > open first link > search 'Roboto' and select it > Select all fonts and copy the link;
2. Back to 'frontend' > 'public' > open 'index.html' > find the tag <title>ReactGram</title> and paste bellow it;
3. In 'src' > 'index.css' define the initial global styles as:
    ```css
        body {
            font-family: "Roboto", sans-serif;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            background-color: #121212;
            color: #fafafa;
        }
    ```
