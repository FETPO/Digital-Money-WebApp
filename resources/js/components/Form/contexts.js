import React from "react";
import {omit} from "lodash";
import {FormProvider as RcFormProvider} from "rc-field-form";

export const FormContext = React.createContext({});

export const FormItemContext = React.createContext({
    updateItemErrors: () => {}
});

export const FormInputContext = React.createContext({
    isRequired: false,
    errors: []
});

export const FormProvider = (props) => {
    const providerProps = omit(props, ["prefixCls"]);
    return <RcFormProvider {...providerProps} />;
};
