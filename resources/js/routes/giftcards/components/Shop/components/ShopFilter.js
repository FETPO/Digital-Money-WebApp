import React, {
    Fragment,
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import Scrollbar from "components/Scrollbar";
import {
    Badge,
    Button,
    Checkbox,
    Divider,
    Drawer,
    FormControlLabel,
    FormGroup,
    IconButton,
    Stack,
    Typography
} from "@mui/material";
import {FormattedMessage} from "react-intl";
import {errorHandler, route, useRequest} from "services/Http";
import Spin from "components/Spin";
import {isEmpty} from "lodash";

const ShopFilter = ({applyFilters}) => {
    const [request, loading] = useRequest();
    const [brands, setBrands] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const filters = [];

        if (!isEmpty(selectedBrands)) {
            filters.push({
                columnField: "brand_id",
                operatorValue: "in",
                value: selectedBrands
            });
        }

        applyFilters?.(filters);
    }, [applyFilters, selectedBrands]);

    const fetchBrands = useCallback(() => {
        request
            .get(route("giftcard.brand.all"))
            .then((data) => setBrands(data))
            .catch(errorHandler());
    }, [request]);

    useEffect(() => {
        fetchBrands();
    }, [fetchBrands]);

    const checkSelectedBrand = useCallback(
        (brand) => {
            return selectedBrands.indexOf(brand.id) !== -1;
        },
        [selectedBrands]
    );

    const selectBrand = (brand) => {
        setSelectedBrands((state) => {
            const selection = [...state];
            const index = selection.findIndex((v) => v === brand.id);
            if (index === -1) {
                selection.push(brand.id);
            } else {
                selection.splice(index, 1);
            }
            return selection;
        });
    };

    const renderBrand = (brand) => (
        <FormControlLabel
            key={brand.id}
            label={brand.name}
            control={
                <Checkbox
                    checked={checkSelectedBrand(brand)}
                    onChange={() => selectBrand(brand)}
                />
            }
        />
    );

    const clearFilter = useCallback(() => {
        setSelectedBrands([]);
    }, []);

    const filtered = useMemo(() => {
        return !isEmpty(selectedBrands);
    }, [selectedBrands]);

    return (
        <Fragment>
            <Button
                disableRipple
                onClick={() => setOpen(true)}
                color="inherit"
                endIcon={
                    <Badge color="primary" invisible={!filtered} variant="dot">
                        <FilterListIcon />
                    </Badge>
                }>
                <FormattedMessage defaultMessage="Filters" />
            </Button>

            <Drawer
                anchor="right"
                onClose={() => setOpen(false)}
                open={open}
                PaperProps={{
                    sx: {width: 280, overflow: "hidden"}
                }}>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{px: 1, py: 2}}>
                    <Typography variant="subtitle1" sx={{ml: 1}}>
                        <FormattedMessage defaultMessage="Filters" />
                    </Typography>
                    <IconButton onClick={() => setOpen(false)}>
                        <CloseIcon />
                    </IconButton>
                </Stack>

                <Divider />

                <Scrollbar sx={{p: 3}}>
                    <Spin spinning={loading}>
                        <Stack spacing={3}>
                            <Stack spacing={1}>
                                <Typography variant="subtitle1">
                                    <FormattedMessage defaultMessage="Brands" />
                                </Typography>

                                <FormGroup>{brands.map(renderBrand)}</FormGroup>
                            </Stack>
                        </Stack>
                    </Spin>
                </Scrollbar>

                <Stack sx={{p: 3}}>
                    <Button
                        size="large"
                        onClick={clearFilter}
                        color="inherit"
                        variant="outlined"
                        fullWidth>
                        <FormattedMessage defaultMessage="Clear Filter" />
                    </Button>
                </Stack>
            </Drawer>
        </Fragment>
    );
};

export default ShopFilter;
