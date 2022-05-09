import Model from "models/Model";
import Coin from "models/Coin";

export default class Wallet extends Model {
    /**
     * Get coin
     *
     * @returns {Coin}
     */
    get coin() {
        if (!this.coinObject) {
            this.coinObject = new Coin(this.get("coin"));
        }
        return this.coinObject;
    }
}
