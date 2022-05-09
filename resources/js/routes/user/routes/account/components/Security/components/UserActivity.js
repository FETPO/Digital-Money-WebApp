import React, {useMemo} from "react";
import {Card, CardHeader} from "@mui/material";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import AsyncTable from "components/AsyncTable";
import {route} from "services/Http";
import {isEmpty} from "lodash";
import {parseDate} from "utils/form";
import TrapScrollBox from "components/TrapScrollBox";

const messages = defineMessages({
    action: {defaultMessage: "Action"},
    date: {defaultMessage: "Date"},
    source: {defaultMessage: "Source"},
    ip: {defaultMessage: "IP"},
    location: {defaultMessage: "Location"},
    agent: {defaultMessage: "Agent"}
});

const UserActivity = () => {
    const intl = useIntl();

    const columns = useMemo(() => {
        return [
            {
                field: "action",
                width: 180,
                headerName: intl.formatMessage(messages.action),
                filterable: true
            },
            {
                field: "created_at",
                width: 100,
                headerName: intl.formatMessage(messages.date),
                type: "dateTime",
                filterable: true,
                renderCell: ({value}) => parseDate(value).fromNow()
            },
            {
                field: "source",
                width: 80,
                headerName: intl.formatMessage(messages.source),
                type: "singleSelect",
                filterable: true,
                valueOptions: ["api", "web"]
            },
            {
                field: "ip",
                width: 100,
                headerName: intl.formatMessage(messages.ip),
                filterable: true
            },
            {
                field: "parsed_agent",
                minWidth: 150,
                flex: 1,
                headerName: intl.formatMessage(messages.agent)
            },
            {
                field: "location",
                minWidth: 180,
                flex: 0.5,
                headerName: intl.formatMessage(messages.location),
                renderCell: ({row}) => {
                    return isEmpty(row.location) ? (
                        <FormattedMessage defaultMessage="Unknown" />
                    ) : (
                        row.location.country
                    );
                }
            }
        ];
    }, [intl]);

    return (
        <Card>
            <CardHeader
                title={<FormattedMessage defaultMessage="User Activity" />}
            />

            <TrapScrollBox sx={{pt: 3, width: "100%"}}>
                <AsyncTable
                    url={route("user.activity-paginate")}
                    columns={columns}
                />
            </TrapScrollBox>
        </Card>
    );
};

export default UserActivity;
