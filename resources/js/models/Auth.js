import {isEmpty} from "lodash";
import User from "models/User";
import Model from "./Model";
import {useSelector} from "react-redux";
import {useMemo} from "react";
import {route} from "services/Http";

export default class Auth extends Model {
    /**
     * Check if user is authenticated
     */
    check() {
        return !isEmpty(this.user);
    }

    /**
     * Get country operation status
     *
     * @returns {boolean}
     */
    countryOperation() {
        return this.check() && this.user.get("country_operation");
    }

    /**
     * Check if user setup is required
     *
     * @returns {*|boolean}
     */
    isUserSetupRequired() {
        return (
            this.get("userSetup") &&
            this.check() &&
            (!this.user.enabledTwoFactor() || !this.user.isProfileComplete())
        );
    }

    /**
     * Check if user does not have permission
     *
     * @param value
     * @returns {boolean}
     */
    cannot(value) {
        return this.check() && this.user.cannot(value);
    }

    /**
     * Check if user has permission
     *
     * @param value
     * @returns {boolean}
     */
    can(value) {
        return this.check() && this.user.can(value);
    }

    /**
     * Check if user has role
     *
     * @param value
     * @returns {boolean}
     */
    hasRole(value) {
        return this.check() && this.user.hasRole(value);
    }

    /**
     * Check if user has any role
     *
     * @param values
     * @returns {boolean}
     */
    hasAnyRole(values) {
        return this.check() && this.user.hasAnyRole(values);
    }

    /**
     * Check if user has all role
     *
     * @param values
     * @returns {boolean}
     */
    hasAllRole(values) {
        return this.check() && this.user.hasAllRole(values);
    }

    /**
     * Get Login Id
     *
     * @returns {*}
     */
    credential() {
        return this.get("credential");
    }

    requireTwoFactor() {
        return this.user.enabledTwoFactor();
    }

    logout(request) {
        return request.post(route("auth.logout"));
    }

    /**
     * Get user object model
     *
     * @returns {null|User}
     */
    get user() {
        if (!this.userObject) {
            const data = this.get("user");

            if (!isEmpty(data)) {
                this.userObject = new User(data);
            } else {
                this.userObject = null;
            }
        }
        return this.userObject;
    }
}

/**
 * Auth Custom Hook
 *
 * @returns {Auth|Model}
 */
export function useAuth() {
    const auth = useSelector((state) => state.auth);
    return useMemo(() => new Auth(auth), [auth]);
}
