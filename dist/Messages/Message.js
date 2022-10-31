"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This class represents a message being sent from one user to another
 */
class Message {
    constructor(messageId, content, senderIn, recipientIn, isPrivateMsg = false) {
        this.messageId = '';
        this._content = '';
        this._sender = null;
        this._recipient = null;
        this._isPrivate = false;
        this.messageId = messageId;
        this._content = content;
        this._sender = senderIn;
        this._recipient = recipientIn;
        this._isPrivate = isPrivateMsg;
    }
    /**
     * Get the contents of the message
     */
    getContent() {
        return this._content;
    }
    /**
     * Get the sender
     */
    getSender() {
        return this._sender;
    }
    /**
     * Get the recipient of the message
     */
    getRecipient() {
        return this._recipient;
    }
    /**
     * get whether the message is private or not
     */
    getIsPrivate() {
        return this._isPrivate;
    }
}
exports.default = Message;
//# sourceMappingURL=Message.js.map