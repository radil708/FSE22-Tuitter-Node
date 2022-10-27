import User from "../Users/User";

/*
this class represent a tuit/tweet. It uses the User class as an attribute.
 */
export default class Tuit {
    private tuitID: string = '';
    private userId: string = '';
    private tuitContent: string = '';
    private postedOn: Date = new Date();
    private postedBy: User | null;


    constructor(tuitIdIn: string, userIdIn: string, contentIn : string, postedOnIn: Date) {
        this.tuitID = tuitIdIn;
        this.userId = userIdIn;
        this.tuitContent = contentIn;
        this.postedOn = postedOnIn;
        this.postedBy = null;
    }

    getTuitId(): string {
        return this.tuitID;
    }

    getUserId(): string {
        return this.userId;
    }

    getContent() : string {
        return this.tuitContent;
    }

    setUser(userIn: User): void {
        this.postedBy = new User(
            userIn.getUserId(),
            userIn.getUserName(),
            userIn.getFirstName(),
            userIn.getLastName(),
            userIn.getPassword(),
            userIn.getEmail())
    }

    getUser(): User | null {
        return this.postedBy
    }

    /**
     * This method will be used to update or set the tuitContent attribute
     * of the Tuit object instant
     * @param contentIn {string} will replace the current tuitContent attribute
     */
    setContent(contentIn: string): void {
        this.tuitContent = contentIn;
    }



    getDate(): Date {
        return this.postedOn;
    }





    getUserID(): string {
        return this.userId;
    }

}
