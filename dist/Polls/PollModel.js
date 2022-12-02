"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PollSchema_1 = require("./PollSchema");
/**
 * This is a mongoose model object used specifically to
 * interact with the database using the PollSchema for entry addition,parsing, ..etc
 */
const PollModel = mongoose_1.default.model('PollModel', PollSchema_1.default);
exports.default = PollModel;
//# sourceMappingURL=PollModel.js.map