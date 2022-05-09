import {useEffect, useState, useCallback} from "react";
import {isFunction} from "lodash";

export default function useSessionStorage(key, defaultValue) {
    const [value, setValue] = useState(() => {
        const storedValue = sessionStorage.getItem(key);
        return !storedValue ? defaultValue : JSON.parse(storedValue);
    });

    useEffect(() => {
        const listener = (e) => {
            if (e.storageArea === sessionStorage && e.key === key) {
                setValue(JSON.parse(e.newValue));
            }
        };
        window.addEventListener("storage", listener);

        return () => {
            window.removeEventListener("storage", listener);
        };
    }, [key, defaultValue]);

    const setValueInSessionStorage = useCallback(
        (value) => {
            setValue((currentValue) => {
                const result = isFunction(value) ? value(currentValue) : value;
                sessionStorage.setItem(key, JSON.stringify(result));
                return result;
            });
        },
        [key]
    );

    return [value, setValueInSessionStorage];
}
