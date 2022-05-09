import {difference, intersection, isEmpty} from "lodash";
import Model from "./Model";
import UserProfile from "./UserProfile";
import {parseDate} from "utils/form";
import {dayjs} from "utils";

class User extends Model {
    /**
     * Get super admin role
     *
     * @returns {*}
     */
    isSuperAdmin() {
        return this.get("is_super_admin", false);
    }

    /**
     * Check if user has permission
     *
     * @param value
     * @returns {boolean}
     */
    can(value) {
        return (
            this.get("all_permissions", []).includes(value.trim()) ||
            this.isSuperAdmin()
        );
    }

    /**
     * Check if user does not have permission
     *
     * @param value
     * @returns {boolean}
     */
    cannot(value) {
        return !this.can(value);
    }

    /**
     * Check if user has role
     *
     * @param value
     * @returns {boolean}
     */
    hasRole(value) {
        return this.get("all_roles", []).includes(value.trim());
    }

    /**
     * Check if user has any role
     *
     * @param values
     * @returns {boolean}
     */
    hasAnyRole(values) {
        return intersection(this.get("all_roles", []), values).length > 0;
    }

    /**
     * Check if user has all role
     *
     * @param values
     * @returns {boolean}
     */
    hasAllRole(values) {
        return difference(values, this.get("all_roles", [])).length === 0;
    }

    /**
     * Check if user has verified email
     *
     * @returns {boolean}
     */
    hasVerifiedEmail() {
        return Boolean(this.get("email_verified_at"));
    }

    /**
     * Check if user has verified phone
     *
     * @returns {boolean}
     */
    hasVerifiedPhone() {
        return Boolean(this.get("phone_verified_at"));
    }

    /**
     * Check if user has enabled two factor
     *
     * @returns {boolean}
     */
    enabledTwoFactor() {
        return Boolean(this.get("two_factor_enable"));
    }

    /**
     * Determine if profile is complete
     *
     * @returns {null|*}
     */
    isProfileComplete() {
        return this.profile && this.profile.isComplete();
    }

    /**
     * Get profile picture url
     *
     * @returns {string|null}
     */
    getProfilePicture() {
        return this.profile && this.profile.get("picture");
    }

    /**
     * Deactivated until
     *
     * @returns {Dayjs}
     */
    deactivatedUntil() {
        return parseDate(this.get("deactivated_until"));
    }

    /**
     * Check if active
     *
     * @returns {boolean}
     */
    isActive() {
        const date = this.deactivatedUntil();
        return !date.isValid() || date.isBefore(dayjs());
    }

    /**
     * Get userProfile object model
     *
     * @returns {null|UserProfile}
     */
    get profile() {
        if (!this.profileObject) {
            const data = this.get("profile");

            if (!isEmpty(data)) {
                this.profileObject = new UserProfile(data);
            } else {
                this.profileObject = null;
            }
        }
        return this.profileObject;
    }
}

export default User;
