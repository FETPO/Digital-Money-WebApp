import React, {
    Fragment,
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";
import {
    Box,
    CardContent,
    CardHeader,
    Chip,
    Grid,
    Stack,
    Typography
} from "@mui/material";
import {useAuth} from "models/Auth";
import {errorHandler, route, useRequest} from "services/Http";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import FeatureLimit from "models/FeatureLimit";
import ResponsiveCard from "../ResponsiveWidgets/responsiveCard";
import Spin from "../Spin";
import {isEmpty} from "lodash";
import Result from "../Result";
import {experimentalStyled as styled} from "@mui/material/styles";
import {Icon} from "@iconify/react";
import Scrollbar from "../Scrollbar";
import {formatNumber} from "utils/formatter";
import {calculatePercent} from "utils/helpers";
import CircularProgressWithLabel from "../CircularProgressWithLabel";
import {useVerification} from "hooks/user";

const messages = defineMessages({
    unverified: {defaultMessage: "Unverified"},
    basic: {defaultMessage: "Basic"},
    advanced: {defaultMessage: "Advance"},
    empty: {defaultMessage: "No Record!"}
});

const FeatureLimits = ({height}) => {
    const auth = useAuth();
    const [request, loading] = useRequest();
    const [features, setFeatures] = useState([]);
    const {status} = useVerification();
    const intl = useIntl();

    const fetchFeatures = useCallback(() => {
        request
            .get(route("feature-limit.all"))
            .then((features) => setFeatures(features))
            .catch(errorHandler());
    }, [request]);

    useEffect(() => {
        fetchFeatures();
    }, [fetchFeatures]);

    const tags = useMemo(() => {
        return {
            unverified: (
                <Chip
                    size="small"
                    label={intl.formatMessage(messages.unverified)}
                    color="default"
                />
            ),
            basic: (
                <Chip
                    size="small"
                    label={intl.formatMessage(messages.basic)}
                    color="info"
                />
            ),
            advanced: (
                <Chip
                    size="small"
                    label={intl.formatMessage(messages.advanced)}
                    color="primary"
                />
            )
        };
    }, [intl]);

    const renderFeature = (data) => {
        const feature = FeatureLimit.use(data);
        const percent = calculatePercent(feature.usage, feature.limit);

        return (
            <Stack
                key={feature.name}
                justifyContent="center"
                sx={{minHeight: 40}}>
                <Grid container alignItems="center" spacing={2}>
                    <Grid item xs={8} sm={6} alignItems="center">
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <IconContainer>
                                <StyledIcon
                                    icon={feature.icon()}
                                    color="primary"
                                />
                            </IconContainer>

                            <Typography variant="body2" noWrap>
                                {feature.title}
                            </Typography>
                        </Stack>
                    </Grid>

                    <Grid
                        item
                        sx={{
                            alignItems: "center",
                            display: {xs: "none", sm: "flex"},
                            justifyContent: "center"
                        }}
                        sm={3}>
                        <CircularProgressWithLabel value={percent} />
                    </Grid>

                    <Grid
                        item
                        sx={{textAlign: "right", whiteSpace: "nowrap"}}
                        xs={4}
                        sm={3}>
                        {!feature.limit ? (
                            <Chip
                                size="small"
                                component="span"
                                label={
                                    <FormattedMessage defaultMessage="Disabled" />
                                }
                            />
                        ) : (
                            <Chip
                                size="small"
                                component="span"
                                color="primary"
                                label={
                                    <Fragment>
                                        <Typography
                                            component="span"
                                            sx={{mr: 0.5}}
                                            variant="body2">
                                            {formatNumber(feature.usage)}

                                            <Typography
                                                component="span"
                                                sx={{mx: 0.3}}
                                                variant="caption">
                                                <FormattedMessage defaultMessage="of" />
                                            </Typography>

                                            {formatNumber(feature.limit)}
                                        </Typography>

                                        <Typography
                                            component="span"
                                            variant="caption">
                                            {feature.unit(auth.user)}
                                        </Typography>
                                    </Fragment>
                                }
                            />
                        )}
                    </Grid>
                </Grid>
            </Stack>
        );
    };

    return (
        <ResponsiveCard
            sx={{
                display: "flex",
                flexDirection: "column",
                maxHeight: "100%"
            }}>
            <CardHeader
                title={<FormattedMessage defaultMessage="Account Limits" />}
                action={tags[status]}
            />

            <CardContent>
                <Scrollbar
                    sx={{
                        ...(height && {
                            height: `calc(${height}px - 100px)`
                        })
                    }}>
                    <Spin spinning={loading}>
                        {isEmpty(features) ? (
                            <Result iconSize={150} sx={{py: 2}} />
                        ) : (
                            <Stack spacing={2}>
                                {features.map(renderFeature)}
                            </Stack>
                        )}
                    </Spin>
                </Scrollbar>
            </CardContent>
        </ResponsiveCard>
    );
};

const IconContainer = styled(Box)(({theme}) => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
    backgroundColor: theme.palette.background.neutral,
    borderRadius: "50%",
    width: 35,
    height: 35
}));

const StyledIcon = styled(({color, ...props}) => {
    return <Icon {...props} />;
})(({theme, color}) => ({
    height: 20,
    width: 20,
    color: theme.palette[color].dark
}));

FeatureLimits.dimensions = {
    lg: {w: 6, h: 3, isResizable: false},
    md: {w: 4, h: 3, isResizable: false},
    sm: {w: 2, h: 3, isResizable: false},
    xs: {w: 1, h: 3, isResizable: false}
};

export default FeatureLimits;
