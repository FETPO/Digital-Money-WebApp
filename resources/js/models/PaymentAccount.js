import Model from "models/Model";
import {getSymbolIcon} from "utils/helpers";

class PaymentAccount extends Model {
    symbolIcon() {
        return getSymbolIcon(this.symbol);
    }
}

export default PaymentAccount;
