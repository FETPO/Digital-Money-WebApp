import React, {useCallback} from "react";
import {styled} from "@mui/material/styles";
import {Card, Stack, Typography} from "@mui/material";
import {Icon} from "@iconify/react";
import creditCardFill from "@iconify/icons-eva/credit-card-fill";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import Chart from "./components/Chart";
import Spin from "components/Spin";
import {usePaymentAccount} from "hooks/account";

const messages = defineMessages({
    unavailable: {defaultMessage: "Unavailable"}
});

const Balance = () => {
    const intl = useIntl();
    const {account, loading} = usePaymentAccount();

    const render = useCallback(
        (value) => {
            return value || intl.formatMessage(messages.unavailable);
        },
        [intl]
    );

    return (
        <Spin spinning={loading}>
            <StyledCard>
                <IconWrapperStyle>
                    <Icon icon={creditCardFill} width={24} height={24} />
                </IconWrapperStyle>

                <Stack spacing={1} sx={{p: 3}}>
                    <Typography sx={{typography: "subtitle2"}}>
                        <FormattedMessage defaultMessage="Available" />
                    </Typography>

                    <Typography sx={{typography: "h3"}}>
                        {render(account?.formatted_available)}
                    </Typography>

                    <Stack direction="row" alignItems="center" flexWrap="wrap">
                        <Typography
                            component="span"
                            variant="subtitle2"
                            sx={{mr: 1}}>
                            {render(account?.formatted_total_pending_receive)}
                        </Typography>

                        <Typography
                            component="span"
                            variant="body2"
                            sx={{opacity: 0.72}}>
                            <FormattedMessage defaultMessage="pending" />
                        </Typography>
                    </Stack>
                </Stack>

                <Chart />
            </StyledCard>
        </Spin>
    );
};

const StyledCard = styled(Card)(({theme}) => ({
    position: "relative",
    width: "100%",
    boxShadow: "none",
    color: theme.palette.primary.darker,
    backgroundColor: theme.palette.primary.lighter
}));

const IconWrapperStyle = styled("div")(({theme}) => ({
    position: "absolute",
    right: theme.spacing(3),
    top: theme.spacing(3),
    width: 48,
    height: 48,
    color: theme.palette.primary.lighter,
    backgroundColor: theme.palette.primary.dark,
    display: "flex",
    borderRadius: "50%",
    alignItems: "center",
    justifyContent: "center"
}));

export default Balance;
