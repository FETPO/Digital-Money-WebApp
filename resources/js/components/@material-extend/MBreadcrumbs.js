import React from "react";
import {last} from "lodash";
import PropTypes from "prop-types";
import {Link as RouterLink} from "react-router-dom";
import {Box, Breadcrumbs, Link, Typography} from "@mui/material";

function MBreadcrumbs({links, ...other}) {
    const lastKey = last(links).name;

    const separator = (
        <Box
            component="span"
            sx={{
                borderRadius: "50%",
                bgcolor: "text.disabled",
                width: 4,
                height: 4
            }}
        />
    );

    return (
        <Breadcrumbs separator={separator} {...other}>
            {links.map((link) => (
                <div key={link.name}>
                    {link.name !== lastKey ? (
                        <LinkItem link={link} />
                    ) : (
                        <Typography
                            variant="body2"
                            sx={{
                                maxWidth: 260,
                                textOverflow: "ellipsis",
                                overflow: "hidden",
                                color: "text.disabled",
                                whiteSpace: "nowrap"
                            }}>
                            {lastKey}
                        </Typography>
                    )}
                </div>
            ))}
        </Breadcrumbs>
    );
}

function LinkItem({link}) {
    return (
        <Link
            variant="body2"
            component={RouterLink}
            to={link.href}
            sx={{
                display: "flex",
                alignItems: "center",
                "& > div": {display: "inherit"},
                color: "text.primary",
                lineHeight: 2
            }}>
            {link.name}
        </Link>
    );
}

LinkItem.propTypes = {
    link: PropTypes.object
};

MBreadcrumbs.propTypes = {
    links: PropTypes.array.isRequired,
    activeLast: PropTypes.bool
};

export default MBreadcrumbs;
