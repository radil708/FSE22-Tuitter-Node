import {Express, Request, Response} from "express";
import UserDao from "./Users/UserDao";
import debugHelper from "./debugHelper";
const bcrypt = require('bcrypt');
const saltRounds = 10;


export default class AuthenticationController {
    app: Express;
    private userDao: UserDao = UserDao.getInstance()

    public constructor(appIn: Express) {
        this.app = appIn;
        //this.userDao = UserDao.getInstance()
        this.app.post('/api/auth/signup', this.signUp)
        this.app.post('/api/auth/profile', this.profile)
        this.app.post('/api/auth/logout', this.logout)
        this.app.post('/api/auth/login', this.login)
    }

    async login(req: Request, res: Response) {

        //set to true to see debug statements
        let printDebug;
        //printDebug = true;
        let sendError = false;
        let error;

        const uDao = UserDao.getInstance()
        const user = req.body;
        const username = user.username;
        const password = user.password;

        // if properties not available send error message
        if (username == null || password == null) {
            sendError = true;
            error = {"Error":"Missing username or password property"}
        }
        //set up some variables
        let doesUserAlreadyExist
        let existingUser
        let match
        //
        // no error so fat
        if (sendError == false) {

            //see if username already taken
            doesUserAlreadyExist = await uDao.userNameAlreadyTaken(username)

            //if user does not exist send error
            if (doesUserAlreadyExist == false) {
                sendError = true
                error = {"Error" : "user with username " + username + " does not exist"}
            }
            // if user does exist
            else {
                //find user entry in database
                existingUser = await uDao.findUserbyUserName(username)
                // compare encrypted passwords
                match = await bcrypt.compare(password, existingUser.getPassword())

                //found profile with matching password
                if (match == true) {
                    existingUser.setPassword("*******")
                    req.session['profile'] = existingUser;
                }
            }

        }


        if (sendError == true) {
            res.sendStatus(403)
        }
        else if (match == true && existingUser != null) {
            res.json(existingUser)
        }
        else {
            throw EvalError("Something went wrong line 80 auth-controller")
        }

        if (printDebug == true) {
            console.log("Request Body -> ", req.body)
            console.log("Send status of response = ", res.statusCode)
            console.log("Status message of response -> ", res.statusMessage)
            let resp;
            if (sendError) {
                resp = error
            }
            else {
                resp = existingUser
            }
            console.log("Response sent -> ", resp)
            console.log("Session info -> ", req.session)
            debugHelper.printEnd('login', 'AuthenticationController')
        }



    }

    profile(req: Request, res: Response) {
        const profile = req.session['profile']
        if (profile != undefined) {
            profile.password = "";
            res.json(profile);
            return
        }
        else {
            res.sendStatus(403);
        }

    }

    async logout(req: Request, res: Response) {

        let printDebug;
        printDebug = true

        req.session.destroy(function(err) {
            console.log("Destroyed session/called logout method") // TODO this method needed a function not sure why, ask
        })
        res.sendStatus(200)

        if (printDebug == true) {
            console.log("Session info after callinng desroy -> ", req.session)
            debugHelper.printEnd('logout', 'AuthenticationController')
        }
    }

    async signUp(req: Request, res: Response) {

        let printDebug;
        //printDebug = true; // uncomment this line to see debug statements

        const uDao = UserDao.getInstance()
        // username and password must be in request body
        let wholeRequest = req.body
        const usernameReg = req.body.username
        const passwordReg = req.body.password

        let sendError = false;
        let error;

        // if properties not available send error message
        if (usernameReg == null || passwordReg == null) {
            error = {"Error":"Missing username or password property"}
            sendError = true
        }

        let hash;
        if (sendError == false) {
            hash = await bcrypt.hash(passwordReg, saltRounds)
            wholeRequest.password = hash

            //see if username already taken
            const doesUserAlreadyExist = await uDao.userNameAlreadyTaken(usernameReg)

            if (doesUserAlreadyExist == true) {
                error = {"Error" : "User already exists, cannot register a new user with the same username"}
                sendError = true
            }
        }
        let insertedUser
        if (sendError == false) {
            insertedUser = await uDao.createUser(wholeRequest);
            insertedUser.setPassword('');
            //not sure what this is doing// may be ok since app uses sesssion at server
            req.session['profile'] = insertedUser;
        }

        if (sendError == true) {
            res.sendStatus(403)
        }
        else {
            res.json(insertedUser)
        }

        if (printDebug == true) {
            console.log("Request body -> ", req.body)
            console.log("Request after encryption -> ", wholeRequest)
            console.log("Response status code -> ", res.statusCode)
            console.log("Response data payload -> ", insertedUser)
            debugHelper.printEnd('signup', 'AuthenticationController')

        }


    }


}