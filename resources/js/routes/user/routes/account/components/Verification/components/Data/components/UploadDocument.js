import React, {useCallback} from "react";
import {route} from "services/Http";
import UploadFile from "components/UploadFile";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Chip,
    Stack,
    Typography
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {defineMessages, useIntl} from "react-intl";

const messages = defineMessages({
    required: {defaultMessage: "Required"},
    pending: {defaultMessage: "Pending"},
    approved: {defaultMessage: "Approved"},
    rejected: {defaultMessage: "Rejected"},
    data: {defaultMessage: "Data"}
});

const UploadDocument = ({data, expanded, expandedHandler, onChange}) => {
    const intl = useIntl();
    const action = route("user.verification.upload-document");

    const getStatusChip = useCallback(
        (status) => {
            switch (status) {
                case "pending":
                    return (
                        <Chip
                            size="small"
                            label={intl.formatMessage(messages.pending)}
                            color="info"
                        />
                    );
                case "approved":
                    return (
                        <Chip
                            size="small"
                            label={intl.formatMessage(messages.approved)}
                            color="primary"
                        />
                    );
                case "rejected":
                    return (
                        <Chip
                            size="small"
                            label={intl.formatMessage(messages.rejected)}
                            color="error"
                        />
                    );
                default:
                    return (
                        <Chip
                            label={intl.formatMessage(messages.required)}
                            size="small"
                        />
                    );
            }
        },
        [intl]
    );

    const isDisabled = useCallback((status) => {
        return ["pending", "approved"].includes(status);
    }, []);

    return data.records?.map((record, key) => {
        const disabled = isDisabled(record.document?.status);
        key = `document_${key}`;
        return (
            <Accordion
                key={key}
                onChange={expandedHandler(key)}
                disabled={disabled}
                expanded={!disabled && expanded === key}
                className="no-border">
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Stack direction="row" spacing={3}>
                        {getStatusChip(record.document?.status)}
                        <span>{record.requirement.name}</span>
                    </Stack>
                </AccordionSummary>

                <AccordionDetails>
                    <Stack spacing={2}>
                        <Typography
                            variant="body2"
                            sx={{color: "text.secondary"}}>
                            {record.requirement.description}
                        </Typography>

                        <UploadFile
                            action={action}
                            data={{requirement: record.requirement.id}}
                            name="data"
                            onSuccess={onChange}
                            maxSize={5120}
                        />
                    </Stack>
                </AccordionDetails>
            </Accordion>
        );
    });
};

export default UploadDocument;
