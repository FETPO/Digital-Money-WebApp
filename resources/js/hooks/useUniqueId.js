import {useCallback, useState} from "react";
import {uniqueId} from "lodash";

export function useUniqueId(prefix = "unique_") {
    const [id, setId] = useState(() => {
        return uniqueId(prefix);
    });

    const generator = useCallback(
        (name) => {
            return name ? `${id}_${name}` : id;
        },
        [id]
    );

    const setPrefix = useCallback((prefix) => {
        setId(uniqueId(prefix));
    }, []);

    return [generator, setPrefix];
}
