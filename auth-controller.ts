import {Express, Request, Response} from "express";
import UserDao from "./Users/UserDao";
const bcrypt = require('bcrypt');
const saltRounds = 10;
const session = require('express-session')
//import session from 'express-session';

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
        const uDao = UserDao.getInstance()
        const user = req.body;
        const username = user.username;
        const password = user.password;

        // if properties not available send error message
        if (username == null || password == null) {
            res.json({"Error":"Missing username or password property"})
            return
        }

        //see if username already taken
        const doesUserAlreadyExist = await uDao.userNameAlreadyTaken(username)

        console.log(req.body)
        console.log(doesUserAlreadyExist)

        //if user does not exist send error
        if (doesUserAlreadyExist == false) {
            console.log("user does not exist")
            res.sendStatus(403)
            return
        }

        const existingUser = await uDao.findUserbyUserName(username)
        console.log(existingUser)

        const match = await bcrypt.compare(password, existingUser.getPassword())
        console.log("what is match? -> ", match)

        if (match) {

            existingUser.setPassword("*******")
            session['profile'] = existingUser;
            res.json(existingUser)
            return
        }
        else {
            res.sendStatus(403);
        }

    }

    async profile(req: Request, res: Response) {
        const profile = session['profile']
        if (profile) {
            profile.password = "";
            res.json(profile);
            return
        }
        else {
            res.sendStatus(403);
        }

    }

    async logout(req: Request, res: Response) {
        session['profile'] = null;
        res.sendStatus(200)
    }

    async signUp(req: Request, res: Response) {
        const uDao = UserDao.getInstance()
        // username and password must be in request body
        let wholeRequest = req.body
        const usernameReg = req.body.username
        const passwordReg = req.body.password

        // if properties not available send error message
        if (usernameReg == null || passwordReg == null) {
            res.json({"Error":"Missing username or password property"})
            return
        }

        const hash = await bcrypt.hash(passwordReg, saltRounds)
        //change the password property
        wholeRequest.password = hash

        //TODO delete, but first see what hash does
        console.log(wholeRequest)

        //see if username already taken
        const doesUserAlreadyExist = await uDao.userNameAlreadyTaken(usernameReg)

        // if user already exists then send error status
        if (doesUserAlreadyExist == true) {
            res.sendStatus(403)//forbidden status
            return
        }
        else {
            // returns a User object
            const insertedUser = await uDao.createUser(wholeRequest);
            //obscure/hide password
            insertedUser.setPassword('');

            //not sure what this is doing// may be ok since app uses sesssion at server
            session['profile'] = insertedUser;

            //TODO delete
            console.log(session['profile'])
            console.log(session)

            res.json(insertedUser);

        }
    }


}