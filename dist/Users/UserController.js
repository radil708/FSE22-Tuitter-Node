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
const UserDao_1 = require("./UserDao");
class UserController {
    constructor() {
        this.findAllUsers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const allUsers = yield UserController.userDaoContAttr.findAllUsers();
            // send response JSON
            res.json(allUsers);
        });
    }
    static getInstance(app) {
        if (UserController.userContAttr == null) {
            UserController.userContAttr = new UserController();
        }
        app.get('/api/users', UserController.userContAttr.findAllUsers);
        return UserController.userContAttr;
    }
}
exports.default = UserController;
// attributes
UserController.userDaoContAttr = UserDao_1.default.getInstance();
UserController.userContAttr = null;
//# sourceMappingURL=UserController.js.map