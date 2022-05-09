import React from "react";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import {SettingsProvider} from "contexts/SettingsContext";
import ThemeConfig from "theme";
import PropTypes from "prop-types";
import NotistackProvider from "../NotistackProvider";
import RtlLayout from "../RtlLayout";
import DayjsAdapter from "@mui/lab/AdapterDayjs";
import {dayjs} from "utils/index";

const MuiBootstrap = ({children}) => {
    return (
        <LocalizationProvider
            dateAdapter={DayjsAdapter}
            dateLibInstance={dayjs}
            locale={"en"}>
            <SettingsProvider>
                <ThemeConfig>
                    <RtlLayout>
                        <NotistackProvider>{children}</NotistackProvider>
                    </RtlLayout>
                </ThemeConfig>
            </SettingsProvider>
        </LocalizationProvider>
    );
};

MuiBootstrap.propTypes = {children: PropTypes.node};

export default MuiBootstrap;
