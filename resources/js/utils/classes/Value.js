import {defaultTo, round} from "lodash";
import {defineMessages} from "react-intl";

const messages = defineMessages({
    invalid: {defaultMessage: "{field} is not a valid number"},
    negative: {defaultMessage: "{field} cannot be negative"}
});

class Value {
    constructor(
        amount = 0,
        scale = "unit",
        unitPrice = 1,
        unitPrecision = 8,
        currencyPrecision = 2
    ) {
        this.amount = amount;
        this.scale = scale;
        this.unitPrice = unitPrice;
        this.unitPrecision = unitPrecision;
        this.currencyPrecision = currencyPrecision;
    }

    valueOf() {
        return this.unitValue;
    }

    get unitValue() {
        return Number(
            this.scale === "price"
                ? round(this.amount / this.unitPrice, this.unitPrecision)
                : this.amount
        );
    }

    get priceValue() {
        return Number(
            this.scale === "unit"
                ? round(this.amount * this.unitPrice, this.currencyPrecision)
                : this.amount
        );
    }

    toUnit() {
        return new Value(
            this.unitValue,
            "unit",
            this.unitPrice,
            this.unitPrecision,
            this.currencyPrecision
        );
    }

    toPrice() {
        return new Value(
            this.priceValue,
            "price",
            this.unitPrice,
            this.unitPrecision,
            this.currencyPrecision
        );
    }

    setUnitPrice(unitPrice) {
        return new Value(
            this.amount,
            this.scale,
            unitPrice,
            this.unitPrecision,
            this.currencyPrecision
        );
    }

    clone(amount, scale = null) {
        return new Value(
            amount,
            defaultTo(scale, this.scale),
            this.unitPrice,
            this.unitPrecision,
            this.currencyPrecision
        );
    }

    static validate(intl) {
        return () => ({
            validator(rule, value) {
                const validType = value instanceof Value;
                const params = {field: rule.field};

                if (!validType || isNaN(value.valueOf())) {
                    return Promise.reject(
                        intl.formatMessage(messages.invalid, params)
                    );
                }

                if (value.valueOf() < 0) {
                    return Promise.reject(
                        intl.formatMessage(messages.negative, params)
                    );
                }
                return Promise.resolve();
            }
        });
    }
}

export default Value;
