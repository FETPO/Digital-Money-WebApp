import React, {useRef, useEffect} from "react";
import {Box} from "@mui/material";

const TrapScrollBox = (props) => {
    const ref = useRef();

    useEffect(() => {
        const trapScroll = (e) => e.stopPropagation();
        const element = ref.current;
        const options = {passive: true};

        const unsubscribe = () => {
            element?.removeEventListener("touchend", trapScroll, options);
            element?.removeEventListener("touchstart", trapScroll, options);
            element?.removeEventListener("touchmove", trapScroll, options);
        };

        element?.addEventListener("touchend", trapScroll, options);
        element?.addEventListener("touchstart", trapScroll, options);
        element?.addEventListener("touchmove", trapScroll, options);

        return unsubscribe;
    }, []);

    return <Box {...props} ref={ref} />;
};

export default TrapScrollBox;
