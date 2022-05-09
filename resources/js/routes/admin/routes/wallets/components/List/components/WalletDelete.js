import React, {useCallback} from "react";
import {defineMessages, useIntl} from "react-intl";
import {errorHandler, route, useRequest} from "services/Http";
import {notify} from "utils/index";
import PopConfirm from "components/PopConfirm";
import {IconButton} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import LoadingIcon from "components/LoadingIcon";

const messages = defineMessages({
    success: {defaultMessage: "Wallet was removed."},
    confirm: {defaultMessage: "Are you sure?"}
});

const WalletDelete = ({wallet, reloadTable, ...props}) => {
    const intl = useIntl();
    const [request, loading] = useRequest();

    const deleteWallet = useCallback(() => {
        const params = {
            identifier: wallet.coin.identifier
        };
        request
            .delete(route("admin.wallet.delete", params))
            .then(() => {
                notify.success(intl.formatMessage(messages.success));
                reloadTable?.();
            })
            .catch(errorHandler());
    }, [request, wallet, intl, reloadTable]);

    if (wallet.accounts_count > 0) {
        return null;
    }

    return (
        <PopConfirm
            {...props}
            component={IconButton}
            content={intl.formatMessage(messages.confirm)}
            onClick={deleteWallet}>
            <LoadingIcon
                component={DeleteIcon}
                color="error"
                loading={loading}
            />
        </PopConfirm>
    );
};

export default WalletDelete;
