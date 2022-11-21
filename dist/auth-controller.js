"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserDao_1 = require("./Users/UserDao");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const session = require('express-session');
//import session from 'express-session';
class AuthenticationController {
    constructor(appIn) {
        this.userDao = UserDao_1.default.getInstance();
        this.app = appIn;
        //this.userDao = UserDao.getInstance()
        this.app.post('/api/auth/signup', this.signUp);
        this.app.post('/api/auth/profile', this.profile);
        this.app.post('/api/auth/logout', this.logout);
        this.app.post('/api/auth/login', this.login);
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const uDao = UserDao_1.default.getInstance();
            const user = req.body;
            const username = user.username;
            const password = user.password;
            // if properties not available send error message
            if (username == null || password == null) {
                res.json({ "Error": "Missing username or password property" });
                return;
            }
            //see if username already taken
            const doesUserAlreadyExist = yield uDao.userNameAlreadyTaken(username);
            console.log(req.body);
            console.log(doesUserAlreadyExist);
            //if user does not exist send error
            if (doesUserAlreadyExist == false) {
                console.log("user does not exist");
                res.sendStatus(403);
                return;
            }
            const existingUser = yield uDao.findUserbyUserName(username);
            console.log(existingUser);
            const match = yield bcrypt.compare(password, existingUser.getPassword());
            console.log("what is match? -> ", match);
            if (match) {
                existingUser.setPassword("*******");
                session['profile'] = existingUser;
                res.json(existingUser);
                return;
            }
            else {
                res.sendStatus(403);
            }
        });
    }
    profile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const profile = session['profile'];
            if (profile) {
                profile.password = "";
                res.json(profile);
                return;
            }
            else {
                res.sendStatus(403);
            }
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            session['profile'] = null;
            res.sendStatus(200);
        });
    }
    signUp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const uDao = UserDao_1.default.getInstance();
            // username and password must be in request body
            let wholeRequest = req.body;
            const usernameReg = req.body.username;
            const passwordReg = req.body.password;
            // if properties not available send error message
            if (usernameReg == null || passwordReg == null) {
                res.json({ "Error": "Missing username or password property" });
                return;
            }
            const hash = yield bcrypt.hash(passwordReg, saltRounds);
            //change the password property
            wholeRequest.password = hash;
            //TODO delete, but first see what hash does
            console.log(wholeRequest);
            //see if username already taken
            const doesUserAlreadyExist = yield uDao.userNameAlreadyTaken(usernameReg);
            // if user already exists then send error status
            if (doesUserAlreadyExist == true) {
                res.sendStatus(403); //forbidden status
                return;
            }
            else {
                // returns a User object
                const insertedUser = yield uDao.createUser(wholeRequest);
                //obscure/hide password
                insertedUser.setPassword('');
                //not sure what this is doing// may be ok since app uses sesssion at server
                session['profile'] = insertedUser;
                //TODO delete
                console.log(session['profile']);
                console.log(session);
                res.json(insertedUser);
            }
        });
    }
}
exports.default = AuthenticationController;
//# sourceMappingURL=auth-controller.js.map