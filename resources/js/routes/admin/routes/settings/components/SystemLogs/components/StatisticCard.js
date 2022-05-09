import React, {useMemo} from "react";
import {Box, Card, Typography} from "@mui/material";
import {formatNumber} from "utils/formatter";
import infoIcon from "@iconify-icons/ri/information-fill";
import alertIcon from "@iconify-icons/ri/alert-fill";
import closeIcon from "@iconify-icons/ri/close-circle-fill";
import {FormattedMessage} from "react-intl";
import {experimentalStyled as styled} from "@mui/material/styles";
import {Icon} from "@iconify/react";
import {defaultTo} from "lodash";
import Spin from "components/Spin";

const StatisticCard = ({type, value, loading = false}) => {
    const description = useMemo(() => {
        switch (type) {
            case "info":
                return <FormattedMessage defaultMessage="New Infos" />;
            case "warning":
                return <FormattedMessage defaultMessage="New Warnings" />;
            case "error":
                return <FormattedMessage defaultMessage="New Errors" />;
        }
    }, [type]);

    const icon = useMemo(() => {
        switch (type) {
            case "info":
                return infoIcon;
            case "warning":
                return alertIcon;
            case "error":
                return closeIcon;
        }
    }, [type]);

    return (
        <Spin spinning={loading}>
            <StyledCard color={type} active={value > 0}>
                <Box>
                    <Typography variant="h3">
                        {formatNumber(defaultTo(value, 0))}
                    </Typography>
                    <Typography variant="body2" sx={{opacity: 0.72}}>
                        {description}
                    </Typography>
                </Box>
                <StyledIcon icon={icon} />
            </StyledCard>
        </Spin>
    );
};

const StyledCard = styled(({color, active, ...props}) => {
    return <Card {...props} />;
})(({theme, color, active}) => ({
    position: "relative",
    padding: theme.spacing(3),
    alignItems: "center",
    display: "flex",
    ...(active && {
        backgroundColor: theme.palette[color].dark,
        color: theme.palette.common.white
    })
}));

const StyledIcon = styled(Icon)(({theme}) => ({
    height: 100,
    width: 100,
    position: "absolute",
    opacity: 0.42,
    right: theme.spacing(-3)
}));

export default StatisticCard;
