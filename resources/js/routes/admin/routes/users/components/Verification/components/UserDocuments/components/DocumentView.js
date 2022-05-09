import React, {Fragment, useCallback} from "react";
import {useModal} from "utils/modal";
import {Box, IconButton, Stack, Typography} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {defaultStyles as iconStyles, FileIcon} from "react-file-icon";
import {experimentalStyled as styled} from "@mui/material/styles";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import {errorHandler, route, useRequest} from "services/Http";
import {LoadingButton} from "@mui/lab";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {notify} from "utils/index";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const messages = defineMessages({
    approved: {defaultMessage: "Document was approved."},
    rejected: {defaultMessage: "Document was rejected."},
    verifyDocuments: {defaultMessage: "Verify Documents"}
});

const DocumentView = ({document, reloadTable, ...props}) => {
    const intl = useIntl();
    const [modal, modalElements] = useModal();

    const showDocument = useCallback(() => {
        modal.confirm({
            title: intl.formatMessage(messages.verifyDocuments),
            content: <ViewCard document={document} reloadTable={reloadTable} />,
            rootProps: {fullWidth: true}
        });
    }, [modal, document, reloadTable, intl]);

    return (
        <Fragment>
            <IconButton {...props} onClick={showDocument}>
                <VisibilityIcon />
            </IconButton>
            {modalElements}
        </Fragment>
    );
};

const ViewCard = ({closeModal, reloadTable, document}) => {
    const intl = useIntl();
    const [request, loading] = useRequest();
    const requirement = document.requirement;
    const data = document.data;

    const download = useCallback(() => {
        window.location.href = route(
            "admin.user.verification.download-document",
            {document: document.id}
        );
    }, [document]);

    const action = useCallback(
        (routeName, message) => {
            const params = {document: document.id};
            request
                .post(route(routeName, params))
                .then(() => {
                    reloadTable?.();
                    notify.success(intl.formatMessage(message));
                    closeModal?.();
                })
                .catch(errorHandler());
        },
        [reloadTable, closeModal, intl, request, document]
    );

    const approve = useCallback(() => {
        const routeName = "admin.user.verification.approve-document";
        return action(routeName, messages.approved);
    }, [action]);

    const reject = useCallback(() => {
        const routeName = "admin.user.verification.reject-document";
        return action(routeName, messages.rejected);
    }, [action]);

    return (
        <ContainerBox>
            <Stack direction="row" alignItems="center" sx={{mb: 3}} spacing={3}>
                <Box sx={{width: 40, display: "flex", flexShrink: 0}}>
                    <FileIcon
                        {...iconStyles[data?.extension]}
                        extension={data?.extension}
                    />
                </Box>
                <Stack spacing={0.5} sx={{minWidth: 0, flexGrow: 1}}>
                    <Typography variant="body2" noWrap>
                        {requirement?.name}
                    </Typography>
                    <Typography
                        variant="caption"
                        sx={{color: "text.secondary"}}
                        noWrap>
                        {requirement?.description}
                    </Typography>
                </Stack>
                <IconButton onClick={download}>
                    <CloudDownloadIcon fontSize="inherit" />
                </IconButton>
            </Stack>

            {document.status !== "rejected" && (
                <Stack
                    direction="row"
                    justifyContent="flex-end"
                    sx={{my: 2}}
                    spacing={2}>
                    {["pending", "approved"].includes(document.status) && (
                        <LoadingButton
                            variant="contained"
                            color="error"
                            onClick={reject}
                            startIcon={<CancelIcon />}
                            disabled={loading}>
                            <FormattedMessage defaultMessage="Reject" />
                        </LoadingButton>
                    )}

                    {["pending"].includes(document.status) && (
                        <LoadingButton
                            variant="contained"
                            onClick={approve}
                            startIcon={<CheckCircleIcon />}
                            disabled={loading}>
                            <FormattedMessage defaultMessage="Approve" />
                        </LoadingButton>
                    )}
                </Stack>
            )}
        </ContainerBox>
    );
};

const ContainerBox = styled(Box)(() => ({
    position: "relative"
}));

export default DocumentView;
