import {isEmpty, toLower} from "lodash";
import {Stack, Typography} from "@mui/material";
import UserAvatar from "../UserAvatar";
import FlagIcon from "../FlagIcon";
import React from "react";

const UserTable = {
    render: (user) => {
        return (
            !isEmpty(user) && (
                <Stack
                    direction="row"
                    sx={{minWidth: 0}}
                    alignItems="center"
                    spacing={2}>
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
                            {user.country && (
                                <FlagIcon code={toLower(user.country)} />
                            )}
                        </Stack>

                        <Typography
                            variant="caption"
                            sx={{color: "text.secondary"}}
                            noWrap>
                            {user.email}
                        </Typography>
                    </Stack>
                </Stack>
            )
        );
    }
};

export default UserTable;
