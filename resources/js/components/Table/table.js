import React, {useMemo} from "react";
import {DataGrid} from "@mui/x-data-grid";
import {isUndefined} from "lodash";
import {useTheme} from "@mui/material/styles";

const Table = ({
    rows = [],
    rowHeight = 70,
    pageSize = 10,
    rowsPerPageOptions = [10, 25, 50],
    columns = [],
    ...props
}) => {
    const theme = useTheme();

    columns = useMemo(() => {
        return columns.map((column) => {
            const newColumn = {...column};

            if (isUndefined(column.filterable)) {
                newColumn.filterable = false;
            }

            if (isUndefined(column.sortable)) {
                newColumn.sortable = false;
            }

            if (isUndefined(column.disableColumnMenu)) {
                newColumn.disableColumnMenu = !newColumn.filterable;
            }

            return newColumn;
        });
    }, [columns]);

    return (
        <DataGrid
            autoHeight
            pageSize={pageSize}
            rows={rows}
            columns={columns}
            rowHeight={rowHeight}
            rowsPerPageOptions={rowsPerPageOptions}
            hideFooter={rows.length <= pageSize}
            disableColumnSelector
            disableSelectionOnClick
            disableDensitySelector
            componentsProps={{
                loadingOverlay: {
                    style: {
                        zIndex: 3,
                        background: theme.palette.background.default,
                        opacity: 0.5
                    }
                }
            }}
            {...props}
        />
    );
};

export default Table;
