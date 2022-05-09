import React, {useEffect, useMemo, useState} from "react";
import {isEmpty} from "lodash";
import {styled} from "@mui/material/styles";
import {createAvatar} from "utils";
import PersonIcon from "@mui/icons-material/Person";
import {Avatar, Badge} from "@mui/material";
import {useBroadcast} from "services/Broadcast";

const UserAvatar = (props) => {
    const {user, withoutBadge = false, ...avatarProps} = props;
    const broadcast = useBroadcast(`Public.User.${user?.id}`);
    const [presence, setPresence] = useState(user?.presence);

    useEffect(() => {
        if (!isEmpty(user)) {
            const channel = "UserPresenceChanged";

            broadcast.listen(channel, (e) => {
                setPresence(e.presence);
            });

            return () => {
                broadcast.stopListening(channel);
            };
        }
    }, [broadcast, user]);

    const color = useMemo(() => {
        switch (presence) {
            case "away":
                return "warning";
            case "online":
                return "success";
            default:
                return "error";
        }
    }, [presence]);

    if (isEmpty(user)) {
        return (
            <Avatar alt="avatar" {...avatarProps}>
                <PersonIcon />
            </Avatar>
        );
    }

    if (user.profile?.picture) {
        avatarProps.src = user.profile.picture;
        avatarProps.alt = user.name;
    } else {
        const options = createAvatar(user.name);
        avatarProps.children = options.content;
    }

    if (withoutBadge) {
        return <Avatar {...avatarProps} />;
    }

    return (
        <StyledBadge
            overlap="circular"
            invisible={presence === "offline"}
            color={color}
            anchorOrigin={{vertical: "bottom", horizontal: "right"}}
            variant="dot">
            <Avatar {...avatarProps} />
        </StyledBadge>
    );
};

const StyledBadge = styled(Badge)(({theme, color}) => ({
    "& .MuiBadge-badge": {
        color: theme.palette[color].main,
        boxShadow: theme.customShadows.z8,
        "&::after": {
            position: "absolute",
            border: "1px solid currentColor",
            content: '""',
            top: 0,
            left: 0,
            borderRadius: "50%",
            width: "100%",
            height: "100%",
            ...(color === "success" && {
                animation: "ripple 1.2s infinite ease-in-out"
            })
        }
    },
    "@keyframes ripple": {
        "0%": {
            transform: "scale(.8)",
            opacity: 1
        },
        "100%": {
            transform: "scale(2)",
            opacity: 0
        }
    }
}));

export default UserAvatar;
