import axios from "axios";
import context from "context";
import React, {useEffect, useMemo, useState} from "react";
import {
    assign,
    first,
    forOwn,
    isEmpty,
    isFunction,
    isString,
    isUndefined,
    castArray
} from "lodash";
import {notify, useVar, modal, mountHandler} from "utils";
import baseStation from "@iconify-icons/ri/base-station-fill";
import indeterminateCircleFill from "@iconify-icons/ri/indeterminate-circle-fill";
import {Icon} from "@iconify/react";
import {Box} from "@mui/material";

const csrfToken = context.csrfToken;
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common["Accept"] = "application/json";
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
axios.defaults.headers.common["X-CSRF-TOKEN"] = csrfToken;

export {axios, csrfToken};

export default class Http {
    constructor() {
        this.request = axios.create();
        this.resetCancelToken();
    }

    resetCancelToken() {
        this.source = axios.CancelToken.source();
        this.request.defaults.cancelToken = this.source.token;
    }

    cancel(message) {
        this.source.cancel(message);
        this.resetCancelToken();
    }

    isCancel(error) {
        return axios.isCancel(error);
    }
}

const unauthenticated = (data) => {
    modal.confirm({
        title: data.title,
        icon: <Box component={Icon} icon={indeterminateCircleFill} />,
        content: data.message,
        okText: data.action,
        cancelButtonProps: {sx: {display: "none"}},
        onOk: () => window.location.reload()
    });
};

const pageExpired = (data) => {
    modal.confirm({
        title: data.title,
        icon: <Box component={Icon} icon={baseStation} />,
        content: data.message,
        okText: data.action,
        cancelButtonProps: {sx: {display: "none"}},
        onOk: () => window.location.reload()
    });
};

/**
 * Request hook
 *
 * @returns {[axios, boolean]}
 */
export const useRequest = () => {
    const [loading, setLoading] = useState(false);
    const service = useVar(() => new Http());

    useEffect(() => {
        const handler = mountHandler();
        const interceptors = service.request.interceptors;

        const requestInterceptor = interceptors.request.use((config) => {
            handler.execute(() => {
                setLoading(true);
            });
            return config;
        });

        const responseInterceptor = interceptors.response.use(
            ({data}) => {
                handler.execute(() => {
                    if (data.success) {
                        notify.success(data.success);
                    }
                    setLoading(false);
                });
                return data;
            },
            (error) => {
                handler.execute(() => {
                    setLoading(false);

                    if (error.response) {
                        const {status, data} = error.response;

                        switch (status) {
                            case 401: {
                                unauthenticated(data);
                                break;
                            }
                            case 419: {
                                pageExpired(data);
                                break;
                            }
                            default: {
                                const {errors, message} = data;

                                if (!isEmpty(errors)) {
                                    forOwn(errors, (data) => {
                                        castArray(data).forEach((e) => {
                                            notify.error(e);
                                        });
                                    });
                                } else if (isString(message)) {
                                    notify.error(message);
                                }
                            }
                        }
                    }
                });
                return Promise.reject(error);
            }
        );

        return () => {
            handler.unmount();
            interceptors.request.eject(requestInterceptor);
            interceptors.response.eject(responseInterceptor);
            service.cancel("Unmounted Component");
        };
    }, [service]);

    return [service.request, loading];
};

/**
 * Form request hook
 *
 * @param form
 * @returns {[axios, boolean]}
 */
export const useFormRequest = (form) => {
    const [loading, setLoading] = useState(false);
    const service = useVar(() => new Http());

    useEffect(() => {
        const handler = mountHandler();
        const interceptors = service.request.interceptors;

        const requestInterceptor = interceptors.request.use((config) => {
            handler.execute(() => {
                setLoading(true);
            });
            return config;
        });

        const responseInterceptor = interceptors.response.use(
            ({data}) => {
                handler.execute(() => {
                    if (isString(data.success)) {
                        notify.success(data.success);
                    }
                    setLoading(false);
                });
                return data;
            },
            (error) => {
                handler.execute(() => {
                    setLoading(false);

                    if (error.response) {
                        const {status, data} = error.response;

                        switch (status) {
                            case 401: {
                                unauthenticated(data);
                                break;
                            }
                            case 419: {
                                pageExpired(data);
                                break;
                            }
                            default: {
                                const {errors, message} = data;

                                if (!isEmpty(errors)) {
                                    const fields = [];

                                    forOwn(errors, (data, key) => {
                                        const namePath = key.split(".");
                                        const prevValue =
                                            form.getFieldValue(namePath);

                                        fields.push({
                                            name: namePath,
                                            errors: data,
                                            value: prevValue
                                        });

                                        if (isUndefined(prevValue)) {
                                            castArray(data).forEach((e) => {
                                                notify.error(e);
                                            });
                                        }
                                    });

                                    form.setFields(fields);
                                    form.scrollToField(first(fields).name);
                                } else if (isString(message)) {
                                    notify.error(message);
                                }
                            }
                        }
                    }
                });
                return Promise.reject(error);
            }
        );

        return () => {
            handler.unmount();
            interceptors.request.eject(requestInterceptor);
            interceptors.response.eject(responseInterceptor);
            service.cancel("Unmounted Component");
        };
    }, [service, form]);

    return [service.request, loading];
};

export function useUploadRequest() {
    const [loading, setLoading] = useState(false);
    const service = useVar(() => new Http());

    useEffect(() => {
        const handler = mountHandler();
        const interceptors = service.request.interceptors;

        const requestInterceptor = interceptors.request.use((config) => {
            handler.execute(() => {
                setLoading(true);
            });
            return config;
        });

        const responseInterceptor = interceptors.response.use(
            (response) => {
                handler.execute(() => {
                    const {data} = response;
                    if (data.success) {
                        notify.success(data.success);
                    }
                    setLoading(false);
                });
                return response;
            },
            (error) => {
                handler.execute(() => {
                    setLoading(false);

                    if (error.response) {
                        const {status, data} = error.response;

                        switch (status) {
                            case 401: {
                                unauthenticated(data);
                                break;
                            }
                            case 419: {
                                pageExpired(data);
                                break;
                            }
                            default: {
                                if (isString(data.message)) {
                                    notify.error(data.message);
                                }
                            }
                        }
                    }
                });

                return Promise.reject(error);
            }
        );
        return () => {
            handler.unmount();
            interceptors.request.eject(requestInterceptor);
            interceptors.response.eject(responseInterceptor);
            service.cancel("Unmounted Component");
        };
    }, [service]);

    const request = useMemo(() => {
        return function (options) {
            const form = new FormData();
            form.set(options.filename, options.file);

            forOwn(options.data, (v, k) => {
                form.append(k, v);
            });

            service.request
                .post(options.action, form, {
                    headers: assign(
                        {},
                        {"Content-Type": "multipart/form-data"},
                        options.headers
                    ),

                    onUploadProgress(progress) {
                        const {loaded, total} = progress;
                        const percent = Math.round((loaded * 100) / total);
                        const {onProgress} = options;

                        if (isFunction(onProgress)) {
                            return onProgress({percent});
                        }
                    }
                })
                .then((response) => {
                    const {data, request} = response;
                    const {onSuccess} = options;

                    if (isFunction(onSuccess)) {
                        return onSuccess(data, request);
                    }
                })
                .catch(
                    errorHandler((error) => {
                        const {onError} = options;

                        if (isFunction(onError)) {
                            if (error.response) {
                                return onError(error, error.response.data);
                            } else {
                                return onError(error);
                            }
                        }
                    })
                );
        };
    }, [service]);

    return [request, loading];
}

export function errorHandler(callback) {
    return (error) => {
        if (!axios.isCancel(error)) {
            return callback?.(error);
        }
    };
}

export function thunkRequest() {
    const service = new Http();

    service.request.interceptors.response.use(
        (response) => {
            return response.data;
        },
        (error) => {
            if (error.response) {
                const {status, data} = error.response;

                switch (status) {
                    case 401: {
                        unauthenticated(data);
                        break;
                    }
                    case 419: {
                        pageExpired(data);
                        break;
                    }
                    default: {
                        if (isString(data.message)) {
                            notify.error(data.message);
                        }
                    }
                }
            }
            return Promise.reject(error);
        }
    );

    return service.request;
}
