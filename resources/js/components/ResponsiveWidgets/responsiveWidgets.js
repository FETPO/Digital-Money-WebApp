import React, {useCallback, useEffect, useMemo, useState} from "react";
import {errorHandler, route, useRequest} from "services/Http";
import {find, forEach, has, isEmpty, keyBy, mapValues, omit} from "lodash";
import {cols} from "utils/grid";
import {notify, pluck} from "utils";
import GridLayout from "components/GridLayout";
import {defineMessages, useIntl} from "react-intl";
import classNames from "classnames";
import {Box, Fab} from "@mui/material";
import Spin from "../Spin";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import {useAuth} from "models/Auth";
import GridItem from "./gridItem";

const messages = defineMessages({
    saved: {defaultMessage: "Grid data was saved."},
    save: {defaultMessage: "Save"},
    close: {defaultMessage: "Close"},
    edit: {defaultMessage: "Edit"}
});

const ResponsiveWidgets = ({widgets, page}) => {
    const [request, loading] = useRequest();
    const [dimensions, setDimensions] = useState({});
    const [dimensionsBackup, setDimensionsBackup] = useState({});
    const [editable, setEditable] = useState(false);
    const auth = useAuth();
    const intl = useIntl();

    const gridItems = useMemo(() => {
        return widgets
            .filter((widget) => {
                return has(dimensions, widget.name);
            })
            .map((widget) => (
                <GridItem
                    component={widget.component}
                    className={classNames({"editable-grid": editable})}
                    key={widget.name}
                />
            ));
    }, [dimensions, widgets, editable]);

    useEffect(() => {
        const createDimensions = (data) => {
            const widgetsByName = keyBy(widgets, "name");
            const posX = mapValues(cols, () => 0);
            const posY = mapValues(cols, () => 0);
            const posH = mapValues(cols, () => 0);

            const result = data
                .filter((o) => has(widgetsByName, o.name))
                .sort(sortSavedDimensions)
                .map((record) => {
                    const dimensions = [];
                    const widget = widgetsByName[record.name];

                    forEach(cols, (col, k) => {
                        const savedDimension = find(
                            record.dimensions,
                            (d) => k === d.breakpoint
                        );

                        const widgetDimension = widget.dimensions[k];

                        const dimension = {
                            breakpoint: k,
                            ...omit(widgetDimension, ["x", "y"]),
                            ...savedDimension
                        };

                        dimension.w = Math.min(dimension.w, col);

                        if (isEmpty(savedDimension)) {
                            if (posX[k] + dimension.w <= col) {
                                dimension.x = posX[k];
                                dimension.y = posY[k];
                            } else {
                                dimension.x = 0;
                                dimension.y = posY[k] + posH[k];
                            }
                        }

                        posX[k] = dimension.x + dimension.w;
                        posY[k] = dimension.y;

                        if (dimension.x !== 0) {
                            posH[k] = Math.max(posH[k], dimension.h);
                        } else {
                            posH[k] = dimension.h;
                        }

                        dimensions.push(dimension);
                    });

                    return {name: record.name, dimensions};
                });

            return pluck(result, "dimensions", "name");
        };

        request
            .post(route("grid.all"), {page})
            .then((data) => setDimensions(createDimensions(data)))
            .catch(errorHandler());
    }, [request, widgets, page]);

    const handleDimensionChange = useCallback((value) => {
        setDimensions(value);
    }, []);

    const edit = useCallback(() => {
        setEditable(true);
        setDimensionsBackup(dimensions);
    }, [dimensions]);

    const reset = useCallback(() => {
        setEditable(false);
        setDimensions(dimensionsBackup);
    }, [dimensionsBackup]);

    const save = useCallback(() => {
        request
            .post(route("grid.set-dimensions"), {dimensions, page})
            .then(() => {
                setEditable(false);
                notify.success(intl.formatMessage(messages.saved));
            })
            .catch(errorHandler());
    }, [request, dimensions, intl, page]);

    return (
        <React.Fragment>
            <Spin spinning={loading}>
                <GridLayout
                    dimensions={dimensions}
                    margin={[16, 24]}
                    onDimensionChange={handleDimensionChange}
                    isDraggable={editable}
                    isResizable={editable}>
                    {gridItems}
                </GridLayout>
            </Spin>

            {auth.can("manage_customization") && (
                <Box sx={{bottom: 16, position: "fixed", right: 16}}>
                    {editable ? (
                        [
                            <Fab
                                key="save"
                                color="primary"
                                sx={{m: 1}}
                                onClick={save}>
                                <SaveIcon />
                            </Fab>,
                            <Fab
                                key="reset"
                                color="inherit"
                                sx={{m: 1}}
                                onClick={reset}>
                                <CloseIcon />
                            </Fab>
                        ]
                    ) : (
                        <Fab color="primary" sx={{m: 1}} onClick={edit}>
                            <EditIcon />
                        </Fab>
                    )}
                </Box>
            )}
        </React.Fragment>
    );
};

const sortSavedDimensions = (a, b) => {
    if (isEmpty(a.dimensions) && !isEmpty(b.dimensions)) {
        return 1;
    }
    if (!isEmpty(a.dimensions) && isEmpty(b.dimensions)) {
        return -1;
    }
    return 0;
};

export default ResponsiveWidgets;
