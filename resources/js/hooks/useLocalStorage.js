import {isFunction} from "lodash";
import {useEffect, useState, useCallback} from "react";

export default function useLocalStorage(key, defaultValue) {
    const [value, setValue] = useState(() => {
        const storedValue = localStorage.getItem(key);
        return !storedValue ? defaultValue : JSON.parse(storedValue);
    });

    useEffect(() => {
        const listener = (e) => {
            if (e.storageArea === localStorage && e.key === key) {
                setValue(JSON.parse(e.newValue));
            }
        };
        window.addEventListener("storage", listener);

        return () => {
            window.removeEventListener("storage", listener);
        };
    }, [key, defaultValue]);

    const setValueInLocalStorage = useCallback(
        (value) => {
            setValue((currentValue) => {
                const result = isFunction(value) ? value(currentValue) : value;
                localStorage.setItem(key, JSON.stringify(result));
                return result;
            });
        },
        [key]
    );

    return [value, setValueInLocalStorage];
}
