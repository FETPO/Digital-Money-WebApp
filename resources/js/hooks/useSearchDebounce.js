import {useEffect, useMemo} from "react";
import {debounce} from "lodash";

export function useSearchDebounce(value, searchFunc, clearFunc) {
    const applySearch = useMemo(() => {
        return debounce(searchFunc, 500);
    }, [searchFunc]);

    const clearSearch = useMemo(() => {
        return debounce(clearFunc, 500);
    }, [clearFunc]);

    useEffect(() => {
        if (value) {
            applySearch(value);
        } else {
            clearSearch();
        }
    }, [value, applySearch, clearSearch]);
}
