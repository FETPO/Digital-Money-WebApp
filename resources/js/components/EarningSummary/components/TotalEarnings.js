import React, {useCallback, useEffect, useState} from "react";
import {formatDollar} from "utils/formatter";
import fundsIcon from "@iconify-icons/ri/funds-fill";
import {defineMessages, useIntl} from "react-intl";
import {errorHandler, route, useRequest} from "services/Http";
import SummaryItem from "./SummaryItem";

const messages = defineMessages({
    title: {defaultMessage: "Earnings"}
});

const TotalEarnings = ({className}) => {
    const intl = useIntl();
    const [request, loading] = useRequest();
    const [total, setTotal] = useState(0);

    const fetchTotal = useCallback(() => {
        request
            .get(route("admin.statistics.total-earnings"))
            .then((data) => setTotal(data.total))
            .catch(errorHandler());
    }, [request]);

    useEffect(() => {
        fetchTotal();
    }, [fetchTotal]);

    return (
        <SummaryItem
            color="primary"
            value={formatDollar(total)}
            loading={loading}
            title={intl.formatMessage(messages.title)}
            className={className}
            icon={fundsIcon}
        />
    );
};

export default TotalEarnings;
