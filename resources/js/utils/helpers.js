import React, {createElement, useEffect, useRef} from "react";
import {
    flattenDeep,
    isArray,
    isFunction,
    isString,
    keyBy,
    mapValues,
    map,
    mergeWith,
    reduce,
    ceil
} from "lodash";
import urlJoin from "proper-url-join";
import {Avatar} from "@mui/material";

export function pipe(...arg) {
    return (x) => arg.reduce((v, f) => f(v), x);
}

function isValidHex(color) {
    return isString(color) && /^#[0-9A-F]{6}$/i.test(color);
}

function buildHex(R, B, G) {
    return (
        "#" +
        (
            0x1000000 +
            (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
            (B < 255 ? (B < 1 ? 0 : B) : 255) * 0x100 +
            (G < 255 ? (G < 1 ? 0 : G) : 255)
        )
            .toString(16)
            .slice(1)
    );
}

export function lightenColor(color, percent) {
    if (!isValidHex(color)) {
        return color;
    }
    const amt = Math.round(2.55 * percent),
        num = parseInt(color.replace("#", ""), 16),
        R = (num >> 16) + amt,
        B = ((num >> 8) & 0x00ff) + amt,
        G = (num & 0x0000ff) + amt;

    return buildHex(R, B, G);
}

export function darkenColor(color, percent) {
    if (!isValidHex(color)) {
        return color;
    }
    const amt = Math.round(2.55 * percent),
        num = parseInt(color.replace("#", ""), 16),
        R = (num >> 16) - amt,
        B = ((num >> 8) & 0x00ff) - amt,
        G = (num & 0x0000ff) - amt;

    return buildHex(R, B, G);
}

export function normalizeAttrs(attrs) {
    return Object.keys(attrs).reduce((acc, key) => {
        const val = attrs[key];
        switch (key) {
            case "class":
                acc.className = val;
                delete acc.class;
                break;
            default:
                acc[key] = val;
        }
        return acc;
    }, {});
}

export function generateIcon(node, key, props = {}) {
    return createElement(
        node.tag,
        {
            key,
            ...normalizeAttrs(node.attributes || {}),
            ...props
        },
        (node.children || []).map((o, i) => {
            return generateIcon(o, `${key}-${node.tag}-${i}`);
        })
    );
}

export function insertBetween(arr, value) {
    return flattenDeep(reduce(arr, (p, c) => [p, value, c]));
}

export function routePath(...parts) {
    return urlJoin(...parts);
}

export function useVar(value) {
    const ref = useRef(null);

    if (ref.current === null) {
        if (isFunction(value)) {
            ref.current = value();
        } else {
            ref.current = value;
        }
    }

    return ref.current;
}

export function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}

export function stringToHex(value) {
    let color = "#",
        hash = 0;

    if (value.length === 0) {
        return "#ccc";
    }
    for (let i = 0; i < value.length; i++) {
        hash = value.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash;
    }

    for (let i = 0; i < 3; i++) {
        const sub = (hash >> (i * 8)) & 255;
        color += ("00" + sub.toString(16)).substr(-2);
    }
    return color;
}

export function mergeArray(...sources) {
    return mergeWith(...sources, (a, b) => {
        if (isArray(a)) {
            return b.concat(a);
        }
    });
}

export function pluck(data, value, key = null) {
    return key ? mapValues(keyBy(data, key), value) : map(data, value);
}

export function mountHandler() {
    let mounted = true;

    const execute = (callback) => {
        if (mounted) {
            callback?.();
        }
    };

    const unmount = () => {
        mounted = false;
    };

    return {execute, unmount};
}

export function getSymbolIcon(symbol, size = 25) {
    return (
        <Avatar
            sx={{
                height: size,
                lineHeight: "inherit",
                width: size,
                color: (theme) => theme.palette.grey[700],
                fontSize: (size * 2) / 3
            }}>
            <span>{symbol}</span>
        </Avatar>
    );
}

export function calculatePercent(value, total) {
    const divisor = total > 0 ? total : 1;
    return ceil((value * 100) / divisor);
}
