import {experimentalStyled as styled} from "@mui/material/styles";
import {OutlinedInput, Toolbar} from "@mui/material";

export const StyledToolbar = styled(Toolbar)(({theme}) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing(0, 3),
    height: 96
}));

export const StyledOutlinedInput = styled(OutlinedInput)(({theme}) => ({
    width: 240,
    transition: theme.transitions.create(["box-shadow", "width"], {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.shorter
    }),
    "&.Mui-focused": {width: 320, boxShadow: theme.customShadows.z8},
    "& fieldset": {
        borderColor: `${theme.palette.grey[500_32]} !important`,
        borderWidth: `1px !important`
    }
}));
