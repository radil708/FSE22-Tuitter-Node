"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ResponderSchema_1 = require("./ResponderSchema");
/**
 * This is a mongoose model object used specifically to
 * interact with the database using the PollSchema for entry addition,parsing, ..etc
 */
const ResponderToPollModel = mongoose_1.default.model('ResponderToPollModel', ResponderSchema_1.default);
exports.default = ResponderToPollModel;
//# sourceMappingURL=ResponderToPollModel.js.map