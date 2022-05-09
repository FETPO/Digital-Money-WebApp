import React, {useCallback, useMemo} from "react";
import {
    Card,
    CardContent,
    CardHeader,
    Grid,
    Step,
    StepLabel,
    Stepper
} from "@mui/material";
import {FormattedMessage} from "react-intl";
import Basic from "./components/Basic";
import Completed from "./components/Completed";
import Spin from "components/Spin";
import Advanced from "./components/Advanced";
import {useDispatch} from "react-redux";
import {fetchVerification} from "redux/slices/user";
import {useVerification} from "hooks/user";

const Data = () => {
    const dispatch = useDispatch();
    const {basic, advanced, status, loading} = useVerification();

    const steps = useMemo(() => {
        return {
            unverified: 0,
            basic: 1,
            advanced: 2
        };
    }, []);

    const onChange = useCallback(() => {
        dispatch(fetchVerification());
    }, [dispatch]);

    const content = useMemo(() => {
        return {
            unverified: <Basic data={basic} />,
            basic: <Advanced onChange={onChange} data={advanced} />,
            advanced: <Completed />
        };
    }, [basic, advanced, onChange]);

    return (
        <Card>
            <CardHeader
                title={<FormattedMessage defaultMessage="Verification" />}
            />

            <CardContent>
                <Spin spinning={loading}>
                    <Grid container justifyContent="center">
                        <Grid item xs={12} md={8} sx={{mb: 3}}>
                            <Stepper
                                orientation="horizontal"
                                activeStep={steps[status]}>
                                <Step>
                                    <StepLabel>
                                        <FormattedMessage defaultMessage="Basic" />
                                    </StepLabel>
                                </Step>
                                <Step>
                                    <StepLabel>
                                        <FormattedMessage defaultMessage="Advanced" />
                                    </StepLabel>
                                </Step>
                            </Stepper>
                        </Grid>
                    </Grid>

                    {content[status]}
                </Spin>
            </CardContent>
        </Card>
    );
};

export default Data;
