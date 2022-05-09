import React, {useCallback, useEffect, useRef, useState} from "react";
import {Icon} from "@iconify/react";
import bellFill from "@iconify/icons-eva/bell-fill";
import doneAllFill from "@iconify/icons-eva/done-all-fill";
import {
    Badge,
    Box,
    Button,
    Divider,
    IconButton,
    List,
    Stack,
    Tooltip,
    Typography
} from "@mui/material";
import Scrollbar from "../Scrollbar";
import MenuPopover from "../MenuPopover";
import NotificationItem, {
    NotificationSkeleton
} from "./components/NotificationItem";
import ActionButton from "../ActionButton";
import {errorHandler, route, useRequest} from "services/Http";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import Spin from "../Spin";
import InfiniteLoader from "../InfiniteLoader";
import Result from "../Result";
import {useAuth} from "models/Auth";
import {usePrivateBroadcast} from "services/Broadcast";
import audioFile from "static/audio/notification.mp3";

const alertAudio = new Audio(audioFile);

const messages = defineMessages({
    markAllAsRead: {defaultMessage: "Mark all as read"}
});

// prettier-ignore
const channel = ".Illuminate\\Notifications\\Events\\BroadcastNotificationCreated";

const Notifications = () => {
    const intl = useIntl();
    const auth = useAuth();
    const [request, loading] = useRequest();
    const [totalUnread, setTotalUnread] = useState(0);
    const [open, setOpen] = useState(false);
    const broadcast = usePrivateBroadcast("Auth.User." + auth.user.id);
    const anchorRef = useRef();
    const loaderRef = useRef();

    const fetchTotalUnread = useCallback(() => {
        request
            .get(route("user.notification.total-unread"))
            .then((data) => setTotalUnread(data.total))
            .catch(errorHandler());
    }, [request]);

    const markAllAsRead = useCallback(() => {
        request
            .post(route("user.notification.mark-all-as-read"))
            .then(() => {
                loaderRef.current?.resetPage();
                fetchTotalUnread();
            })
            .catch(errorHandler());
    }, [request, fetchTotalUnread]);

    const clear = useCallback(() => {
        request
            .post(route("user.notification.clear"))
            .then(() => {
                loaderRef.current?.resetPage();
                fetchTotalUnread();
            })
            .catch(errorHandler());
    }, [request, fetchTotalUnread]);

    useEffect(() => {
        fetchTotalUnread();
    }, [fetchTotalUnread]);

    useEffect(() => {
        broadcast.listen(channel, () => {
            loaderRef.current?.resetPage();
            alertAudio.play().catch(console.log);
            fetchTotalUnread();
        });

        return () => {
            broadcast.stopListening(channel);
        };
    }, [broadcast, fetchTotalUnread]);

    return (
        <React.Fragment>
            <ActionButton
                ref={anchorRef}
                onClick={() => setOpen(true)}
                active={open}>
                <Badge
                    color="primary"
                    badgeContent={totalUnread}
                    invisible={totalUnread === 0}
                    max={9}>
                    <Icon icon={bellFill} />
                </Badge>
            </ActionButton>

            <MenuPopover
                open={open}
                onClose={() => setOpen(false)}
                anchorEl={anchorRef.current}
                sx={{width: 360}}>
                <Spin spinning={loading}>
                    <Stack
                        direction="row"
                        sx={{py: 2, px: 2.5}}
                        alignItems="center">
                        <Box sx={{flexGrow: 1}}>
                            <Typography variant="subtitle1">
                                <FormattedMessage defaultMessage="Notifications" />
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{color: "text.secondary"}}>
                                <FormattedMessage
                                    defaultMessage="You have {totalUnread} unread messages"
                                    values={{totalUnread}}
                                />
                            </Typography>
                        </Box>

                        {totalUnread > 0 && (
                            <Tooltip
                                title={intl.formatMessage(
                                    messages.markAllAsRead
                                )}>
                                <IconButton
                                    color="primary"
                                    onClick={markAllAsRead}>
                                    <Icon
                                        icon={doneAllFill}
                                        width={20}
                                        height={20}
                                    />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Stack>

                    <Divider />

                    <Scrollbar sx={{height: 340}}>
                        <List disablePadding>
                            <InfiniteLoader
                                url={route("user.notification.paginate")}
                                ref={loaderRef}
                                renderItem={(item, update) => (
                                    <NotificationItem
                                        key={item.id}
                                        updateNotification={update}
                                        fetchTotalUnread={fetchTotalUnread}
                                        notification={item}
                                    />
                                )}
                                renderEmpty={() => (
                                    <Result
                                        title={
                                            <FormattedMessage defaultMessage="Nothing here." />
                                        }
                                        description={
                                            <FormattedMessage defaultMessage="You have no notifications yet." />
                                        }
                                        iconSize={130}
                                        sx={{py: 4}}
                                    />
                                )}
                                renderSkeleton={(sentryRef) => (
                                    <NotificationSkeleton ref={sentryRef} />
                                )}
                            />
                        </List>
                    </Scrollbar>

                    <Divider />

                    <Box sx={{p: 1}}>
                        <Button fullWidth onClick={clear} disableRipple>
                            <FormattedMessage defaultMessage="Clear All" />
                        </Button>
                    </Box>
                </Spin>
            </MenuPopover>
        </React.Fragment>
    );
};

export default Notifications;
