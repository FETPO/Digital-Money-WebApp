import React from "react";
import {useForm as useRcForm} from "rc-field-form";
import scrollIntoView from "scroll-into-view-if-needed";
import {castArray} from "lodash";
import {getFieldId} from "../util";

export default function useForm(form) {
    const [rcForm] = useRcForm();

    const wrapForm = React.useMemo(
        () =>
            form ?? {
                ...rcForm,
                __INTERNAL__: {},
                scrollToField: (name, options = {}) => {
                    const namePath = castArray(name);
                    const fieldId = getFieldId(
                        namePath,
                        wrapForm.__INTERNAL__.name
                    );

                    const node = fieldId && document.getElementById(fieldId);

                    if (node) {
                        scrollIntoView(node, {
                            block: "nearest",
                            scrollMode: "if-needed",
                            ...options
                        });
                    }
                }
            },
        [form, rcForm]
    );
    return [wrapForm];
}
