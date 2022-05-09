import React, {useCallback, useMemo} from "react";
import {Responsive} from "react-grid-layout";
import {forEach, forOwn, isFunction, mapValues, omit} from "lodash";
import {breakpoints, cols, rowHeight} from "utils/grid";
import {withSize} from "react-sizeme";

const GridLayout = ({
    children,
    dimensions,
    isDraggable,
    isResizable,
    onDimensionChange,
    size,
    margin = [10, 15]
}) => {
    const convertToLayouts = useCallback((dimensions) => {
        const result = mapValues(breakpoints, () => []);

        forOwn(dimensions, (dimension, i) => {
            forEach(dimension, (o) => {
                const props = omit(o, ["breakpoint"]);
                result[o.breakpoint].push({i, ...props});
            });
        });
        return result;
    }, []);

    const convertToDimensions = useCallback(
        (layouts) => {
            const result = mapValues(dimensions, () => []);

            forOwn(layouts, (layout, breakpoint) => {
                forEach(layout, (o) => {
                    const props = omit(o, ["i"]);
                    result[o.i].push({breakpoint, ...props});
                });
            });
            return result;
        },
        [dimensions]
    );

    const layouts = useMemo(() => {
        return convertToLayouts(dimensions);
    }, [convertToLayouts, dimensions]);

    const handleLayoutChange = useCallback(
        (current, all) => {
            if (isFunction(onDimensionChange)) {
                const dimensions = convertToDimensions(all);
                return onDimensionChange(dimensions);
            }
        },
        [onDimensionChange, convertToDimensions]
    );

    return (
        <Responsive
            rowHeight={rowHeight}
            margin={margin}
            isDraggable={isDraggable}
            isResizable={isResizable}
            onLayoutChange={handleLayoutChange}
            width={size.width}
            cols={cols}
            breakpoints={breakpoints}
            layouts={layouts}>
            {children}
        </Responsive>
    );
};

export default withSize()(GridLayout);
