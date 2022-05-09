import React, {forwardRef, useImperativeHandle, useMemo} from "react";
import FieldForm from "rc-field-form";
import {isObject, isArray} from "lodash";
import classNames from "classnames";
import useForm from "./hooks/useForm";
import {FormContext} from "./contexts";

const Form = forwardRef(
    (
        {
            className,
            form,
            scrollToFirstError,
            onFinishFailed = () => {},
            name,
            ...otherProps
        },
        ref
    ) => {
        const [wrapForm] = useForm(form);
        wrapForm.__INTERNAL__.name = name;

        useImperativeHandle(ref, () => wrapForm);

        const formClassName = classNames(className);

        const formContextValue = useMemo(() => ({name}), [name]);

        const onInternalFinishFailed = (error) => {
            const fields = error.errorFields;

            onFinishFailed(error);

            if (scrollToFirstError && isArray(fields) && fields.length) {
                const options = isObject(scrollToFirstError)
                    ? scrollToFirstError
                    : {block: "nearest"};

                wrapForm.scrollToField(fields[0].name, options);
            }
        };

        return (
            <FormContext.Provider value={formContextValue}>
                <FieldForm
                    id={name}
                    {...otherProps}
                    onFinishFailed={onInternalFinishFailed}
                    name={name}
                    className={formClassName}
                    form={wrapForm}
                />
            </FormContext.Provider>
        );
    }
);

export {useForm};
export default Form;
