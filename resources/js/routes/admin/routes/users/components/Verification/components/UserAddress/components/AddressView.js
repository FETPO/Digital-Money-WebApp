import React, {Fragment, useCallback} from "react";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {useModal} from "utils/modal";
import {Box, Grid, IconButton, Paper, Stack, Typography} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {errorHandler, route, useRequest} from "services/Http";
import {notify} from "utils/index";
import {experimentalStyled as styled} from "@mui/material/styles";
import {LoadingButton} from "@mui/lab";
import Copyable from "components/Copyable";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const messages = defineMessages({
    approved: {defaultMessage: "Address was approved."},
    rejected: {defaultMessage: "Address was rejected."},
    verifyAddress: {defaultMessage: "Verify Address"}
});

const AddressView = ({address, reloadTable, ...props}) => {
    const intl = useIntl();
    const [modal, modalElements] = useModal();

    const showAddress = useCallback(() => {
        modal.confirm({
            title: intl.formatMessage(messages.verifyAddress),
            content: <ViewCard address={address} reloadTable={reloadTable} />,
            rootProps: {fullWidth: true}
        });
    }, [modal, address, reloadTable, intl]);

    return (
        <Fragment>
            <IconButton {...props} onClick={showAddress}>
                <VisibilityIcon />
            </IconButton>
            {modalElements}
        </Fragment>
    );
};

const ViewCard = ({closeModal, reloadTable, address}) => {
    const intl = useIntl();
    const [request, loading] = useRequest();

    const action = useCallback(
        (routeName, message) => {
            const params = {address: address.id};
            request
                .post(route(routeName, params))
                .then(() => {
                    reloadTable?.();
                    notify.success(intl.formatMessage(message));
                    closeModal?.();
                })
                .catch(errorHandler());
        },
        [reloadTable, closeModal, intl, request, address]
    );

    const approve = useCallback(() => {
        const routeName = "admin.user.verification.approve-address";
        return action(routeName, messages.approved);
    }, [action]);

    const reject = useCallback(() => {
        const routeName = "admin.user.verification.reject-address";
        return action(routeName, messages.rejected);
    }, [action]);

    const renderAddressInfo = useCallback((info) => {
        return (
            <Paper variant="outlined" sx={{px: 2, py: 1}}>
                <Typography sx={{color: "text.secondary"}} variant="caption">
                    {info.title}
                </Typography>

                <Copyable variant="body2" ellipsis>
                    {info.content}
                </Copyable>
            </Paper>
        );
    }, []);

    return (
        <ContainerBox>
            <Grid container spacing={2} sx={{py: 2, mb: 3}}>
                <Grid item xs={12}>
                    {renderAddressInfo({
                        title: <FormattedMessage defaultMessage="Address" />,
                        content: address.address
                    })}
                </Grid>
                <Grid item xs={12} sm={6}>
                    {renderAddressInfo({
                        title: <FormattedMessage defaultMessage="Unit" />,
                        content: address.unit
                    })}
                </Grid>
                <Grid item xs={12} sm={6}>
                    {renderAddressInfo({
                        title: <FormattedMessage defaultMessage="City" />,
                        content: address.city
                    })}
                </Grid>
                <Grid item xs={12} sm={6}>
                    {renderAddressInfo({
                        title: <FormattedMessage defaultMessage="State" />,
                        content: address.state
                    })}
                </Grid>
                <Grid item xs={12} sm={6}>
                    {renderAddressInfo({
                        title: <FormattedMessage defaultMessage="Postcode" />,
                        content: address.postcode
                    })}
                </Grid>
            </Grid>

            {address.status !== "rejected" && (
                <Stack
                    direction="row"
                    justifyContent="flex-end"
                    sx={{my: 2}}
                    spacing={2}>
                    {["pending", "approved"].includes(address.status) && (
                        <LoadingButton
                            variant="contained"
                            color="error"
                            onClick={reject}
                            startIcon={<CancelIcon />}
                            disabled={loading}>
                            <FormattedMessage defaultMessage="Reject" />
                        </LoadingButton>
                    )}

                    {["pending"].includes(address.status) && (
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

export default AddressView;
