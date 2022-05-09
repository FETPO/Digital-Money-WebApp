import React, {useState} from "react";
import {
    Box,
    CircularProgress,
    FormHelperText,
    LinearProgress,
    List,
    ListItem,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    Typography
} from "@mui/material";
import {useUploadRequest} from "services/Http";
import {defineMessages, FormattedMessage, useIntl} from "react-intl";
import FileValidator from "utils/classes/FileValidator";
import {notify} from "utils/index";
import {isEmpty} from "lodash";
import {AnimatePresence, motion} from "framer-motion";
import Upload from "rc-upload";
import {UploadIllustration} from "assets/index";
import {varFadeIn} from "components/Animate";
import {Icon} from "@iconify/react";
import fileTextFill from "@iconify/icons-eva/file-text-fill";
import checkboxCircleFill from "@iconify-icons/ri/checkbox-circle-fill";
import closeCircleFill from "@iconify-icons/ri/close-circle-fill";
import {experimentalStyled as styled} from "@mui/material/styles";
import {formatData} from "utils/formatter";

const messages = defineMessages({
    uploaded: {defaultMessage: "File was uploaded."}
});

const UploadFile = ({
    name = "file",
    action,
    data,
    minSize = 0,
    maxSize = 10240,
    mimeTypes,
    onSuccess,
    onError,
    caption,
    sx,
    multiple = false
}) => {
    const intl = useIntl();
    const [fileList, setFileList] = useState([]);
    const [request] = useUploadRequest();
    const [dragState, setDragState] = useState("drop");
    const [errors, setErrors] = useState([]);

    const hasFile = !isEmpty(fileList);
    const isDragging = dragState === "dragover";
    const hasErrors = !isEmpty(errors);

    const beforeUpload = (file) => {
        setErrors([]);
        return new Promise((resolve, reject) => {
            try {
                FileValidator.make(file, intl)
                    .size(minSize, maxSize)
                    .mimeTypes(mimeTypes)
                    .validate();
            } catch (errors) {
                setErrors(errors);
                return reject();
            }
            return resolve(file);
        });
    };

    const findFileIndex = (file, fileList) => {
        const key = file.uid ? "uid" : "name";
        return fileList.findIndex((item) => {
            return item[key] === file[key];
        });
    };

    const onBatchStart = (batchFiles) => {
        const newFileList = [...batchFiles].map((data) => {
            const {file, parsedFile} = data;
            file.percent = 0;
            file.status = parsedFile ? "uploading" : "error";
            return file;
        });
        setFileList(newFileList);
    };

    const handleSuccess = (data, file) => {
        const fileIndex = findFileIndex(file, fileList);

        if (fileIndex !== -1) {
            const newFileList = [...fileList];
            newFileList[fileIndex].percent = 100;
            newFileList[fileIndex].status = "done";
            setFileList(newFileList);
        }

        onSuccess?.();
        const message = intl.formatMessage(messages.uploaded);
        notify.success(message);
    };

    const handleProgress = (e, file) => {
        const fileIndex = findFileIndex(file, fileList);

        if (fileIndex !== -1) {
            const newFileList = [...fileList];
            newFileList[fileIndex].percent = e.percent;
            newFileList[fileIndex].status = "uploading";
            setFileList(newFileList);
        }
    };

    const handleError = (e, data, file) => {
        const fileIndex = findFileIndex(file, fileList);

        if (fileIndex !== -1) {
            const newFileList = [...fileList];
            newFileList[fileIndex].percent = 0;
            newFileList[fileIndex].status = "error";
            setFileList(newFileList);
        }

        onError?.(e, data);
        setErrors(data?.errors?.file || []);
    };

    const handleDragState = (e) => {
        setDragState(e.type);
    };

    return (
        <Box sx={{width: "100%", ...sx}}>
            <Upload
                name={name}
                beforeUpload={beforeUpload}
                action={action}
                customRequest={request}
                data={data}
                multiple={multiple}
                onBatchStart={onBatchStart}
                onSuccess={handleSuccess}
                onError={handleError}
                onProgress={handleProgress}
                accept={mimeTypes?.join?.()}>
                <DropZoneStyle
                    onDrop={handleDragState}
                    onDragLeave={handleDragState}
                    onDragOver={handleDragState}
                    sx={{
                        ...(hasErrors && {
                            color: "error.main",
                            borderColor: "error.light",
                            bgcolor: "error.lighter"
                        }),
                        ...(isDragging && {
                            color: "info.main",
                            borderColor: "info.light",
                            bgcolor: "info.lighter",
                            opacity: 0.5
                        }),
                        ...sx
                    }}>
                    <UploadIllustration sx={{width: 150}} />

                    <Box sx={{p: 2, ml: {md: 2}}}>
                        <Typography variant="h5">
                            <FormattedMessage defaultMessage="Drop or Select file" />
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{color: "text.secondary"}}>
                            {caption ?? (
                                <FormattedMessage defaultMessage="Drop files here or click to browse." />
                            )}
                        </Typography>
                    </Box>
                </DropZoneStyle>

                {!isEmpty(errors) && (
                    <FormHelperText
                        sx={{
                            textAlign: "center",
                            mt: 2
                        }}
                        error>
                        {errors.join(" ")}
                    </FormHelperText>
                )}

                <List disablePadding sx={{...(hasFile && {my: 3})}}>
                    <AnimatePresence>
                        {fileList.map((file) => {
                            const {name, status, size = 0, percent = 0} = file;

                            return (
                                <ListItem
                                    key={name}
                                    component={motion.div}
                                    {...varFadeIn}
                                    sx={{
                                        my: 1,
                                        py: 0.75,
                                        px: 2,
                                        borderRadius: 1,
                                        border: (theme) => {
                                            return `solid 1px ${
                                                status !== "error"
                                                    ? theme.palette.divider
                                                    : theme.palette.error.light
                                            }`;
                                        },
                                        bgcolor: "background.paper"
                                    }}>
                                    <ListItemIcon>
                                        <Icon
                                            icon={fileTextFill}
                                            width={28}
                                            height={28}
                                        />
                                    </ListItemIcon>

                                    <ListItemText
                                        primaryTypographyProps={{
                                            variant: "subtitle2",
                                            noWrap: true
                                        }}
                                        secondaryTypographyProps={{
                                            variant: "caption"
                                        }}
                                        primary={name}
                                        secondary={
                                            status === "uploading" ? (
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={percent}
                                                    sx={{my: 1}}
                                                />
                                            ) : (
                                                formatData(size)
                                            )
                                        }
                                    />

                                    <ListItemSecondaryAction>
                                        {status === "done" ? (
                                            <StatusIcon
                                                icon={checkboxCircleFill}
                                                color="success"
                                            />
                                        ) : status === "uploading" ? (
                                            <CircularProgress size={20} />
                                        ) : status === "error" ? (
                                            <StatusIcon
                                                icon={closeCircleFill}
                                                color="error"
                                            />
                                        ) : null}
                                    </ListItemSecondaryAction>
                                </ListItem>
                            );
                        })}
                    </AnimatePresence>
                </List>
            </Upload>
        </Box>
    );
};

const StatusIcon = styled(({color, ...props}) => <Icon {...props} />)(
    ({theme, color}) => ({
        width: 20,
        height: 20,
        color: theme.palette[color].main,
        flexShrink: 0,
        marginTop: 1
    })
);

const DropZoneStyle = styled("div")(({theme}) => ({
    outline: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    textAlign: "center",
    backgroundColor: theme.palette.background.neutral,
    borderRadius: theme.shape.borderRadius,
    border: `1px dashed ${theme.palette.grey[500_32]}`,
    padding: theme.spacing(4, 1),
    "&:hover": {opacity: 0.72, cursor: "pointer"},

    [theme.breakpoints.up("md")]: {
        textAlign: "left",
        flexDirection: "row"
    }
}));

export default UploadFile;
