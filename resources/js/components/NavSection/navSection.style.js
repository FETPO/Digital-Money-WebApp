import React from "react";
import {experimentalStyled as styled} from "@mui/material/styles";
import {ListItem, ListItemIcon, ListSubheader} from "@mui/material";

export const StyledListSubheader = styled((props) => (
    <ListSubheader disableSticky disableGutters {...props} />
))(({theme}) => ({
    ...theme.typography.overline,
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
    paddingLeft: theme.spacing(5),
    color: theme.palette.text.primary
}));

export const StyledListItem = styled((props) => (
    <ListItem button disableGutters {...props} />
))(({theme}) => ({
    ...theme.typography.body2,
    height: 48,
    position: "relative",
    textTransform: "capitalize",
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(2.5),
    color: theme.palette.text.secondary,
    "&:before": {
        top: 0,
        right: 0,
        width: 3,
        bottom: 0,
        content: "''",
        display: "none",
        position: "absolute",
        borderTopLeftRadius: 4,
        borderBottomLeftRadius: 4,
        backgroundColor: theme.palette.primary.main
    }
}));

export const StyledListItemIcon = styled(ListItemIcon)({
    width: 22,
    height: 22,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
});
