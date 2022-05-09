import React, {useCallback, useEffect, useState} from "react";
import {Alert, Box, Button, Chip, Grid, Stack, Typography} from "@mui/material";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import {isEmpty, lowerCase} from "lodash";
import AddIcon from "@mui/icons-material/Add";
import {useModal} from "utils/modal";
import Form, {Checkbox, TextField} from "components/Form";
import {errorHandler, route, useFormRequest, useRequest} from "services/Http";
import {notify} from "utils/index";
import Spin from "components/Spin";
import {LoadingButton} from "@mui/lab";
import {StyledToolbar} from "styles/toolbar.style";
import SearchTextField from "components/SearchTextField";

const messages = defineMessages({
    name: {defaultMessage: "Name"},
    rank: {defaultMessage: "Rank"},
    success: {defaultMessage: "Role was created"},
    searchPlaceholder: {defaultMessage: "Search name..."},
    createRole: {defaultMessage: "Create Role"}
});

const ActionBar = ({search, reloadTable, onSearchChange}) => {
    const intl = useIntl();
    const [modal, modalElements] = useModal();

    const createRole = useCallback(() => {
        modal.confirm({
            title: intl.formatMessage(messages.createRole),
            content: <CreateForm reloadTable={reloadTable} />,
            rootProps: {fullWidth: true}
        });
    }, [modal, intl, reloadTable]);

    return (
        <StyledToolbar>
            <SearchTextField
                onSearchChange={onSearchChange}
                search={search}
                placeholder={intl.formatMessage(messages.searchPlaceholder)}
                sx={{mr: 2}}
            />

            {modalElements}

            <Stack direction="row" alignItems="center" spacing={1}>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={createRole}>
                    <FormattedMessage defaultMessage="Create" />
                </Button>
            </Stack>
        </StyledToolbar>
    );
};

const CreateForm = ({closeModal, reloadTable}) => {
    const [form] = Form.useForm();
    const intl = useIntl();
    const [permissions, setPermissions] = useState([]);
    const [formRequest, formLoading] = useFormRequest(form);
    const [request, loading] = useRequest();

    const fetchPermissions = useCallback(() => {
        request
            .get(route("admin.role.get-permissions"))
            .then((data) => setPermissions(data))
            .catch(errorHandler());
    }, [request]);

    useEffect(() => {
        fetchPermissions();
    }, [fetchPermissions]);

    const submitForm = useCallback(
        (values) => {
            formRequest
                .post(route("admin.role.create"), values)
                .then(() => {
                    reloadTable?.();
                    notify.success(intl.formatMessage(messages.success));
                    closeModal?.();
                })
                .catch(errorHandler());
        },
        [closeModal, formRequest, intl, reloadTable]
    );

    return (
        <Form form={form} onFinish={submitForm}>
            <Spin spinning={loading}>
                <Grid container spacing={1}>
                    <Grid item xs={8}>
                        <Form.Item
                            name="name"
                            label={intl.formatMessage(messages.name)}
                            rules={[{required: true}]}>
                            <TextField fullWidth />
                        </Form.Item>
                    </Grid>
                    <Grid item xs={4}>
                        <Form.Item
                            name="rank"
                            label={intl.formatMessage(messages.rank)}
                            rules={[{required: true, type: "number"}]}
                            normalize={(v) => parseInt(v) || 0}>
                            <TextField fullWidth />
                        </Form.Item>
                    </Grid>
                </Grid>

                <Alert severity="info" sx={{mt: 1}}>
                    <FormattedMessage defaultMessage="Rank is used to set the priority of roles, with the lesser value having greater priority." />
                </Alert>

                {!isEmpty(permissions) && (
                    <Stack spacing={1} sx={{mt: 3}}>
                        <Typography
                            sx={{color: "text.secondary"}}
                            variant="overline">
                            <FormattedMessage defaultMessage="Permissions" />
                        </Typography>
                        <Box>
                            {permissions.map((p) => (
                                <Grid key={p.id} container spacing={1}>
                                    <Grid item xs={8}>
                                        <Chip
                                            label={lowerCase(p.name)}
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Form.Item
                                            valuePropName="checked"
                                            name={["permissions", p.name]}>
                                            <Checkbox />
                                        </Form.Item>
                                    </Grid>
                                </Grid>
                            ))}
                        </Box>
                    </Stack>
                )}

                <Stack direction="row" justifyContent="flex-end" sx={{my: 2}}>
                    <LoadingButton
                        variant="contained"
                        disabled={loading}
                        type="submit"
                        loading={formLoading}>
                        <FormattedMessage defaultMessage="Submit" />
                    </LoadingButton>
                </Stack>
            </Spin>
        </Form>
    );
};

export default ActionBar;
