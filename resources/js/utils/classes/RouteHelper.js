import React from "react";
import {generatePath as _generatePath, matchPath} from "react-router-dom";
import {
    assign,
    findKey,
    forEach,
    isEmpty,
    isFunction,
    omit,
    pick,
    map
} from "lodash";
import {Icon} from "@iconify/react";
import {Box} from "@mui/material";
import {pathToRegexp} from "path-to-regexp";

class RouteHelper {
    constructor(routes) {
        this.routes = routes;
        this.buildData();
    }

    parseData(dataset, keyChain, result) {
        forEach(dataset, (o) => {
            const currKeychain = keyChain.concat(o.key);
            result[currKeychain.join(".")] = omit(o, ["children"]);
            if (!isEmpty(o.children)) {
                this.parseData(o.children, currKeychain, result);
            }
        });
    }

    buildData() {
        const result = {},
            keyChain = [];
        this.parseData(this.routes, keyChain, result);
        this.builtData = result;
    }

    getData(key) {
        const data = this.builtData[key];

        if (!this.builtData.hasOwnProperty(key)) {
            throw "Route data does not exists.";
        }

        return assign({}, data, {
            getKey: () => data.key,
            getName: (intl) => {
                return intl.formatMessage(data.name);
            },
            iconComponent: (props) => {
                return <Box {...props} component={Icon} icon={data.icon} />;
            },
            generatePath: (params, filter = []) => {
                filter = filter.map((name) => ({name}));
                pathToRegexp(data.path, filter);
                const keys = map(filter, "name");
                return _generatePath(data.path, pick(params, keys));
            },
            getIcon: () => data.icon,
            getPath: () => data.path
        });
    }

    getName(key, intl) {
        return this.get(key, (d) => d.getName(intl));
    }

    getIconComponent(key) {
        return this.get(key, (d) => d.iconComponent);
    }

    generatePath(key, params) {
        return this.get(key, (d) => d.generatePath(params));
    }

    getIcon(key) {
        return this.get(key, (d) => d.getIcon());
    }

    getPath(key) {
        return this.get(key, (d) => d.getPath());
    }

    getKeyByUrl(url, exact = true, strict = false) {
        return findKey(this.builtData, (o) => {
            const match = matchPath(url, {
                path: o.path,
                exact,
                strict
            });
            return !isEmpty(match);
        });
    }

    getDataFromUrl(url, exact = true, strict = false) {
        const key = this.getKeyByUrl(url, exact, strict);
        const match = matchPath(url, {
            path: this.getPath(key),
            exact,
            strict
        });
        return {
            key,
            params: match?.params
        };
    }

    get(key, predicate) {
        const data = this.getData(key);

        return !isFunction(predicate) ? data : predicate(data);
    }
}

export default RouteHelper;
