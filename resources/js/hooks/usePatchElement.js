import {useCallback, useState} from "react";

export function usePatchElement() {
    const [elements, setElements] = useState([]);
    const patchElement = useCallback((element) => {
        // append a new element to elements (and create a new ref)
        setElements((originElements) => [...originElements, element]);
        // return a function that removes the new element out of elements (and create a new ref)
        // it works a little like useEffect
        return () => {
            setElements((originElements) =>
                originElements.filter((ele) => ele !== element)
            );
        };
    }, []);
    return [elements, patchElement];
}
