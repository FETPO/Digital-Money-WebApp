import React, {useCallback} from "react";
import BeenHereIcon from "@mui/icons-material/Beenhere";
import {defineMessages, useIntl} from "react-intl";
import {errorHandler, route, useRequest} from "services/Http";
import {notify} from "utils/index";
import {IconButton} from "@mui/material";
import LoadingIcon from "components/LoadingIcon";

const messages = defineMessages({
    success: {defaultMessage: "Operation was successful."}
});

const LogMarkAsSeen = ({log, reloadTable, ...props}) => {
    const intl = useIntl();
    const [request, loading] = useRequest();

    const markAsSeen = useCallback(() => {
        const params = {log: log.id};
        request
            .post(route("admin.system-logs.mark-as-seen", params))
            .then(() => {
                notify.success(intl.formatMessage(messages.success));
                reloadTable?.();
            })
            .catch(errorHandler());
    }, [request, log, intl, reloadTable]);

    if (log.seen_at) {
        return null;
    }

    return (
        <IconButton {...props} onClick={markAsSeen}>
            <LoadingIcon component={BeenHereIcon} loading={loading} />
        </IconButton>
    );
};

export default LogMarkAsSeen;
