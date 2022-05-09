import React, {useCallback, useEffect, useMemo, useState} from "react";
import HeaderBreadcrumbs from "components/HeaderBreadcrumbs";
import {
    Box,
    Button,
    Card,
    CardHeader,
    Container,
    MenuItem,
    Stack,
    Switch,
    TextField
} from "@mui/material";
import {errorHandler, route, useFormRequest, useRequest} from "services/Http";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import Table from "components/Table";
import FlagIcon from "components/FlagIcon";
import {notify} from "utils/index";
import EditIcon from "@mui/icons-material/Edit";
import {defaultTo, lowerCase} from "lodash";
import Form, {ControlLabel} from "components/Form";
import {LoadingButton} from "@mui/lab";
import Action from "./components/Action";
import LocaleDelete from "./components/LocaleDelete";
import TrapScrollBox from "components/TrapScrollBox";
import ImportExportIcon from "@mui/icons-material/ImportExport";

const messages = defineMessages({
    title: {defaultMessage: "Manage Locales"},
    name: {defaultMessage: "Name"},
    native: {defaultMessage: "Native"},
    code: {defaultMessage: "ISO-2 Code"},
    region: {defaultMessage: "Region"},
    addSuccess: {defaultMessage: "Locale was added."},
    importSuccess: {defaultMessage: "Import was successful."},
    removeSuccess: {defaultMessage: "Locale was removed."},
    addLocale: {defaultMessage: "Add Locale"},
    confirm: {defaultMessage: "Are you sure?"},
    selectGroup: {defaultMessage: "Select Group"},
    overwrite: {defaultMessage: "Overwrite"}
});

const ManageLocales = ({setGroup}) => {
    const [form] = Form.useForm();
    const [groups, setGroups] = useState([]);
    const intl = useIntl();
    const [selected, setSelected] = useState();
    const [request, loading] = useRequest();
    const [formRequest, formLoading] = useFormRequest(form);
    const [locales, setLocales] = useState([]);

    const fetchLocales = useCallback(() => {
        request
            .get(route("admin.locale.get"))
            .then((data) => {
                setGroups(data.groups);
                setLocales(data.locales);
            })
            .catch(errorHandler());
    }, [request]);

    useEffect(() => {
        fetchLocales();
    }, [fetchLocales]);

    const importGroups = useCallback(
        (values) => {
            formRequest
                .post(route("admin.locale.import"), values)
                .then(() => {
                    fetchLocales();
                    notify.success(intl.formatMessage(messages.importSuccess));
                })
                .catch(errorHandler());
        },
        [formRequest, intl, fetchLocales]
    );

    const columns = useMemo(
        () => [
            {
                field: "locale",
                width: 50,
                renderHeader: () => <span />
            },
            {
                field: "region",
                width: 50,
                renderHeader: () => <span />,
                renderCell: ({value}) => <FlagIcon code={value} />
            },
            {
                field: "name",
                minWidth: 100,
                flex: 1,
                headerName: intl.formatMessage(messages.name)
            },
            {
                field: "native",
                minWidth: 100,
                flex: 1,
                headerName: intl.formatMessage(messages.native)
            },
            {
                field: "action",
                minWidth: 100,
                flex: 0.5,
                headerAlign: "right",
                renderHeader: () => <span />,
                align: "right",
                renderCell: ({row: locale}) => (
                    <LocaleDelete reloadTable={fetchLocales} locale={locale} />
                )
            }
        ],
        [intl, fetchLocales]
    );

    const handleGroupSelect = useCallback((e) => {
        setSelected(e.target.value);
    }, []);

    const groupImport = (
        <Form form={form} onFinish={importGroups}>
            <Stack
                direction="row"
                justifyContent={{xs: "space-between", sm: "flex-end"}}
                alignItems="center"
                spacing={2}>
                <Form.Item
                    name="replace"
                    initialValue={false}
                    label={intl.formatMessage(messages.overwrite)}
                    valuePropName="checked">
                    <ControlLabel>
                        <Switch />
                    </ControlLabel>
                </Form.Item>

                <LoadingButton
                    variant="contained"
                    type="submit"
                    sx={{boxShadow: 0}}
                    startIcon={<ImportExportIcon />}
                    color="inherit"
                    loading={formLoading}>
                    <FormattedMessage defaultMessage="Import" />
                </LoadingButton>
            </Stack>
        </Form>
    );

    const groupSelect = (
        <Stack
            direction="row"
            justifyContent={{xs: "space-between", sm: "flex-end"}}
            spacing={2}>
            <TextField
                size="small"
                onChange={handleGroupSelect}
                label={intl.formatMessage(messages.selectGroup)}
                value={defaultTo(selected, "")}
                sx={{minWidth: 150}}
                select>
                {groups.map((group, key) => (
                    <MenuItem value={group} key={key}>
                        {lowerCase(group)}
                    </MenuItem>
                ))}
            </TextField>
            <Stack alignItems="center">
                <Button
                    variant="contained"
                    onClick={() => setGroup(selected)}
                    color="inherit"
                    sx={{boxShadow: 0, whiteSpace: "nowrap"}}
                    startIcon={<EditIcon />}>
                    <FormattedMessage defaultMessage="Edit" />
                </Button>
            </Stack>
        </Stack>
    );

    return (
        <Container>
            <HeaderBreadcrumbs />

            <Card>
                <CardHeader
                    title={intl.formatMessage(messages.title)}
                    action={<Action reloadTable={fetchLocales} />}
                />

                <TrapScrollBox sx={{pt: 3}}>
                    <Table
                        columns={columns}
                        getRowId={(row) => row.locale}
                        rows={locales}
                        loading={loading}
                    />
                </TrapScrollBox>

                <Box sx={{p: 4}}>
                    <Stack
                        justifyContent="flex-end"
                        direction={{xs: "column", sm: "row"}}
                        spacing={3}>
                        {groupImport}
                        {groupSelect}
                    </Stack>
                </Box>
            </Card>
        </Container>
    );
};

export default ManageLocales;
