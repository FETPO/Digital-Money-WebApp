import React, {
    Fragment,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import {isNull, isUndefined, defaultTo} from "lodash";
import "scss/vendor/intl-tel-input/intl-tel-input.scss";
import intlTelInput from "intl-tel-input";
import "intl-tel-input/build/js/utils";
import {errorHandler, route, useRequest} from "services/Http";
import {TextField} from "@mui/material";
import GlobalStyles from "@mui/material/GlobalStyles";
import {FormInputContext} from "../Form/contexts";
import {useTheme} from "@mui/material/styles";

const BasePhoneInput = ({itlRef, value, ...others}) => {
    const inputRef = useRef();
    const [request] = useRequest();
    const [info, setInfo] = useState();
    const theme = useTheme();

    const {
        isRequired,
        label,
        validateStatus,
        errors = []
    } = useContext(FormInputContext);

    function fixControlledValue(value) {
        return isUndefined(value) || isNull(value) ? "" : value;
    }

    const baseProps = {...others};

    switch (validateStatus) {
        case "error":
            baseProps.error = true;
            break;
        case "success":
            baseProps.color = "success";
            break;
        default:
            baseProps.color = "info";
    }

    useEffect(() => {
        request
            .post(route("ip.info"))
            .then((data) => setInfo(data))
            .catch(errorHandler());
    }, [request]);

    useEffect(() => {
        if (inputRef.current) {
            const phoneInput = intlTelInput(inputRef.current, {
                nationalMode: false,
                initialCountry: defaultTo(info?.iso_code, "")
            });

            itlRef.current = phoneInput;

            return () => phoneInput.destroy();
        }
    }, [itlRef, info]);

    const styles = useMemo(
        () => ({
            ".iti__country-list": {
                borderRadius: theme.shape.borderRadius,
                backgroundColor: theme.palette.background.paper,
                boxShadow: theme.customShadows.z8
            }
        }),
        [theme]
    );

    return (
        <Fragment>
            <GlobalStyles styles={styles} />
            <TextField
                {...baseProps}
                required={isRequired}
                value={fixControlledValue(value)}
                label={label}
                InputLabelProps={{shrink: true}}
                helperText={errors}
                inputRef={inputRef}
            />
        </Fragment>
    );
};

export default BasePhoneInput;
