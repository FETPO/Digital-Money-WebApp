import React, {Fragment, useCallback} from "react";
import {useModal} from "utils/modal";
import {
    Box,
    Grid,
    IconButton,
    InputAdornment,
    Paper,
    Stack,
    Typography
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {errorHandler, route, useRequest} from "services/Http";
import {notify} from "utils/index";
import Copyable from "components/Copyable";
import {experimentalStyled as styled} from "@mui/material/styles";
import {LoadingButton} from "@mui/lab";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Form, {TextField} from "components/Form";
import LockIcon from "@mui/icons-material/Lock";
import PasswordIcon from "@mui/icons-material/Password";
import {useAuth} from "models/Auth";

const messages = defineMessages({
    confirmTransfer: {defaultMessage: "Confirm Transfer"},
    confirmWithdrawal: {defaultMessage: "Confirm Withdrawal"},
    confirmDeposit: {defaultMessage: "Confirm Deposit"},
    approved: {defaultMessage: "Transaction was approved."},
    rejected: {defaultMessage: "Transaction was rejected."},
    token: {defaultMessage: "Token"},
    password: {defaultMessage: "Password"}
});

const TransferView = ({type, transaction, reloadTable, ...props}) => {
    const [modal, modalElements] = useModal();

    const showTransfer = useCallback(() => {
        modal.confirm({
            content: (
                <ViewCard
                    transaction={transaction}
                    reloadTable={reloadTable}
                    type={type}
                />
            ),
            rootProps: {fullWidth: true}
        });
    }, [modal, transaction, reloadTable, type]);

    return (
        <Fragment>
            <IconButton {...props} onClick={showTransfer}>
                <VisibilityIcon />
            </IconButton>

            {modalElements}
        </Fragment>
    );
};

const ViewCard = ({closeModal, reloadTable, transaction, type}) => {
    const intl = useIntl();
    const [request, loading] = useRequest();
    const [form] = Form.useForm();
    const auth = useAuth();

    const action = useCallback(
        (routeName, message) => {
            const params = {transaction: transaction.id};
            const values = form.getFieldsValue();
            request
                .post(route(routeName, params), values)
                .then(() => {
                    reloadTable?.();
                    notify.success(intl.formatMessage(message));
                    closeModal?.();
                })
                .catch(errorHandler());
        },
        [reloadTable, closeModal, intl, form, request, transaction]
    );

    const approve = useCallback(() => {
        const routeName = "admin.payment.transaction.complete-transfer";
        return action(routeName, messages.approved);
    }, [action]);

    const reject = useCallback(() => {
        const routeName = "admin.payment.transaction.cancel-transfer";
        return action(routeName, messages.rejected);
    }, [action]);

    const renderBankInfo = useCallback((info) => {
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

    let titleMessage = messages.confirmTransfer;

    switch (type) {
        case "send":
            titleMessage = messages.confirmWithdrawal;
            break;
        case "receive":
            titleMessage = messages.confirmDeposit;
            break;
    }

    return (
        <ContainerBox>
            <Stack sx={{px: 3, pt: 3, textAlign: "center"}}>
                <Typography sx={{color: "text.secondary"}} variant="caption">
                    {intl.formatMessage(titleMessage)}
                </Typography>
                <Typography variant="h2">
                    {transaction.formatted_value}
                </Typography>
            </Stack>
            <Grid container spacing={2} sx={{py: 3}}>
                <Grid item xs={12} sm={6}>
                    {renderBankInfo({
                        title: (
                            <FormattedMessage defaultMessage="Transfer Bank" />
                        ),
                        content: transaction.transfer_bank
                    })}
                </Grid>
                <Grid item xs={12} sm={6}>
                    {renderBankInfo({
                        title: (
                            <FormattedMessage defaultMessage="Transfer Beneficiary" />
                        ),
                        content: transaction.transfer_beneficiary
                    })}
                </Grid>
                <Grid item xs={12} sm={6}>
                    {renderBankInfo({
                        title: (
                            <FormattedMessage defaultMessage="Transfer Number" />
                        ),
                        content: transaction.transfer_number
                    })}
                </Grid>

                {type === "receive" ? (
                    <Grid item xs={12} sm={6}>
                        {renderBankInfo({
                            title: (
                                <FormattedMessage defaultMessage="Reference" />
                            ),
                            content: transaction.account?.reference
                        })}
                    </Grid>
                ) : (
                    <Grid item xs={12} sm={6}>
                        {renderBankInfo({
                            title: (
                                <FormattedMessage defaultMessage="Transfer Note" />
                            ),
                            content: transaction.transfer_note
                        })}
                    </Grid>
                )}
            </Grid>

            <Form form={form}>
                {auth.requireTwoFactor() ? (
                    <Form.Item
                        name="token"
                        label={intl.formatMessage(messages.token)}
                        rules={[{required: true}]}>
                        <TextField
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon />
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Form.Item>
                ) : (
                    <Form.Item
                        name="password"
                        label={intl.formatMessage(messages.password)}
                        rules={[{required: true}]}>
                        <TextField
                            fullWidth
                            type="password"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PasswordIcon />
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Form.Item>
                )}
            </Form>

            <Stack
                direction="row"
                justifyContent="flex-end"
                sx={{my: 2}}
                spacing={2}>
                <LoadingButton
                    variant="contained"
                    color="error"
                    onClick={reject}
                    startIcon={<CancelIcon />}
                    disabled={loading}>
                    <FormattedMessage defaultMessage="Reject" />
                </LoadingButton>

                <LoadingButton
                    variant="contained"
                    onClick={approve}
                    startIcon={<CheckCircleIcon />}
                    disabled={loading}>
                    <FormattedMessage defaultMessage="Approve" />
                </LoadingButton>
            </Stack>
        </ContainerBox>
    );
};

const ContainerBox = styled(Box)(() => ({
    position: "relative"
}));

export default TransferView;
