import React from "react";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {isEmpty} from "lodash";
import {experimentalStyled as styled} from "@mui/material/styles";
import Result from "components/Result";
import {Button} from "@mui/material";
import {SuccessIllustration} from "assets/index";

const messages = defineMessages({
    sent: {defaultMessage: "Sent {value} {symbol}!"}
});

const Completed = ({lastSent, onReset}) => {
    const intl = useIntl();

    return (
        !isEmpty(lastSent) && (
            <BaseStyle>
                <Result
                    title={intl.formatMessage(messages.sent, {
                        symbol: lastSent.coin.symbol,
                        value: lastSent.value
                    })}
                    description={lastSent.description}
                    icon={SuccessIllustration}
                    sx={{py: 4}}
                    iconSize={130}
                    extra={
                        <Button onClick={onReset} variant="contained">
                            <FormattedMessage defaultMessage="Continue" />
                        </Button>
                    }
                />
            </BaseStyle>
        )
    );
};

const BaseStyle = styled("div")(({theme}) => ({
    position: "absolute",
    background: theme.palette.background.paper,
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    top: 0,
    right: 0,
    left: 0,
    zIndex: 10
}));

export default Completed;
