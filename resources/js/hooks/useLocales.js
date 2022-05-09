import {useDispatch, useSelector} from "react-redux";
import {get} from "lodash";
import {useCallback} from "react";
import {updateLocale} from "redux/slices/settings";

export default function useLocales() {
    const dispatch = useDispatch();

    const locale = useSelector((state) => {
        return get(state, "settings.locale.data.locale");
    });

    const supported = useSelector((state) => {
        return get(state, "settings.supportedLocales");
    });

    const changeLocale = useCallback(
        (locale) => {
            dispatch(updateLocale(locale));
        },
        [dispatch]
    );

    return {
        onChangeLocale: changeLocale,
        currentLocale: supported[locale],
        supportedLocales: supported
    };
}
