import React, {
    useRef,
    forwardRef,
    useCallback,
    useEffect,
    useState,
    useImperativeHandle
} from "react";
import {Box} from "@mui/material";

const GridItem = forwardRef((props, ref) => {
    const [height, setHeight] = useState();
    const {component: GridComponent, ...otherProps} = props;
    const baseRef = useRef();

    const calculateHeight = useCallback(() => {
        setHeight(baseRef.current?.clientHeight);
    }, []);

    useEffect(() => {
        calculateHeight();
    }, [calculateHeight]);

    useImperativeHandle(ref, () => baseRef.current, []);

    return (
        <Box ref={baseRef} {...otherProps}>
            <GridComponent height={height} />
        </Box>
    );
});

export default GridItem;
