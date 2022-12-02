import mongoose from "mongoose";

const ResponderSchema = new mongoose.Schema({
    answer: {type: String, required: true},
    responderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel'
    },
    pollId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PollModel'
    }
}, {collection: "Responder_to_Poll"});
export default ResponderSchema;