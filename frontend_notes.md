# REACT GRAM - Frontend notes

Some notations to remember me the process to create this project.

## React install and config

1. In a terminal type: ```npx create-react-app frontend``` to install react in a folder 'frontend';
2. type: ```cd frontend``` to access the folder were we installed React;
3. To install some packages that we will use type:
    ```
        npm i react-icons react-router-dom @reduxjs/toolkit react-redux
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
## Implementing redux

1. Access 'src' > 'index.js';
2. In 'src' create a file called 'store.js' and type the code:
    ```javascript
        import {configureStore} from '@reduxjs/toolkit';

        export const store = configureStore({
            reducer: {},
        });
    ```
3. Find the code ```import App from "./App";``` and bellow it right the following code:
    ```javascript
        //Redux
        import {Provider} from 'react-redux';
        import {store} from './store';
    ```
    1. Now find the code ```<App />``` and update it to:
        ```javascript
            <Provider store={store}>
                <App />
            </Provider>
        ```    
4. In 'src' create the folders 'services', 'slices' and 'utils';
5. Inside 'utils' create 'config.js' file and type:
    ```javascript
        export const api = "http://localhost:5000/api";
        export const upload = "http://localhost:5000/uploads";

        export const requestConfig = (method, data, token = null, image = null) => {

            let config;

            if (image) {
                config = {
                    method,
                    body: data,
                    headers: {},
                }
            } else if (method === "DELETE" || data === null) {
                config = {
                    method,
                    headers: {},
                }
            } else {
                config = {
                    method,
                    body: JSON.stringify(data),
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            };

            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            };
            return config;
        };
    ```
6. Open the 'services' folder and create 'authService.js' and write the code:
    ```javascript
        import { api, requestConfig } from '../utils/config';

        // Register an user
        const register = async (data) => {
            const config = requestConfig("POST", data);
            try {
                const res = await fetch(api + "/users/register", config)
                    .then((res) => res.json())
                    .catch((err) => err);

                if(res){
                    localStorage.setItem("user", JSON.stringify(res));
                }

                return res;
            } catch (error) {
                console.log(error);
            }
        };

        const authService ={
            register,
        };

        export default authService;
    ```
7. Open the folder 'slices' and crete 'authSlice.js' and type:
    ```javascript
        import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
            import authService from "../services/authService";

            const user = JSON.parse(localStorage.getItem("user"));

            const initialState = {
                user: user ? user : null,
                error: false,
                success: false,
                loading: false,
            };

            // Register a user and sign in
            export const register = createAsyncThunk(
                "auth/register",
                async (user, thunkAPI) => {
                    const data = await authService.register(user);

                    // Check for errors
                    if (data.errors) {
                        return thunkAPI.rejectWithValue(data.errors[0]);
                    }

                    return data;
                }
            );

            // Logout a user
            export const logout = createAsyncThunk("auth/logout", async () => {
                await authService.logout();
            });

            // Sing in a user
            export const login = createAsyncThunk("auth/login", async (user, thunkAPI) => {
                const data = await authService.login(user);

                // Check for errors
                if (data.errors) {
                    return thunkAPI.rejectWithValue(data.errors[0]);
                }

                return data;
            });

            export const authSlice = createSlice({
                name: "auth",
                initialState,
                reducers: {
                    reset: (state) => {
                        state.loading = false;
                        state.error = false;
                        state.success = false;
                    },
                },
                extraReducers: (builder) => {
                    builder
                        .addCase(register.pending, (state) => {
                            state.loading = true;
                            state.error = null;
                        })
                        .addCase(register.fulfilled, (state, action) => {
                            state.loading = false;
                            state.success = true;
                            state.error = null;
                            state.user = action.payload;
                        })
                        .addCase(register.rejected, (state, action) => {
                            state.loading = false;
                            state.error = action.payload;
                            state.user = null;
                        });
                },
            });

            export const { reset } = authSlice.actions;
            export default authSlice.reducer;

    ```
8. Now open the file 'store.js' and right above the code ```export const store = configureStore({...})``` type the following:
    ```javascript
        import authReducer from "./slices/authSlice";    
    ```
    1. inside the export code find the code ```reducer: {...}```and inside of it include ```auth: authReducer,``` 

9. Go back to 'Register.js'  and bellow the tag ```// Hooks``` create another tag called ```// Redux``` and type:
    ```javascript
        import { register, reset } from "../../slices/authSlice";
    ```
    1. Inside the tag ```// Hooks``` include the following to:
        ```javascript
            import { useSelector, useDispatch } from "react-redux";
        ```
    2. Still inside 'Register.js' find the states and right bellow it type the following:
        ```javascript
            const dispatch = useDispatch();

            const {loading, error} = useSelector((state) => state.auth);
        ```
    3. Inside 'Register.js' find the function 'handleSubmit' and inside of it include at the end the following code:
        ```javascript
            dispatch(register(user));
        ```
    4. And bellow the 'handleSubmit' function create an useEffect :
        ```javascript
            // Clean all auth states
            useEffect(()=>{
                dispatch(reset());
            },[dispatch]);
        ```
10. At this point you can open the project and try to register. In console/network you must see a response with the user token;



