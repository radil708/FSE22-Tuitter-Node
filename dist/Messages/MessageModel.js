"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const MessageSchema_1 = require("./MessageSchema");
/**
 * This interacts with the Messages Collections
 */
const MessageModel = mongoose_1.default.model('MessageModel', MessageSchema_1.default);
exports.default = MessageModel;
//# sourceMappingURL=MessageModel.js.map