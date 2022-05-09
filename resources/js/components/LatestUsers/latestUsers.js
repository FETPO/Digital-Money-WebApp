import React, {useCallback, useEffect, useState} from "react";
import ResponsiveCard from "../ResponsiveWidgets/responsiveCard";
import {FormattedMessage} from "react-intl";
import {CardHeader, Stack, Typography} from "@mui/material";
import FlagIcon from "../FlagIcon";
import UserAvatar from "../UserAvatar";
import {isEmpty, toLower} from "lodash";
import {parseDate} from "utils/form";
import Spin from "../Spin";
import Scrollbar from "../Scrollbar";
import {errorHandler, route, useRequest} from "services/Http";
import {useTheme} from "@mui/material/styles";

const LatestUsers = () => {
    const [data, setData] = useState([]);
    const [request, loading] = useRequest();
    const theme = useTheme();

    const fetchData = useCallback(() => {
        request
            .get(route("admin.statistics.latest-users"))
            .then((data) => setData(data))
            .catch(errorHandler());
    }, [request]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <ResponsiveCard>
            <CardHeader
                title={<FormattedMessage defaultMessage="Latest Users" />}
            />

            <Spin
                sx={{
                    height: `calc(100% - ${theme.spacing(6.5)})`,
                    flexGrow: 1
                }}
                spinning={loading}>
                <Scrollbar sx={{p: 3}}>
                    <Stack spacing={3}>
                        {data.map((user, key) => (
                            <UserListItem key={key} user={user} />
                        ))}
                    </Stack>
                </Scrollbar>
            </Spin>
        </ResponsiveCard>
    );
};

function UserListItem({user}) {
    const registered = parseDate(user.created_at);
    const location = user.location;
    return (
        <Stack direction="row" alignItems="center" spacing={2}>
            <UserAvatar user={user} />

            <Stack sx={{flexGrow: 1, minWidth: 0}}>
                <Stack
                    direction="row"
                    alignItems="center"
                    sx={{minWidth: 0}}
                    spacing={1}>
                    <Typography variant="subtitle2" noWrap>
                        {user.name}
                    </Typography>
                    {user.country && <FlagIcon code={toLower(user.country)} />}
                </Stack>

                {user.email && (
                    <Typography
                        variant="caption"
                        sx={{color: "text.secondary"}}
                        noWrap>
                        {user.email}
                    </Typography>
                )}
            </Stack>

            <Stack sx={{minWidth: 0, textAlign: "right"}}>
                <Typography variant="body2" noWrap>
                    {registered.fromNow()}
                </Typography>

                {!isEmpty(location) && (
                    <Typography
                        variant="caption"
                        sx={{color: "text.secondary"}}
                        noWrap>
                        {`${location.state_name} (${location.iso_code})`}
                    </Typography>
                )}
            </Stack>
        </Stack>
    );
}

LatestUsers.dimensions = {
    lg: {w: 4, h: 3, isResizable: false},
    md: {w: 3, h: 3, isResizable: false},
    sm: {w: 2, h: 3, isResizable: false},
    xs: {w: 1, h: 3, isResizable: false}
};

export default LatestUsers;
