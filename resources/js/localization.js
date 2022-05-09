import React, {useEffect} from "react";
import {IntlProvider} from "react-intl";
import {get} from "lodash";
import {useDispatch, useSelector} from "react-redux";
import {fetchLocale} from "redux/slices/settings";
import Bootstrap from "./bootstrap";
import {useInstaller} from "hooks/settings";

const Localization = () => {
    const installer = useInstaller();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!installer) {
            dispatch(fetchLocale());
        }
    }, [dispatch, installer]);

    const {messages, locale} = useSelector((state) => {
        return get(state, "settings.locale.data");
    });

    return (
        <IntlProvider messages={messages} locale={locale}>
            <Bootstrap />
        </IntlProvider>
    );
};

export default Localization;
