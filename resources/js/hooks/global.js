import {useSelector} from "react-redux";
import {get} from "lodash";

export function useWallets() {
    const {data, loading} = useSelector((state) => {
        return get(state, "global.wallets");
    });
    return {wallets: data, loading};
}

export function useSupportedCurrencies() {
    const {data, loading} = useSelector((state) => {
        return get(state, "global.supportedCurrencies");
    });
    return {currencies: data, loading};
}

export function useOperatingCountries() {
    const {data, loading} = useSelector((state) => {
        return get(state, "global.operatingCountries");
    });
    return {countries: data, loading};
}

export function useCountries() {
    const {data, loading} = useSelector((state) => {
        return get(state, "global.countries");
    });
    return {countries: data, loading};
}
