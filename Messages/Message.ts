import User from "../Users/User";

/**
 * This class represents a message being sent from one user to another
 */
export default class Message {
    private messageId: string = '';
    private _content: string = '';
    private _sender: User | null = null;
    private _recipient: User | null = null;
    private _isPrivate: boolean = false;

    constructor(messageId: string, content: string, senderIn: User | null, recipientIn: User | null, isPrivateMsg: boolean = false) {
        this.messageId = messageId
        this._content = content;
        this._sender = senderIn;
        this._recipient = recipientIn;
        this._isPrivate = isPrivateMsg;
    }

    /**
     * Get the contents of the message
     */
    getContent(): string {
        return this._content;
    }

    /**
     * Get the sender
     */
    getSender(): User | null {
        return this._sender;
    }

    /**
     * Get the recipient of the message
     */
    getRecipient(): User | null {
        return this._recipient;
    }

    /**
     * get whether the message is private or not
     */
    getIsPrivate(): boolean {
        return this._isPrivate;
    }

}