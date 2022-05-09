import React, {
    cloneElement,
    isValidElement,
    memo,
    useContext,
    useRef
} from "react";
import {FormContext, FormInputContext} from "./contexts";
import {forOwn, isEmpty, isFunction, isUndefined} from "lodash";
import {Field} from "rc-field-form";
import {getFieldId} from "./util";
import devWarning from "rc-util/lib/warning";

function Item(props) {
    const {
        name,
        dependencies,
        shouldUpdate,
        rules,
        children,
        required,
        label,
        valuePropName,
        messageVariables = {},
        trigger = "onChange",
        validateTrigger
    } = props;

    const isRenderProps = isFunction(children);
    const hasName = hasValidName(name);
    const {name: formName} = useContext(FormContext);
    const inputRef = useRef(0);

    const renderLayout = (baseChildren, inputContext) => {
        if (!isEmpty(inputContext)) {
            baseChildren = (
                <FormInputContext.Provider value={inputContext}>
                    {baseChildren}
                </FormInputContext.Provider>
            );
        }
        return baseChildren;
    };

    if (!hasName && !isRenderProps && !dependencies) {
        return renderLayout(children);
    }

    inputRef.current += 1;

    const variables = {...messageVariables};

    if (typeof label === "string") {
        variables.label = label;
    } else if (name) {
        variables.label = String(name);
    }

    return (
        <Field
            {...props}
            messageVariables={variables}
            validateTrigger={validateTrigger}
            trigger={trigger}>
            {(control, meta, context) => {
                const {errors = []} = meta;
                const mergedName = isUndefined(name) ? [] : meta.name;
                const fieldId = getFieldId(mergedName, formName);

                const isRequired =
                    required ??
                    Boolean(
                        rules &&
                            rules.some((rule) => {
                                if (!isEmpty(rule) && rule.required) {
                                    return true;
                                }
                                if (typeof rule === "function") {
                                    const entity = rule(context);
                                    return entity && entity.required;
                                }
                                return false;
                            })
                    );

                // ======================= Children =======================
                let inputContext = null,
                    childNode = null;

                devWarning(
                    !(shouldUpdate && dependencies),
                    "[Form.Item] `shouldUpdate` and `dependencies` shouldn't be used together."
                );

                if (Array.isArray(children) && hasName) {
                    devWarning(
                        false,
                        "[Form.Item] `children` is array of render props cannot have `name`."
                    );
                    childNode = children;
                } else if (
                    isRenderProps &&
                    (!(shouldUpdate || dependencies) || hasName)
                ) {
                    devWarning(
                        Boolean(shouldUpdate || dependencies),
                        "[Form.Item] `children` of render props only work with `shouldUpdate` or `dependencies`."
                    );
                    devWarning(
                        !hasName,
                        "[Form.Item] Do not use `name` with `children` of render props since it's not a field."
                    );
                } else if (dependencies && !isRenderProps && !hasName) {
                    devWarning(
                        false,
                        "[Form.Item] Must set `name` or use render props when `dependencies` is set."
                    );
                } else if (isValidElement(children)) {
                    const childProps = {
                        ...children.props,
                        ...control
                    };

                    if (!childProps.id) {
                        childProps.id = fieldId;
                    }

                    forOwn(control, (event, eventName) => {
                        if (isFunction(event)) {
                            childProps[eventName] = (...args) => {
                                children.props[eventName]?.(...args);
                                control[eventName]?.(...args);
                            };
                        }
                    });

                    let validateStatus;
                    if (meta?.validating) {
                        validateStatus = "validating";
                    } else if (meta?.errors?.length) {
                        validateStatus = "error";
                    } else if (meta?.touched) {
                        validateStatus = "success";
                    }

                    inputContext = {
                        label,
                        validateStatus,
                        errors,
                        isRequired
                    };

                    childNode = (
                        <MemoInput
                            disabled={childProps["disabled"]}
                            value={childProps[valuePropName || "value"]}
                            update={inputRef.current}>
                            {cloneElement(children, childProps)}
                        </MemoInput>
                    );
                } else if (
                    isRenderProps &&
                    (shouldUpdate || dependencies) &&
                    !hasName
                ) {
                    childNode = children(context);
                } else {
                    devWarning(
                        !mergedName.length,
                        "[Form.Item] `name` is only used for validate React element. If you are using Form.Item as layout display, please remove `name` instead."
                    );
                    childNode = children;
                }

                return renderLayout(childNode, inputContext);
            }}
        </Field>
    );
}

const MemoInput = memo(
    (props) => props.children,
    (prev, next) => {
        return (
            prev.value === next.value &&
            prev.disabled === next.disabled &&
            prev.update === next.update
        );
    }
);

function hasValidName(name) {
    return !(name === undefined || name === null);
}

export default Item;
