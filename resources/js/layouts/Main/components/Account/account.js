import React, {Fragment, useCallback, useRef, useState} from "react";
import {Icon} from "@iconify/react";
import {Box, Divider, MenuItem, Typography} from "@mui/material";
import {Link as RouterLink} from "react-router-dom";
import MenuPopover from "components/MenuPopover";
import {useAuth} from "models/Auth";
import UserAvatar from "components/UserAvatar";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {notify, router} from "utils/index";
import {errorHandler, useRequest} from "services/Http";
import {LoadingButton} from "@mui/lab";
import ActionButton from "components/ActionButton";

const messages = defineMessages({
    home: {defaultMessage: "Home"},
    profile: {defaultMessage: "Profile"},
    settings: {defaultMessage: "Settings"},
    logoutSuccess: {defaultMessage: "Logout was successful."}
});

const Account = () => {
    const anchorRef = useRef(null);
    const [request, loading] = useRequest();
    const [open, setOpen] = useState(false);
    const auth = useAuth();
    const intl = useIntl();

    const handleLogout = useCallback(() => {
        auth.logout(request)
            .then(() => {
                notify.success(intl.formatMessage(messages.logoutSuccess));
                window.location.reload();
            })
            .catch(errorHandler());
    }, [auth, request, intl]);

    const renderMenuItem = useCallback(
        (key) => {
            return (
                <MenuItem
                    component={RouterLink}
                    onClick={() => setOpen(false)}
                    to={router.generatePath(key)}
                    sx={{typography: "body2", py: 1, px: 2.5}}
                    key={key}>
                    <Box
                        component={Icon}
                        sx={{mr: 2, width: 24, height: 24}}
                        icon={router.getIcon(key)}
                    />

                    {router.getName(key, intl)}
                </MenuItem>
            );
        },
        [intl]
    );

    return (
        <Fragment>
            <ActionButton
                ref={anchorRef}
                onClick={() => setOpen(true)}
                sx={{p: 1, width: 40, height: 40}}
                active={open}>
                <UserAvatar
                    sx={{width: "1.5em", height: "1.5em"}}
                    user={auth.user}
                />
            </ActionButton>

            <MenuPopover
                open={open}
                anchorEl={anchorRef.current}
                onClose={() => setOpen(false)}
                sx={{width: 220}}>
                <Box sx={{my: 1.5, px: 2.5}}>
                    <Typography variant="subtitle1" noWrap>
                        {auth.user.name}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{color: "text.secondary"}}
                        noWrap>
                        {auth.user.email}
                    </Typography>
                </Box>

                <Divider sx={{my: 1}} />

                {renderMenuItem("home")}
                {renderMenuItem("user.purchases")}
                {renderMenuItem("user.account")}

                <Box sx={{p: 2, pt: 1.5}}>
                    <LoadingButton
                        fullWidth
                        loading={loading}
                        variant="outlined"
                        onClick={handleLogout}
                        color="inherit">
                        <FormattedMessage defaultMessage="Logout" />
                    </LoadingButton>
                </Box>
            </MenuPopover>
        </Fragment>
    );
};

export default Account;
