import React, {useMemo} from "react";
import {Box, Stack, Typography} from "@mui/material";
import PropTypes from "prop-types";
import {MBreadcrumbs} from "components/@material-extend";
import {router} from "utils/index";
import {useLocation} from "react-router-dom";
import {splitNestedKeys} from "utils/router/helpers";
import {isEmpty} from "lodash";
import {useIntl} from "react-intl";

const HeaderBreadcrumbs = ({action, sx, ...other}) => {
    const {pathname} = useLocation();
    const intl = useIntl();

    const data = useMemo(() => {
        return router.getDataFromUrl(pathname);
    }, [pathname]);

    const links = useMemo(() => {
        return splitNestedKeys(data.key).map((k) => ({
            name: router.getName(k, intl),
            href: router.generatePath(k, data.params)
        }));
    }, [data, intl]);

    const actionContent = <Box sx={{flexShrink: 0}}>{action}</Box>;

    return (
        <Stack sx={sx} mb={5} spacing={2}>
            <Stack direction="row" alignItems="center">
                <Box sx={{flexGrow: 1}}>
                    <Typography variant="h4" gutterBottom>
                        {router.getName(data.key, intl)}
                    </Typography>

                    {!isEmpty(links) && (
                        <MBreadcrumbs links={links} {...other} />
                    )}
                </Box>

                {action && actionContent}
            </Stack>
        </Stack>
    );
};

HeaderBreadcrumbs.propTypes = {
    action: PropTypes.node,
    sx: PropTypes.object
};

export default HeaderBreadcrumbs;
