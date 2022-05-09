import React, {Fragment, useCallback, useState, useEffect} from "react";
import {FormattedMessage} from "react-intl";
import {
    alpha,
    experimentalStyled as styled,
    useTheme
} from "@mui/material/styles";
import {Stack, Typography} from "@mui/material";
import {Icon} from "@iconify/react";
import trendingUpFill from "@iconify/icons-eva/trending-up-fill";
import trendingDownFill from "@iconify/icons-eva/trending-down-fill";
import {round, isUndefined} from "lodash";
import {errorHandler, route, useRequest} from "services/Http";
import Spin from "components/Spin";

const Price = ({selectedWallet}) => {
    const [change, setChange] = useState();
    const [price, setPrice] = useState("Unavailable");
    const [request, loading] = useRequest();

    const fetchPrice = useCallback(() => {
        if (selectedWallet.isNotEmpty()) {
            const params = {wallet: selectedWallet.id};
            request
                .get(route("wallet.price", params))
                .then((data) => {
                    setChange(data.change);
                    setPrice(data.formatted_price);
                })
                .catch(errorHandler());
        }
    }, [request, selectedWallet]);

    useEffect(() => {
        fetchPrice();
    }, [fetchPrice]);

    return (
        <Spin spinning={loading}>
            <BaseStyle>
                <Typography variant="subtitle2">
                    <FormattedMessage defaultMessage="Current Price" />
                </Typography>

                <Typography variant="h4">{price}</Typography>

                {!isUndefined(change) && (
                    <Stack direction="row" alignItems="center" spacing={1}>
                        {change < 0 ? (
                            <Fragment>
                                <TrendIcon type="down" />
                                <Typography
                                    component="span"
                                    variant="subtitle2">
                                    {round(change, 1)}%
                                </Typography>
                            </Fragment>
                        ) : (
                            <Fragment>
                                <TrendIcon type="up" />
                                <Typography
                                    component="span"
                                    variant="subtitle2">
                                    +{round(change, 1)}%
                                </Typography>
                            </Fragment>
                        )}
                    </Stack>
                )}
            </BaseStyle>
        </Spin>
    );
};

const TrendIcon = ({type = "up"}) => {
    const theme = useTheme();
    return (
        <TrendStyle
            sx={{
                ...(type !== "down"
                    ? {
                          color: theme.palette.success.main,
                          bgcolor: alpha(theme.palette.success.main, 0.16)
                      }
                    : {
                          color: theme.palette.error.main,
                          bgcolor: alpha(theme.palette.error.main, 0.16)
                      })
            }}>
            <Icon
                width={16}
                icon={type !== "down" ? trendingUpFill : trendingDownFill}
                height={16}
            />
        </TrendStyle>
    );
};

const BaseStyle = styled("div")(() => ({
    display: "flex",
    flexDirection: "column"
}));

const TrendStyle = styled("div")(() => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    width: 24,
    height: 24
}));

export default Price;
