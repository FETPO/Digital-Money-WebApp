import React, {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useState
} from "react";
import {errorHandler, useRequest} from "services/Http";
import {defaultTo, get, isUndefined} from "lodash";
import {DataGrid} from "@mui/x-data-grid";
import {useTheme} from "@mui/material/styles";

const AsyncTable = forwardRef((props, ref) => {
    const {
        url,
        autoHeight = true,
        getRowId = (row) => row.id,
        initialPageSize = 10,
        onDataChange,
        rowHeight = 70,
        rowsPerPageOptions = [10, 25, 50],
        columns: baseColumns = [],
        ...otherProps
    } = props;

    const theme = useTheme();
    const [request, loading] = useRequest();
    const [pageSize, setPageSize] = useState(initialPageSize);
    const [page, setPage] = useState(0);
    const [rowCount, setRowCount] = useState(0);
    const [search, setSearch] = useState({});
    const [filters, setFilters] = useState([]);
    const [data, setData] = useState([]);

    useEffect(() => {
        onDataChange?.(data);
    }, [onDataChange, data]);

    const columns = useMemo(() => {
        return baseColumns.map((column) => {
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
    }, [baseColumns]);

    const fetchData = useCallback(() => {
        request
            .post(url, {
                page: page + 1,
                itemPerPage: pageSize,
                filters,
                search
            })
            .then((response) => {
                setData(response.data);
                setRowCount(
                    defaultTo(
                        get(response, "meta.total"),
                        get(response, "total")
                    )
                );
            })
            .catch(errorHandler());
    }, [request, page, pageSize, filters, search, url]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useImperativeHandle(ref, () => {
        return {
            resetPage() {
                setPage(0);
            },

            fetchData() {
                fetchData();
            },

            applySearch(search) {
                setSearch((state) => ({...state, ...search}));
                setPage(0);
            },

            clearSearch() {
                setSearch({});
                setPage(0);
            }
        };
    });

    const handleFilterChange = useCallback((filterModel) => {
        setFilters(filterModel?.items);
    }, []);

    const handlePageChange = useCallback((page) => {
        setPage(page);
    }, []);

    const handlePageSizeChange = useCallback((pageSize) => {
        setPageSize(pageSize);
    }, []);

    return (
        <DataGrid
            autoHeight={autoHeight}
            {...otherProps}
            rowHeight={rowHeight}
            getRowId={getRowId}
            rows={data}
            columns={columns}
            filterMode="server"
            onFilterModelChange={handleFilterChange}
            rowsPerPageOptions={rowsPerPageOptions}
            disableColumnSelector
            disableSelectionOnClick
            disableDensitySelector
            loading={loading}
            componentsProps={{
                loadingOverlay: {
                    style: {
                        zIndex: 3,
                        background: theme.palette.background.default,
                        opacity: 0.5
                    }
                }
            }}
            pagination
            paginationMode="server"
            pageSize={pageSize}
            onPageSizeChange={handlePageSizeChange}
            page={page}
            onPageChange={handlePageChange}
            rowCount={rowCount}
        />
    );
});

export default AsyncTable;
