import React, {
    forwardRef,
    Fragment,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useState
} from "react";
import useInfiniteScroll from "react-infinite-scroll-hook";
import {errorHandler, useRequest} from "services/Http";
import {defaultTo, get, isEmpty} from "lodash";

const InfiniteLoader = forwardRef((props, ref) => {
    const {
        url,
        setRootRef,
        initialPageSize = 10,
        getItemId = (row) => row.id,
        renderItem,
        renderSkeleton,
        renderEmpty
    } = props;

    const [request, loading] = useRequest();
    const [pageSize] = useState(initialPageSize);
    const [page, setPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [items, setItems] = useState([]);
    const [filters, setFilters] = useState([]);
    const [sorters, setSorters] = useState([]);
    const [search, setSearch] = useState({});

    const fetchItems = useCallback(() => {
        request
            .post(url, {
                page,
                itemPerPage: pageSize,
                filters,
                sorters,
                search
            })
            .then((response) => {
                setItems((items) => {
                    const data = get(response, "data", []);
                    return page !== 1 ? items.concat(data) : data;
                });

                setHasNextPage(() => {
                    const currentPage = defaultTo(
                        get(response, "meta.current_page"),
                        get(response, "current_page")
                    );

                    const lastPage = defaultTo(
                        get(response, "meta.last_page"),
                        get(response, "last_page")
                    );

                    return currentPage < lastPage;
                });
            })
            .catch(errorHandler());
    }, [request, page, pageSize, filters, sorters, search, url]);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    useImperativeHandle(ref, () => {
        return {
            resetPage() {
                if (page !== 1) {
                    setPage(1);
                } else {
                    fetchItems();
                }
            },

            applyFilters(filters) {
                setFilters(filters);
                setPage(1);
            },

            applySorters(sorters) {
                setSorters(sorters);
                setPage(1);
            },

            applySearch(search) {
                setSearch((state) => ({...state, ...search}));
                setPage(1);
            },

            clearSearch() {
                setSearch({});
                setPage(1);
            }
        };
    });

    const updateHandler = useCallback(
        (item) => {
            return (newItem) => {
                setItems((state) => {
                    const items = [...state];

                    const index = items.findIndex((o) => {
                        return getItemId(o) === getItemId(item);
                    });

                    if (index >= 0) {
                        items.splice(index, 1, newItem);
                    }
                    return items;
                });
            };
        },
        [getItemId]
    );

    const deleteHandler = useCallback(
        (item) => {
            return () => {
                setItems((state) => {
                    const items = [...state];

                    const index = items.findIndex((o) => {
                        return getItemId(o) === getItemId(item);
                    });

                    if (index >= 0) {
                        items.splice(index, 1);
                    }
                    return items;
                });
            };
        },
        [getItemId]
    );

    const onLoadMore = useCallback(() => {
        setPage((page) => page + 1);
    }, []);

    const options = useMemo(
        () => ({
            loading,
            hasNextPage,
            onLoadMore
        }),
        [loading, hasNextPage, onLoadMore]
    );

    const [sentryRef, {rootRef}] = useInfiniteScroll(options);

    useEffect(() => {
        setRootRef?.(rootRef);
    }, [rootRef, setRootRef]);

    const withSentry = loading || hasNextPage;
    const empty = !withSentry && isEmpty(items);

    return (
        <Fragment>
            {items.map((item) => {
                return renderItem?.(
                    item,
                    updateHandler(item),
                    deleteHandler(item)
                );
            })}

            {withSentry && renderSkeleton?.(sentryRef)}

            {empty && renderEmpty?.()}
        </Fragment>
    );
});

export default InfiniteLoader;
