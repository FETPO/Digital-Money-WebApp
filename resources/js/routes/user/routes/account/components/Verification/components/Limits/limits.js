import React, {
    Fragment,
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Chip,
    Grid,
    Stack,
    Typography
} from "@mui/material";
import Spin from "components/Spin";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {errorHandler, route, useRequest} from "services/Http";
import {useAuth} from "models/Auth";
import {experimentalStyled as styled} from "@mui/material/styles";
import {Icon} from "@iconify/react";
import Result from "components/Result";
import {isEmpty} from "lodash";
import FeatureLimit from "models/FeatureLimit";
import {formatNumber} from "utils/formatter";
import {useVerification} from "hooks/user";

const messages = defineMessages({
    unverified: {defaultMessage: "Unverified"},
    basic: {defaultMessage: "Basic"},
    advanced: {defaultMessage: "Advance"},
    empty: {defaultMessage: "No Record!"}
});

const Limits = () => {
    const auth = useAuth();
    const [request, loading] = useRequest();
    const {status} = useVerification();
    const [features, setFeatures] = useState([]);
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

        const gridData = (
            <Grid sx={{textAlign: "right", whiteSpace: "nowrap"}} item xs={4}>
                {!feature.limit ? (
                    <Typography variant="body2">
                        <FormattedMessage defaultMessage="Disabled" />
                    </Typography>
                ) : (
                    <Fragment>
                        <Typography
                            component="span"
                            sx={{mr: 0.5}}
                            variant="body2">
                            {formatNumber(feature.limit)}
                        </Typography>

                        <Typography
                            component="span"
                            sx={{color: "text.secondary"}}
                            variant="caption">
                            {feature.unit(auth.user)}/{feature.period.charAt(0)}
                        </Typography>
                    </Fragment>
                )}
            </Grid>
        );

        const gridName = (
            <Grid item xs={8} alignItems="center">
                <Stack direction="row" alignItems="center" spacing={1}>
                    <IconContainer>
                        <StyledIcon icon={feature.icon()} color="primary" />
                    </IconContainer>

                    <Typography variant="body2" noWrap>
                        {feature.title}
                    </Typography>
                </Stack>
            </Grid>
        );

        return (
            <Box key={feature.name}>
                <Grid container alignItems="center" spacing={2}>
                    {gridName}
                    {gridData}
                </Grid>
            </Box>
        );
    };

    return (
        <Card>
            <CardHeader
                title={<FormattedMessage defaultMessage="Limits" />}
                action={tags[status]}
            />

            <CardContent>
                <Spin spinning={loading}>
                    {!isEmpty(features) ? (
                        <Stack spacing={1}>{features.map(renderFeature)}</Stack>
                    ) : (
                        <Result iconSize={100} sx={{py: 2}} />
                    )}
                </Spin>
            </CardContent>
        </Card>
    );
};

const IconContainer = styled(Box)(({theme}) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    borderRadius: "50%",
    backgroundColor: theme.palette.background.neutral,
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

export default Limits;
