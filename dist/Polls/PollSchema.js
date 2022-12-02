"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
/**
 * This is the PollSchema. This will match the format of every entry
 * in the 'Polls' collection from the database
 */
const PollSchema = new mongoose_1.default.Schema({
    question: { type: String, required: true },
    options: { type: (Array) },
    optionCount: { type: (Array) },
    author: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'UserModel'
    }
}, { collection: "Polls" });
exports.default = PollSchema;
//# sourceMappingURL=PollSchema.js.map