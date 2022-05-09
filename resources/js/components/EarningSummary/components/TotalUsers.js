import React, {useCallback, useEffect, useState} from "react";
import {defineMessages, useIntl} from "react-intl";
import {formatNumber} from "utils/formatter";
import userIcon from "@iconify/icons-eva/people-fill";
import {errorHandler, route, useRequest} from "services/Http";
import SummaryItem from "./SummaryItem";

const messages = defineMessages({
    title: {defaultMessage: "Total Users"}
});

const TotalUsers = ({className}) => {
    const intl = useIntl();
    const [request, loading] = useRequest();
    const [total, setTotal] = useState(0);

    const fetchTotal = useCallback(() => {
        request
            .get(route("admin.statistics.total-users"))
            .then((data) => setTotal(data.total))
            .catch(errorHandler());
    }, [request]);

    useEffect(() => {
        fetchTotal();
    }, [fetchTotal]);

    return (
        <SummaryItem
            color="primary"
            value={formatNumber(total)}
            loading={loading}
            title={intl.formatMessage(messages.title)}
            className={className}
            icon={userIcon}
        />
    );
};

export default TotalUsers;
