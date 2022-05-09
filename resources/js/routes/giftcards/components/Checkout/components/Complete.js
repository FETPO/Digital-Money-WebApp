import React from "react";
import {styled} from "@mui/material/styles";
import {Box, Button, Divider, Stack, Typography} from "@mui/material";
import {DialogAnimate} from "components/Animate";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import {OrderCompleteIllustration} from "assets";
import {Link as RouterLink} from "react-router-dom";
import {FormattedMessage} from "react-intl";
import RedeemIcon from "@mui/icons-material/Redeem";
import {router} from "utils/index";

const Complete = () => {
    return (
        <StyledDialog fullScreen open={true}>
            <Box sx={{p: 4, maxWidth: 480, margin: "auto"}}>
                <Box sx={{textAlign: "center"}}>
                    <Typography variant="h4" paragraph>
                        <FormattedMessage defaultMessage="Thank you for your purchase!" />
                    </Typography>

                    <OrderCompleteIllustration sx={{height: 260, my: 10}} />

                    <Typography variant="body2">
                        <FormattedMessage defaultMessage="We will send you your receipt shortly via email." />
                    </Typography>
                </Box>

                <Divider sx={{my: 3}} />

                <Stack
                    justifyContent="space-between"
                    direction={{xs: "column-reverse", sm: "row"}}
                    spacing={2}>
                    <Button
                        component={RouterLink}
                        to={router.generatePath("giftcards.shop")}
                        startIcon={<ArrowBackIosIcon />}
                        color="inherit">
                        <FormattedMessage defaultMessage="Continue Shopping" />
                    </Button>
                    <Button
                        component={RouterLink}
                        to={router.generatePath("user.purchases")}
                        startIcon={<RedeemIcon />}
                        variant="contained">
                        <FormattedMessage defaultMessage="View Purchases" />
                    </Button>
                </Stack>
            </Box>
        </StyledDialog>
    );
};

const StyledDialog = styled(DialogAnimate)(({theme}) => ({
    "& .MuiDialog-paper": {
        margin: 0,
        [theme.breakpoints.up("md")]: {
            maxWidth: "calc(100% - 48px)",
            maxHeight: "calc(100% - 48px)"
        }
    }
}));

export default Complete;
