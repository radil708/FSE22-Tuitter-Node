"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../Users/User");
function jsonToUser(userFromDb) {
    return new User_1.default(userFromDb._id.toString() || '', userFromDb['username'] || '', userFromDb['firstName'] || '', userFromDb['lastName'] || '', userFromDb['password'] || '', userFromDb['email'] || '');
}
exports.default = jsonToUser;
//# sourceMappingURL=jsonToUser.js.map