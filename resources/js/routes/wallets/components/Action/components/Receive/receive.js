import React, {Fragment, useCallback, useEffect, useState} from "react";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import QRCode from "qrcode.react";
import {errorHandler, route, useRequest} from "services/Http";
import {useActiveWalletAccount} from "hooks/account";
import {isEmpty} from "lodash";
import SelectAccount from "components/SelectAccount";
import {experimentalStyled as styled} from "@mui/material/styles";
import {Box, Button} from "@mui/material";
import Result from "components/Result";
import Copyable from "components/Copyable";
import Spin from "components/Spin";

const messages = defineMessages({
    noAccountSelected: {defaultMessage: "No account selected!"},
    noAccountDescription: {
        defaultMessage: "Please select an account to get your deposit address."
    },
    noAddress: {defaultMessage: "No deposit address."},
    noAddressDescription: {
        defaultMessage: "Click the button below to generate a deposit address."
    }
});

const Receive = ({sx, ...props}) => {
    const account = useActiveWalletAccount();
    const intl = useIntl();
    const [address, setAddress] = useState();
    const [request, loading] = useRequest();

    useEffect(() => {
        if (!account.isEmpty()) {
            request
                .get(route("wallet.account.latest-address", {id: account.id}))
                .then((data) => setAddress(data))
                .catch(errorHandler());
        }
    }, [request, account]);

    const generateAddress = useCallback(() => {
        if (!account.isEmpty()) {
            request
                .post(
                    route("wallet.account.generate-address", {id: account.id})
                )
                .then((data) => setAddress(data))
                .catch(errorHandler());
        }
    }, [request, account]);

    return (
        <Box sx={{p: 3, ...sx}} {...props}>
            <Spin spinning={loading}>
                <Box sx={{mb: 2, textAlign: "center"}}>
                    {account.isEmpty() ? (
                        <Result
                            title={intl.formatMessage(
                                messages.noAccountSelected
                            )}
                            description={intl.formatMessage(
                                messages.noAccountDescription
                            )}
                            sx={{py: 4}}
                            iconSize={130}
                        />
                    ) : !isEmpty(address) ? (
                        <CodeBox
                            component={QRCode}
                            value={address.address || "empty"}
                            renderAs="svg"
                        />
                    ) : (
                        <Result
                            title={intl.formatMessage(messages.noAddress)}
                            description={intl.formatMessage(
                                messages.noAddressDescription
                            )}
                            sx={{py: 4}}
                            iconSize={130}
                        />
                    )}
                </Box>

                <Box sx={{mb: 2}}>
                    <SelectAccount />
                </Box>

                {!isEmpty(address) && (
                    <Fragment>
                        <Box sx={{mb: 2, textAlign: "center"}}>
                            <Copyable
                                containerProps={{justifyContent: "center"}}
                                ellipsis>
                                {address.address}
                            </Copyable>
                        </Box>

                        <Box sx={{textAlign: "center"}}>
                            <Button
                                variant="contained"
                                onClick={generateAddress}
                                sx={{mx: "auto"}}>
                                <FormattedMessage defaultMessage="Generate New Address" />
                            </Button>
                        </Box>
                    </Fragment>
                )}
            </Spin>
        </Box>
    );
};

const CodeBox = styled(Box)(({theme}) => ({
    maxWidth: "256px",
    width: "80%",
    height: "auto",
    margin: "auto",
    borderRadius: "5px",
    padding: theme.spacing(1),
    border: `1px dashed ${theme.palette.grey[500_32]}`
}));

export default Receive;
