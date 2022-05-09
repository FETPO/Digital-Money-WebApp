import Model from "models/Model";
import {isEmpty} from "lodash";

export default class Coin extends Model {
    /**
     * Get svg icon
     *
     * @returns {{color: *, icon: *, name: *}}
     */
    svgIcon() {
        return (
            !isEmpty(this.get("svg_icon")) && {
                color: this.get("color"),
                icon: this.get("svg_icon"),
                name: this.get("name")
            }
        );
    }
}
