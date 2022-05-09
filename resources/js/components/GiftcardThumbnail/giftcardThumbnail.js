import React from "react";
import {useTheme} from "@mui/material/styles";
import {Avatar} from "@mui/material";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";

const GiftcardThumbnail = ({src, size = 40, sx, ...otherProps}) => {
    const theme = useTheme();
    return (
        <Avatar
            {...otherProps}
            variant="rounded"
            sx={{
                height: size,
                fontSize: size * (2 / 3),
                width: size,
                background: theme.palette.primary.light,
                color: theme.palette.primary.dark,
                cursor: "pointer",
                ...sx
            }}
            src={src}>
            <CardGiftcardIcon fontSize="inherit" />
        </Avatar>
    );
};

export default GiftcardThumbnail;
