import {defineMessages} from "react-intl";

const messages = defineMessages({
    default: {
        defaultMessage: "Validation error on field ${name}"
    },
    required: {
        defaultMessage: "${name} is required"
    },
    enum: {
        defaultMessage: "${name} must be one of [${enum}]"
    },
    whitespace: {
        defaultMessage: "${name} cannot be empty"
    },
    "date.format": {
        defaultMessage: "${name} is invalid for format date"
    },
    "date.parse": {
        defaultMessage: "${name} could not be parsed as date"
    },
    "date.invalid": {
        defaultMessage: "${name} is invalid date"
    },
    "types.template": {
        defaultMessage: "${name} is not a valid ${type}"
    },
    "string.len": {
        defaultMessage: "${name} must be exactly ${len} characters"
    },
    "string.min": {
        defaultMessage: "${name} must be at least ${min} characters"
    },
    "string.max": {
        defaultMessage: "${name} cannot be longer than ${max} characters"
    },
    "string.range": {
        defaultMessage: "${name} must be between ${min} and ${max} characters"
    },
    "number.len": {
        defaultMessage: "${name} must equal ${len}"
    },
    "number.min": {
        defaultMessage: "${name} cannot be less than ${min}"
    },
    "number.max": {
        defaultMessage: "${name} cannot be greater than ${max}"
    },
    "number.range": {
        defaultMessage: "${name} must be between ${min} and ${max}"
    },
    "array.len": {
        defaultMessage: "${name} must be exactly ${len} in length"
    },
    "array.min": {
        defaultMessage: "${name} cannot be less than ${min} in length"
    },
    "array.max": {
        defaultMessage: "${name} cannot be greater than ${max} in length"
    },
    "array.range": {
        defaultMessage: "${name} must be between ${min} and ${max} in length"
    },
    "pattern.mismatch": {
        defaultMessage: "${name} does not match pattern ${pattern}"
    }
});

const params = {
    name: "{name}",
    type: "{type}",
    enum: "{enum}",
    len: "{len}",
    min: "{min}",
    max: "{max}",
    pattern: "{pattern}"
};

export function getValidationMessages(intl) {
    return {
        default: intl.formatMessage(messages["default"], {name: params.name}),
        required: intl.formatMessage(messages["required"], {name: params.name}),
        enum: intl.formatMessage(messages["enum"], {
            name: params.name,
            enum: params.enum
        }),
        whitespace: intl.formatMessage(messages["whitespace"], {
            name: params.name
        }),
        date: {
            format: intl.formatMessage(messages["date.format"], {
                name: params.name
            }),
            parse: intl.formatMessage(messages["date.parse"], {
                name: params.name
            }),
            invalid: intl.formatMessage(messages["date.invalid"], {
                name: params.name
            })
        },
        types: {
            string: intl.formatMessage(messages["types.template"], {
                name: params.name,
                type: params.type
            }),
            method: intl.formatMessage(messages["types.template"], {
                name: params.name,
                type: params.type
            }),
            array: intl.formatMessage(messages["types.template"], {
                name: params.name,
                type: params.type
            }),
            object: intl.formatMessage(messages["types.template"], {
                name: params.name,
                type: params.type
            }),
            number: intl.formatMessage(messages["types.template"], {
                name: params.name,
                type: params.type
            }),
            date: intl.formatMessage(messages["types.template"], {
                name: params.name,
                type: params.type
            }),
            boolean: intl.formatMessage(messages["types.template"], {
                name: params.name,
                type: params.type
            }),
            integer: intl.formatMessage(messages["types.template"], {
                name: params.name,
                type: params.type
            }),
            float: intl.formatMessage(messages["types.template"], {
                name: params.name,
                type: params.type
            }),
            regexp: intl.formatMessage(messages["types.template"], {
                name: params.name,
                type: params.type
            }),
            email: intl.formatMessage(messages["types.template"], {
                name: params.name,
                type: params.type
            }),
            url: intl.formatMessage(messages["types.template"], {
                name: params.name,
                type: params.type
            }),
            hex: intl.formatMessage(messages["types.template"], {
                name: params.name,
                type: params.type
            })
        },
        string: {
            len: intl.formatMessage(messages["string.len"], {
                name: params.name,
                len: params.len
            }),
            min: intl.formatMessage(messages["string.min"], {
                name: params.name,
                min: params.min
            }),
            max: intl.formatMessage(messages["string.max"], {
                name: params.name,
                max: params.max
            }),
            range: intl.formatMessage(messages["string.range"], {
                name: params.name,
                min: params.min,
                max: params.max
            })
        },
        number: {
            len: intl.formatMessage(messages["number.len"], {
                name: params.name,
                len: params.len
            }),
            min: intl.formatMessage(messages["number.min"], {
                name: params.name,
                min: params.min
            }),
            max: intl.formatMessage(messages["number.max"], {
                name: params.name,
                max: params.max
            }),
            range: intl.formatMessage(messages["number.range"], {
                name: params.name,
                min: params.min,
                max: params.max
            })
        },
        array: {
            len: intl.formatMessage(messages["array.len"], {
                name: params.name,
                len: params.len
            }),
            min: intl.formatMessage(messages["array.min"], {
                name: params.name,
                min: params.min
            }),
            max: intl.formatMessage(messages["array.max"], {
                name: params.name,
                max: params.max
            }),
            range: intl.formatMessage(messages["array.range"], {
                name: params.name,
                min: params.min,
                max: params.max
            })
        },
        pattern: {
            mismatch: intl.formatMessage(messages["pattern.mismatch"], {
                name: params.name,
                pattern: params.pattern
            })
        }
    };
}
