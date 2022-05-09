import {get as _get, has, isEmpty as _isEmpty} from "lodash";
import {applyMagic} from "js-magic";
import {usePrevious} from "utils/helpers";

class Model {
    constructor(data) {
        this.data = data;
    }

    get(path, defaultValue) {
        return _get(this.data, path, defaultValue);
    }

    __get(prop) {
        return prop in this ? this[prop] : _get(this.data, prop);
    }

    __has(prop) {
        return has(this.data, prop);
    }

    /**
     * @returns {this}
     */
    static use(data) {
        return new this(data);
    }

    isEmpty() {
        return _isEmpty(this.data);
    }

    isNotEmpty() {
        return !this.isEmpty();
    }
}

export function useChangeDetect(model, field = "id") {
    const previous = usePrevious(model.get(field));
    return model.get(field) !== previous;
}

export default applyMagic(Model);
