import React, {useMemo} from "react";
import PageTabs from "components/PageTabs";
import {defineMessages, useIntl} from "react-intl";
import paintBrush from "@iconify-icons/ri/paint-brush-fill";
import copyright from "@iconify-icons/ri/copyright-fill";
import Theme from "./components/Theme";
import Brand from "./components/Brand";

const messages = defineMessages({
    title: {defaultMessage: "Customize"},
    brand: {defaultMessage: "Brand"},
    theme: {defaultMessage: "Theme"}
});

const Customize = () => {
    const intl = useIntl();

    const tabs = useMemo(() => {
        return [
            {
                value: "theme",
                label: intl.formatMessage(messages.theme),
                icon: paintBrush,
                component: <Theme />
            },
            {
                value: "brand",
                label: intl.formatMessage(messages.brand),
                icon: copyright,
                component: <Brand />
            }
        ];
    }, [intl]);

    return (
        <PageTabs
            initial="theme"
            title={intl.formatMessage(messages.title)}
            tabs={tabs}
        />
    );
};

export default Customize;
