import React, {forwardRef, useMemo} from "react";
import PropTypes from "prop-types";
import {Helmet} from "react-helmet-async";
import {Box} from "@mui/material";
import {useRouteMatch} from "react-router-dom";
import context from "context";
import {isNull} from "lodash";
import {router} from "utils/index";

const Page = forwardRef(({children, title, ...other}, ref) => {
    const adminMatch = useRouteMatch(router.getPath("admin"));

    const titleTemplate = useMemo(() => {
        const template = !isNull(adminMatch) ? "%s - Control Panel" : "%s";
        return `${template} | ${context.name}`;
    }, [adminMatch]);

    return (
        <Box ref={ref} {...other}>
            {title && (
                <Helmet titleTemplate={titleTemplate}>
                    <title>{title}</title>
                </Helmet>
            )}
            {children}
        </Box>
    );
});

Page.propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.string
};

export default Page;
