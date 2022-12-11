"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ResponderSchema = new mongoose_1.default.Schema({
    answer: { type: String, required: true },
    responderId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'UserModel'
    },
    pollId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'PollModel'
    }
}, { collection: "Responder_to_Poll" });
exports.default = ResponderSchema;
//# sourceMappingURL=ResponderSchema.js.map