import Model from "models/Model";
import Wallet from "models/Wallet";
import User from "models/User";

export default class WalletAccount extends Model {
    /**
     * Get wallet
     *
     * @returns {Wallet}
     */
    get wallet() {
        if (!this.walletObject) {
            this.walletObject = new Wallet(this.get("wallet"));
        }
        return this.walletObject;
    }

    /**
     * Get wallet
     *
     * @returns {User}
     */
    get user() {
        if (!this.userObject) {
            this.userObject = new User(this.get("user"));
        }
        return this.userObject;
    }
}
