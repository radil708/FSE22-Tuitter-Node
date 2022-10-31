"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
/**
 * This defines the format for each entry in the Messages collection
 */
const MessageSchema = new mongoose_1.default.Schema({
    content: String,
    sender: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'UserModel'
    },
    recipient: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'UserModel'
    },
    privacyStatus: Boolean
}, { collection: "Messages" });
exports.default = MessageSchema;
//# sourceMappingURL=MessageSchema.js.map