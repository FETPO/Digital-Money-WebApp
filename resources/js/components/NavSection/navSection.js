import React, {useCallback, useState} from "react";
import PropTypes from "prop-types";
import {Icon} from "@iconify/react";
import {
    StyledListItem,
    StyledListItemIcon,
    StyledListSubheader
} from "./navSection.style";
import {matchPath, NavLink as RouterLink, useLocation} from "react-router-dom";
import arrowIosForwardFill from "@iconify/icons-eva/arrow-ios-forward-fill";
import arrowIosDownwardFill from "@iconify/icons-eva/arrow-ios-downward-fill";
import {alpha, useTheme} from "@mui/material/styles";
import {isEmpty} from "lodash";
import {Box, Collapse, List, ListItemText} from "@mui/material";

function NavItem({item, active}) {
    const activeRoot = active(item.path);
    const {title, path, icon: ItemIcon, children} = item;
    const [open, setOpen] = useState(activeRoot);
    const theme = useTheme();

    const toggle = useCallback(() => {
        setOpen((state) => !state);
    }, []);

    const activeRootStyle = {
        "&:before": {display: "block"},
        bgcolor: alpha(
            theme.palette.primary.main,
            theme.palette.action.selectedOpacity
        ),
        fontWeight: "fontWeightMedium",
        color: "primary.main"
    };

    if (children) {
        const renderIcon = (active) => (
            <Box
                sx={{
                    borderRadius: "50%",
                    bgcolor: "text.disabled",
                    display: "flex",
                    width: 4,
                    alignItems: "center",
                    justifyContent: "center",
                    height: 4,
                    transition: theme.transitions.create("transform"),
                    ...(active && {
                        transform: "scale(2)",
                        bgcolor: "primary.main"
                    })
                }}
                component="span"
            />
        );

        const activeSubStyle = {
            fontWeight: "fontWeightMedium",
            color: "text.primary"
        };

        return (
            <React.Fragment>
                <StyledListItem
                    onClick={toggle}
                    sx={{...(activeRoot && activeRootStyle)}}>
                    <StyledListItemIcon>
                        {ItemIcon && (
                            <ItemIcon sx={{width: "100%", height: "100%"}} />
                        )}
                    </StyledListItemIcon>
                    <ListItemText disableTypography primary={title} />
                    <Box
                        sx={{width: 16, height: 16, ml: 1}}
                        icon={open ? arrowIosDownwardFill : arrowIosForwardFill}
                        component={Icon}
                    />
                </StyledListItem>

                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {children.map((item) => {
                            const {key, title, path} = item;
                            const activeSub = active(path);

                            return (
                                <StyledListItem
                                    key={key}
                                    component={RouterLink}
                                    sx={{...(activeSub && activeSubStyle)}}
                                    to={path}>
                                    <StyledListItemIcon>
                                        {renderIcon(activeSub)}
                                    </StyledListItemIcon>
                                    <ListItemText
                                        disableTypography
                                        primary={title}
                                    />
                                </StyledListItem>
                            );
                        })}
                    </List>
                </Collapse>
            </React.Fragment>
        );
    }

    return (
        <StyledListItem
            component={RouterLink}
            sx={{...(activeRoot && activeRootStyle)}}
            to={path}>
            <StyledListItemIcon>
                {ItemIcon && <ItemIcon sx={{width: "100%", height: "100%"}} />}
            </StyledListItemIcon>
            <ListItemText disableTypography primary={title} />
        </StyledListItem>
    );
}

NavItem.propTypes = {
    item: PropTypes.object,
    active: PropTypes.func
};

function NavSection({config, ...other}) {
    const {pathname} = useLocation();

    const match = useCallback(
        (path) => {
            return !isEmpty(matchPath(pathname, {path}));
        },
        [pathname]
    );

    return (
        <Box {...other}>
            {config.map((list) => {
                const {key, title, items} = list;

                const filtered = items.filter((e) => !isEmpty(e));

                if (!isEmpty(filtered)) {
                    return (
                        <List key={key} disablePadding>
                            <StyledListSubheader>{title}</StyledListSubheader>

                            {filtered.map((item) => (
                                <NavItem
                                    key={item.key}
                                    item={item}
                                    active={match}
                                />
                            ))}
                        </List>
                    );
                }
            })}
        </Box>
    );
}

NavSection.propTypes = {config: PropTypes.array};

export default NavSection;
