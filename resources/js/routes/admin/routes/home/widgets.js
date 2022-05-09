import SystemStatus from "components/SystemStatus";
import RegistrationChart from "components/RegistrationChart";
import LatestUsers from "components/LatestUsers";
import PendingVerification from "components/PendingVerification";
import PendingDeposits from "components/PendingDeposits";
import PendingWithdrawals from "components/PendingWithdrawals";
import EarningSummary from "components/EarningSummary";

export default [
    {
        name: "earning_summary",
        dimensions: EarningSummary.dimensions,
        component: EarningSummary
    },
    {
        name: "system_status",
        dimensions: SystemStatus.dimensions,
        component: SystemStatus
    },
    {
        name: "pending_verification",
        dimensions: PendingVerification.dimensions,
        component: PendingVerification
    },
    {
        name: "pending_deposits",
        dimensions: PendingDeposits.dimensions,
        component: PendingDeposits
    },
    {
        name: "pending_withdrawals",
        dimensions: PendingWithdrawals.dimensions,
        component: PendingWithdrawals
    },
    {
        name: "latest_users",
        dimensions: LatestUsers.dimensions,
        component: LatestUsers
    },
    {
        name: "registration_chart",
        dimensions: RegistrationChart.dimensions,
        component: RegistrationChart
    }
];
