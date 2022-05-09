import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState
} from "react";
import {FormInputContext} from "components/Form/contexts";
import {
    Alert,
    Box,
    Collapse,
    FormControlLabel,
    FormHelperText,
    Grid,
    Radio,
    RadioGroup,
    Stack,
    Typography
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import bankCardFill from "@iconify-icons/ri/bank-card-fill";
import bankFill from "@iconify-icons/ri/bank-fill";
import paypalFill from "@iconify-icons/ri/paypal-fill";
import {Icon} from "@iconify/react";
import {FormattedMessage} from "react-intl";
import {MHidden} from "components/@material-extend";
import {experimentalStyled as styled, useTheme} from "@mui/material/styles";
import {isEmpty, isNull, isUndefined, startCase} from "lodash";
import {errorHandler, route, useRequest} from "services/Http";
import Spin from "components/Spin";
import BankLogo from "components/BankLogo";
import {usePaymentAccount} from "hooks/account";

const InputMethod = ({value, onChange}) => {
    const {errors} = useContext(FormInputContext);
    const [transfer, setTransfer] = useState();
    const [gateways, setGateways] = useState([]);
    const [request, loading] = useRequest();

    const fetchDepositMethods = useCallback(() => {
        request
            .get(route("payment.deposit-methods"))
            .then((data) => {
                setTransfer(data.transfer);
                setGateways(data.gateways);
            })
            .catch(errorHandler());
    }, [request]);

    useEffect(() => {
        fetchDepositMethods();
    }, [fetchDepositMethods]);

    const fixControlledValue = useCallback((value) => {
        return isUndefined(value) || isNull(value) ? false : value;
    }, []);

    return (
        <RadioGroup value={fixControlledValue(value)} onChange={onChange}>
            <Spin spinning={loading}>
                {isEmpty(transfer) && isEmpty(gateways) ? (
                    <Alert severity="warning">
                        <FormattedMessage defaultMessage="There are no deposit methods available" />
                    </Alert>
                ) : (
                    <Grid container spacing={1}>
                        {!isEmpty(transfer) && (
                            <Grid item xs={12}>
                                <TransferOption
                                    selected={value === "transfer"}
                                    bankAccount={transfer}
                                />
                            </Grid>
                        )}

                        {gateways.map((gateway) => {
                            return (
                                <Grid key={gateway} item xs={12}>
                                    <GatewayOption
                                        selected={value === gateway}
                                        name={gateway}
                                    />
                                </Grid>
                            );
                        })}
                    </Grid>
                )}
            </Spin>

            {!isEmpty(errors) && (
                <FormHelperText sx={{textAlign: "center"}} error>
                    {errors.join(" ")}
                </FormHelperText>
            )}
        </RadioGroup>
    );
};

const TransferOption = ({bankAccount, selected}) => {
    const theme = useTheme();
    const {account} = usePaymentAccount();
    return (
        <OptionStyle selected={selected} sx={{flexWrap: "wrap"}}>
            <FormControlLabel
                sx={{flexGrow: 1, py: 1}}
                value={"transfer"}
                control={<Radio checkedIcon={<CheckCircleIcon />} />}
                label={
                    <Typography variant="subtitle2" sx={{ml: 1}}>
                        <FormattedMessage defaultMessage="Pay with Bank Transfer" />
                    </Typography>
                }
            />
            <MHidden width="smDown">
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        color: theme.palette.primary.main,
                        flexShrink: 0
                    }}>
                    <Icon icon={bankFill} width={25} height={25} />
                </Box>
            </MHidden>

            <Collapse in={selected} sx={{width: "100%"}}>
                <Stack spacing={1} sx={{px: 1, pt: 1, pb: 2}}>
                    <Stack direction="row" spacing={2}>
                        <BankLogo src={bankAccount.bank_logo} />

                        <Box sx={{my: 1, minWidth: 0}}>
                            <Typography variant="subtitle1" noWrap>
                                {bankAccount.bank_name}
                            </Typography>
                            <Typography variant="body2" noWrap>
                                {`${bankAccount.number} (${bankAccount.currency})`}
                            </Typography>
                            <Typography variant="body2" noWrap>
                                {bankAccount.beneficiary}
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{color: "text.secondary"}}
                                noWrap>
                                REF: <b>{account?.reference}</b>
                            </Typography>
                        </Box>
                    </Stack>
                </Stack>

                {bankAccount.note && (
                    <Stack spacing={1} sx={{px: 1, pb: 2}}>
                        <Typography
                            sx={{color: "text.secondary"}}
                            variant="caption">
                            {bankAccount.note}
                        </Typography>
                    </Stack>
                )}
            </Collapse>
        </OptionStyle>
    );
};

const GatewayOption = ({name, selected}) => {
    const theme = useTheme();

    const gatewayIcon = useMemo(() => {
        switch (name) {
            case "paypal":
                return paypalFill;
            default:
                return bankCardFill;
        }
    }, [name]);

    return (
        <OptionStyle
            selected={selected}
            sx={{
                flexWrap: "wrap"
            }}>
            <FormControlLabel
                value={name}
                sx={{flexGrow: 1, py: 1}}
                control={<Radio checkedIcon={<CheckCircleIcon />} />}
                label={
                    <Typography variant="subtitle2" sx={{ml: 1}}>
                        <FormattedMessage
                            defaultMessage="Pay with {title}"
                            values={{title: startCase(name)}}
                        />
                    </Typography>
                }
            />
            <MHidden width="smDown">
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        color: theme.palette.primary.main,
                        flexShrink: 0
                    }}>
                    <Icon icon={gatewayIcon} width={25} height={25} />
                </Box>
            </MHidden>
        </OptionStyle>
    );
};

const OptionStyle = styled(({selected, ...props}) => {
    return <div {...props} />;
})(({theme}) => ({
    display: "flex",
    borderRadius: theme.shape.borderRadius,
    border: `solid 1px ${theme.palette.grey[500_32]}`,
    justifyContent: "space-between",
    alignItems: "center",
    transition: theme.transitions.create("all"),
    padding: theme.spacing(0, 2.5)
}));

export default InputMethod;
