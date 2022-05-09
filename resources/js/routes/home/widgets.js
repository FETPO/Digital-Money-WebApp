import PriceChart from "components/PriceChart";
import PaymentAccountChart from "components/PaymentAccountChart";
import WalletAccountChart from "components/WalletAccountChart";
import FeatureLimits from "components/FeatureLimits";
import RecentTransaction from "components/RecentTransaction";

export default [
    {
        name: "price_chart",
        dimensions: PriceChart.dimensions,
        component: PriceChart
    },
    {
        name: "payment_account_chart",
        dimensions: PaymentAccountChart.dimensions,
        component: PaymentAccountChart
    },
    {
        name: "wallet_account_chart",
        dimensions: WalletAccountChart.dimensions,
        component: WalletAccountChart
    },
    {
        name: "recent_activity",
        dimensions: RecentTransaction.dimensions,
        component: RecentTransaction
    },
    {
        name: "feature_limits",
        dimensions: FeatureLimits.dimensions,
        component: FeatureLimits
    }
];
