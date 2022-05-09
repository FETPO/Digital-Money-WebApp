import {defineMessages} from "react-intl";
import {isArray, isEmpty} from "lodash";
import {formatData} from "../formatter";

const messages = defineMessages({
    invalidMimeType: {defaultMessage: "File is invalid, {types} is required."},
    invalidSize: {defaultMessage: "File size must be between {min} and {max}."}
});

class FileValidator {
    errors = [];

    constructor(file, intl) {
        this.file = file;
        this.intl = intl;
    }

    static make(file, intl) {
        return new this(file, intl);
    }

    mimeTypes(mimeTypes) {
        if (isArray(mimeTypes) && !mimeTypes.includes(this.file?.type)) {
            const types = mimeTypes.join(", ");
            const error = this.intl?.formatMessage?.(messages.invalidMimeType, {
                types
            });
            this.errors.push(error);
        }
        return this;
    }

    size(minSize = 0, maxSize = 10240) {
        const sizeInKb = (this.file?.size || 0) / 1024;
        if (minSize > sizeInKb || sizeInKb > maxSize) {
            const params = {
                min: formatData(minSize * 1024),
                max: formatData(maxSize * 1024)
            };
            const error = this.intl?.formatMessage?.(
                messages.invalidSize,
                params
            );
            this.errors.push(error);
        }
        return this;
    }

    validate() {
        if (!isEmpty(this.errors)) {
            throw this.errors;
        }
    }
}

export default FileValidator;
