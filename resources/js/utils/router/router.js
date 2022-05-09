import RouteHelper from "../classes/RouteHelper";
import {routePath} from "utils";
import names from "./names";
import admin from "@iconify-icons/ri/admin-line";
import user from "@iconify-icons/ri/user-line";
import group from "@iconify-icons/ri/group-line";
import store from "@iconify-icons/ri/store-2-line";
import shieldStar from "@iconify-icons/ri/shield-star-line";
import settings4 from "@iconify-icons/ri/settings-4-line";
import translate from "@iconify-icons/ri/translate-2";
import paintBrush from "@iconify-icons/ri/paint-brush-line";
import plug from "@iconify-icons/ri/plug-line";
import settings from "@iconify-icons/ri/settings-line";
import bankCard from "@iconify-icons/ri/bank-card-line";
import questionnaire from "@iconify-icons/ri/questionnaire-line";
import userAdd from "@iconify-icons/ri/user-add-line";
import lockUnlock from "@iconify-icons/ri/lock-unlock-line";
import lockPassword from "@iconify-icons/ri/lock-password-line";
import loginCircle from "@iconify-icons/ri/login-circle-line";
import profile from "@iconify-icons/ri/profile-line";
import globe from "@iconify-icons/ri/globe-line";
import coins from "@iconify-icons/ri/coins-fill";
import passport from "@iconify-icons/ri/passport-line";
import home from "@iconify-icons/ri/home-7-line";
import gift from "@iconify-icons/ri/gift-2-line";
import exchangeFunds from "@iconify-icons/ri/exchange-funds-line";
import exchangeDollar from "@iconify-icons/ri/exchange-dollar-line";
import swap from "@iconify-icons/ri/swap-line";
import shoppingBasket from "@iconify-icons/ri/shopping-basket-2-line";
import shoppingBag from "@iconify-icons/ri/shopping-bag-2-line";

const data = [
    {
        key: "auth",
        path: routePath("auth"),
        icon: lockPassword,
        name: names["auth"],
        children: [
            {
                key: "login",
                path: routePath("auth", "login"),
                icon: loginCircle,
                name: names["auth.login"]
            },
            {
                key: "forgot-password",
                path: routePath("auth", "forgot-password"),
                icon: lockUnlock,
                name: names["auth.forgot-password"]
            },
            {
                key: "register",
                path: routePath("auth", "register"),
                icon: userAdd,
                name: names["auth.register"]
            }
        ]
    },
    {
        key: "user",
        path: routePath("user"),
        icon: user,
        name: names["user"],
        children: [
            {
                key: "account",
                path: routePath("user", "account"),
                icon: user,
                name: names["user.account"]
            },
            {
                key: "purchases",
                path: routePath("user", "purchases"),
                icon: shoppingBag,
                name: names["user.purchases"]
            }
        ]
    },
    {
        key: "admin",
        path: routePath("admin"),
        icon: admin,
        name: names["admin"],
        children: [
            {
                key: "home",
                path: routePath("admin", "home"),
                icon: home,
                name: names["admin.home"]
            },
            {
                key: "wallets",
                path: routePath("admin", "wallets"),
                icon: coins,
                name: names["admin.wallets"]
            },
            {
                key: "users",
                path: routePath("admin", "users"),
                icon: group,
                name: names["admin.users"]
            },
            {
                key: "marketplace",
                path: routePath("admin", "marketplace"),
                icon: store,
                name: names["admin.marketplace"]
            },
            {
                key: "verification",
                path: routePath("admin", "verification"),
                icon: shieldStar,
                name: names["admin.verification"]
            },
            {
                key: "payments",
                path: routePath("admin", "payments"),
                icon: bankCard,
                name: names["admin.payments"]
            },
            {
                key: "exchange",
                path: routePath("admin", "exchange"),
                icon: exchangeFunds,
                name: names["admin.exchange"]
            },
            {
                key: "giftcards",
                path: routePath("admin", "giftcards"),
                icon: gift,
                name: names["admin.giftcards"]
            },
            {
                key: "settings",
                path: routePath("admin", "settings"),
                icon: settings4,
                name: names["admin.settings"]
            },
            {
                key: "localization",
                path: routePath("admin", "localization"),
                icon: translate,
                name: names["admin.localization"]
            },
            {
                key: "customize",
                path: routePath("admin", "customize"),
                icon: paintBrush,
                name: names["admin.customize"]
            },
            {
                key: "developer",
                path: routePath("admin", "developer"),
                icon: plug,
                name: names["admin.developer"]
            }
        ]
    },
    {
        key: "landing",
        path: routePath("landing"),
        icon: globe,
        name: names["landing"]
    },
    {
        key: "user-setup",
        path: routePath("user-setup"),
        icon: profile,
        name: names["user-setup"]
    },
    {
        key: "home",
        path: routePath("home"),
        icon: home,
        name: names["home"]
    },
    {
        key: "settings",
        path: routePath("settings"),
        icon: settings,
        name: names["settings"]
    },
    {
        key: "help",
        path: routePath("help"),
        icon: questionnaire,
        name: names["help"]
    },
    {
        key: "wallets",
        path: routePath("wallets"),
        icon: coins,
        name: names["wallets"]
    },
    {
        key: "exchange",
        path: routePath("exchange"),
        icon: exchangeFunds,
        name: names["exchange"],
        children: [
            {
                key: "trade",
                path: routePath("exchange", "trade"),
                icon: exchangeDollar,
                name: names["exchange.trade"]
            },
            {
                key: "swap",
                path: routePath("exchange", "swap"),
                icon: swap,
                name: names["exchange.swap"]
            }
        ]
    },
    {
        key: "giftcards",
        path: routePath("giftcards"),
        icon: gift,
        name: names["giftcards"],
        children: [
            {
                key: "shop",
                path: routePath("giftcards", "shop"),
                icon: shoppingBag,
                name: names["giftcards.shop"]
            },
            {
                key: "checkout",
                path: routePath("giftcards", "checkout"),
                icon: shoppingBasket,
                name: names["giftcards.checkout"]
            }
        ]
    },
    {
        key: "payments",
        path: routePath("payments"),
        icon: bankCard,
        name: names["payments"]
    },
    {
        key: "limits",
        path: routePath("limits"),
        icon: passport,
        name: names["limits"]
    }
];

export default new RouteHelper(data);
