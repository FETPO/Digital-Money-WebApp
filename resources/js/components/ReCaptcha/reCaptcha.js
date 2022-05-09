import React, {
    forwardRef,
    useCallback,
    useContext,
    useImperativeHandle,
    useRef
} from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import {defaultTo, isEmpty} from "lodash";
import {Box, FormHelperText} from "@mui/material";
import {FormInputContext} from "../Form/contexts";
import {notify} from "utils/index";
import {useTheme} from "@mui/material/styles";
import {useRecaptcha} from "hooks/settings";
import context from "context";

let resolveExecution = null;
let rejectExecution = null;

const ReCaptcha = forwardRef((props, ref) => {
    const {onChange, onError, onExpire, className} = props;
    const recaptchaRef = useRef();
    const theme = useTheme();
    const {errors} = useContext(FormInputContext);

    const settings = useRecaptcha();

    useImperativeHandle(
        ref,
        () => ({
            ...recaptchaRef.current,
            executeAsync() {
                return new Promise((resolve, reject) => {
                    resolveExecution = resolve;
                    rejectExecution = reject;
                    recaptchaRef.current.execute();
                });
            }
        }),
        []
    );

    const handleError = useCallback(
        (error) => {
            onError?.(error);
            rejectExecution?.(error);
            rejectExecution = null;
            resolveExecution = null;
        },
        [onError]
    );

    const handleVerify = useCallback(
        (token) => {
            onChange?.(token);
            resolveExecution?.(token);
            rejectExecution = null;
            resolveExecution = null;
        },
        [onChange]
    );

    const handleExpire = useCallback(() => {
        onExpire?.();
        handleVerify(null);
    }, [onExpire, handleVerify]);

    return (
        <Box
            sx={{maxWidth: "100%", width: "304px", mx: "auto !important"}}
            className={className}>
            {settings.enable && (
                <HCaptcha
                    ref={recaptchaRef}
                    sitekey={defaultTo(settings.sitekey, "key")}
                    theme={theme.palette.mode}
                    onError={handleError}
                    onExpire={handleExpire}
                    onVerify={handleVerify}
                    size={settings.size}
                />
            )}

            {!isEmpty(errors) && (
                <FormHelperText error>{errors.join(" ")}</FormHelperText>
            )}
        </Box>
    );
});

export function recaptchaSubmit(form, ref) {
    return () => {
        const recaptcha = ref.current;
        const size = context.settings.recaptcha.size;

        if (size === "invisible") {
            recaptcha
                ?.executeAsync?.()
                .then(() => {
                    recaptcha.resetCaptcha();
                    form.submit();
                })
                .catch((err) => {
                    notify.error(err);
                });
        } else {
            recaptcha?.resetCaptcha();
            form.submit();
        }
    };
}

export default ReCaptcha;
