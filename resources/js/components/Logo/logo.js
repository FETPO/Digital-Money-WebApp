import React from "react";
import PropTypes from "prop-types";
import {useTheme} from "@mui/material/styles";
import {Box} from "@mui/material";
import {Link as RouterLink} from "react-router-dom";
import {useBrand} from "hooks/settings";

function Logo({sx, to}) {
    const theme = useTheme();
    const PRIMARY_LIGHT = theme.palette.primary.light;
    const PRIMARY_MAIN = theme.palette.primary.main;

    const brand = useBrand();

    if (brand.logoUrl) {
        return (
            <RouterLink to={to}>
                <Box
                    component="img"
                    alt="logo"
                    src={brand.logoUrl}
                    sx={{
                        width: 35,
                        display: "inline-block",
                        height: 35,
                        ...sx
                    }}
                />
            </RouterLink>
        );
    }

    return (
        <RouterLink to={to}>
            <Box
                sx={{
                    display: "inline-block",
                    width: 35,
                    height: 35,
                    ...sx
                }}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="100%"
                    height="100%"
                    viewBox="0 0 542.83 539.91">
                    <defs>
                        <linearGradient
                            id="linear-gradient"
                            x1="-93511.54"
                            y1="-86292.06"
                            x2="-58442.32"
                            y2="-121361.29"
                            gradientTransform="matrix(0.01, 0, 0, -0.01, 1321.69, -859.4)"
                            gradientUnits="userSpaceOnUse">
                            <stop offset="0" stopColor={PRIMARY_LIGHT} />
                            <stop offset="1" stopColor={PRIMARY_MAIN} />
                        </linearGradient>
                        <linearGradient
                            id="linear-gradient-2"
                            x1="-98695.75"
                            y1="-100343.56"
                            x2="-93414.54"
                            y2="-105624.78"
                            gradientTransform="matrix(0.01, 0, 0, -0.01, 1321.69, -859.4)"
                            gradientUnits="userSpaceOnUse">
                            <stop offset="0" stopColor={PRIMARY_LIGHT} />
                            <stop offset="1" stopColor={PRIMARY_MAIN} />
                        </linearGradient>
                    </defs>
                    <g>
                        <path
                            d="M389.46,114.05c149.08,0,270,120.86,270,270S538.56,654,389.46,654a269.88,269.88,0,0,1-237-140.63,36.4,36.4,0,0,1,32-53.86h4.33a35.55,35.55,0,0,1,31.77,18.66,193.43,193.43,0,0,0,339.13-2.2,36.39,36.39,0,0,0-32-53.72h-4.33a35.58,35.58,0,0,0-31.8,18.65,116.8,116.8,0,1,1,0-113.7,35.59,35.59,0,0,0,31.8,18.66h4.33a36.4,36.4,0,0,0,32-53.73,193.44,193.44,0,0,0-339.13-2.2,35.56,35.56,0,0,1-31.77,18.66H184.4a36.39,36.39,0,0,1-32-53.85,269.87,269.87,0,0,1,237-140.64Z"
                            transform="translate(-116.59 -114.05)"
                            fill="url(#linear-gradient)"
                        />
                        <path
                            d="M156.71,343.88A40.12,40.12,0,1,1,116.59,384,40.13,40.13,0,0,1,156.71,343.88Z"
                            transform="translate(-116.59 -114.05)"
                            fill="url(#linear-gradient-2)"
                        />
                    </g>
                </svg>
            </Box>
        </RouterLink>
    );
}

Logo.propTypes = {sx: PropTypes.object};

export default Logo;
