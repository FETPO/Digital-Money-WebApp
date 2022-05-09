import React, {useCallback, useEffect, useState} from "react";
import ResponsiveCard from "../ResponsiveWidgets/responsiveCard";
import {styled} from "@mui/material/styles";
import {Box, Stack, Typography} from "@mui/material";
import {formatNumber} from "utils/formatter";
import BookingIllustration from "assets/illustrations/booking";
import {FormattedMessage} from "react-intl";
import {errorHandler, route, useRequest} from "services/Http";
import Spin from "../Spin";

const PendingVerification = () => {
    const [request, loading] = useRequest();
    const [total, setTotal] = useState(0);

    const fetchTotal = useCallback(() => {
        request
            .get(route("admin.statistics.pending-verification"))
            .then((data) => setTotal(data.total))
            .catch(errorHandler());
    }, [request]);

    useEffect(() => {
        fetchTotal();
    }, [fetchTotal]);

    return (
        <StyledResponsiveCard>
            <Spin sx={{height: "100%"}} spinning={loading}>
                <Stack
                    alignItems="center"
                    direction="row"
                    justifyContent="space-between"
                    sx={{height: "100%"}}>
                    <Stack>
                        <Typography variant="h4">
                            {formatNumber(total)}
                        </Typography>

                        <Typography
                            sx={{color: "text.secondary"}}
                            variant="overline">
                            <FormattedMessage defaultMessage="Verifications" />
                        </Typography>
                    </Stack>

                    <IconContainer>
                        <BookingIllustration />
                    </IconContainer>
                </Stack>
            </Spin>
        </StyledResponsiveCard>
    );
};

const StyledResponsiveCard = styled(ResponsiveCard)(({theme}) => ({
    padding: theme.spacing(2, 2, 2, 3)
}));

const IconContainer = styled(Box)(({theme}) => ({
    height: 80,
    width: 80,
    lineHeight: 0,
    backgroundColor: theme.palette.background.neutral,
    borderRadius: "50%"
}));

PendingVerification.dimensions = {
    lg: {w: 4, h: 1, isResizable: false},
    md: {w: 4, h: 1, isResizable: false},
    sm: {w: 1, h: 1, isResizable: false},
    xs: {w: 1, h: 1, isResizable: false}
};

export default PendingVerification;
