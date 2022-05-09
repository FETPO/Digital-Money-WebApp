import React from "react";
import {styled} from "@mui/material/styles";
import {Icon} from "@iconify/react";
import barChart2Fill from "@iconify-icons/ri/bar-chart-2-fill";
import {Box, Typography} from "@mui/material";
import Spin from "components/Spin";

const StatisticsCard = ({
    title,
    value,
    className,
    loading = false,
    icon = barChart2Fill,
    color = "primary"
}) => {
    return (
        <Box className={className} sx={{width: "100%"}}>
            <Spin sx={{height: "100%"}} spinning={loading}>
                <ContainerBox>
                    <IconWrapperStyle color={color}>
                        <Icon icon={icon} width={35} height={35} />
                    </IconWrapperStyle>

                    <Box sx={{flexGrow: 0.3}} />

                    <Typography variant="h4" sx={{opacity: 1}}>
                        {value}
                    </Typography>
                    <Typography variant="overline" sx={{opacity: 0.72}}>
                        {title}
                    </Typography>
                </ContainerBox>
            </Spin>
        </Box>
    );
};

const ContainerBox = styled(Box)(({theme}) => ({
    display: "flex",
    height: "100%",
    flexDirection: "column",
    padding: theme.spacing(3, 0),
    alignItems: "center",
    justifyContent: "center"
}));

const IconWrapperStyle = styled(({color, ...props}) => {
    return <div {...props} />;
})(({theme, color}) => {
    return {
        height: theme.spacing(8),
        width: theme.spacing(8),
        color: theme.palette[color].dark,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: theme.spacing(2),
        backgroundColor: theme.palette[color].lighter,
        borderRadius: "50%"
    };
});

export default StatisticsCard;
