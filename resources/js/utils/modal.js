import React, {
    cloneElement,
    isValidElement,
    useEffect,
    useMemo,
    useState
} from "react";
import ReactDOM from "react-dom";
import MuiBootstrap from "components/MuiBootstrap";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack
} from "@mui/material";
import {usePatchElement} from "hooks/usePatchElement";
import {LoadingButton} from "@mui/lab";
import {isFunction} from "lodash";
import {mountHandler} from "./helpers";
import {Provider} from "react-redux";
import store from "../store";

const mountPoint = document.createElement("div");
document.body.appendChild(mountPoint);

let modalKey = 0;

const Modal = ({
    title,
    icon = null,
    iconColor = "info.main",
    content,
    rootProps,
    okText = "Ok",
    okButtonProps,
    onOk,
    cancelText = "Cancel",
    onCancel,
    cancelButtonProps,
    afterClose = () => {}
}) => {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);

    const closeModal = () => {
        setOpen(false);
    };

    useEffect(() => {
        const handler = mountHandler();
        if (!open) {
            setTimeout(() => handler.execute(afterClose), 1000);
        }
        return () => {
            handler.unmount();
        };
    }, [open, afterClose]);

    const handleCancel = () => {
        if (!onCancel?.length) {
            return !onCancel?.() && closeModal?.();
        } else {
            onCancel?.(closeModal);
        }
    };

    const handleOk = () => {
        if (!onOk?.length) {
            return !onOk?.() && closeModal?.();
        } else {
            onOk?.(closeModal, setLoading);
        }
    };

    const hideAction = useMemo(() => {
        return !isFunction(onOk) && !isFunction(onCancel);
    }, [onOk, onCancel]);

    return (
        <Dialog {...rootProps} onClose={closeModal} open={open}>
            {title && (
                <DialogTitle>
                    <Stack direction="row" alignItems="center">
                        {icon && (
                            <Box component="span" sx={{mr: 2}}>
                                <icon.type
                                    {...icon.props}
                                    sx={{
                                        display: "flex",
                                        color: iconColor,
                                        ...icon.props.sx,
                                        fontSize: 30
                                    }}
                                />
                            </Box>
                        )}
                        <Box component="span">{title}</Box>
                    </Stack>
                </DialogTitle>
            )}

            <DialogContent sx={{overflowX: "hidden"}}>
                {isValidElement(content)
                    ? cloneElement(content, {closeModal})
                    : content}
            </DialogContent>

            {!hideAction && (
                <DialogActions>
                    <Button
                        variant="outlined"
                        color="inherit"
                        onClick={handleCancel}
                        {...cancelButtonProps}>
                        {cancelText}
                    </Button>
                    <LoadingButton
                        variant="contained"
                        loading={loading}
                        color="inherit"
                        onClick={handleOk}
                        {...okButtonProps}>
                        {okText}
                    </LoadingButton>
                </DialogActions>
            )}
        </Dialog>
    );
};

const modal = {
    confirm(props) {
        modalKey = modalKey + 1;
        ReactDOM.render(
            <Provider store={store}>
                <MuiBootstrap>
                    <Modal {...props} key={`modal-${modalKey}`} />
                </MuiBootstrap>
            </Provider>,
            mountPoint
        );
    }
};

function useModal() {
    const [elements, patch] = usePatchElement();
    const api = useMemo(
        () => ({
            confirm(props) {
                let removeModal = () => {};
                modalKey = modalKey + 1;
                const modal = (
                    <Modal
                        {...props}
                        key={`modal-${modalKey}`}
                        afterClose={() => {
                            removeModal?.();
                        }}
                    />
                );
                removeModal = patch(modal);
            }
        }),
        [patch]
    );

    return [api, elements];
}

export {useModal};
export default modal;
