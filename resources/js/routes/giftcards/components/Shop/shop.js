import React, {Fragment, useCallback, useRef} from "react";
import {Grid, Skeleton, Stack} from "@mui/material";
import {route} from "services/Http";
import InfiniteLoader from "components/InfiniteLoader";
import ShopItem from "./components/ShopItem";
import ShopFilter from "./components/ShopFilter";
import ShopSorter from "./components/ShopSorter";
import ShopCart from "./components/ShopCart";
import {FormattedMessage} from "react-intl";
import Result from "components/Result";

const Shop = () => {
    const loaderRef = useRef();

    const applyFilters = useCallback((filters) => {
        loaderRef.current?.applyFilters(filters);
    }, []);

    const applySorters = useCallback((sorters) => {
        loaderRef.current?.applySorters(sorters);
    }, []);

    return (
        <Fragment>
            <Stack
                direction="row"
                justifyContent="flex-end"
                flexWrap="wrap-reverse"
                spacing={1}
                alignItems="center"
                sx={{mb: 5}}>
                <ShopFilter applyFilters={applyFilters} />
                <ShopSorter applySorters={applySorters} />
            </Stack>

            <Grid container spacing={3}>
                <InfiniteLoader
                    url={route("giftcard.paginate")}
                    ref={loaderRef}
                    renderItem={(item) => (
                        <ShopItem key={item.id} item={item} />
                    )}
                    renderEmpty={() => (
                        <Grid item xs={12}>
                            <Result
                                title={
                                    <FormattedMessage defaultMessage="No giftcards yet." />
                                }
                                description={
                                    <FormattedMessage defaultMessage="We are working on it, please check back later." />
                                }
                            />
                        </Grid>
                    )}
                    renderSkeleton={(sentryRef) => (
                        <LoaderSkeleton sentryRef={sentryRef} />
                    )}
                />
            </Grid>

            <ShopCart />
        </Fragment>
    );
};

const LoaderSkeleton = ({sentryRef}) => {
    const grid = {xs: 6, sm: 4, md: 3};

    const skeleton = (
        <Skeleton
            variant="rectangular"
            sx={{paddingTop: "115%", borderRadius: 2}}
            width="100%"
        />
    );

    return (
        <Fragment>
            <Grid item {...grid} ref={sentryRef}>
                {skeleton}
            </Grid>
            {[...Array(3)].map((_, index) => (
                <Grid item {...grid} key={index}>
                    {skeleton}
                </Grid>
            ))}
        </Fragment>
    );
};

export default Shop;
