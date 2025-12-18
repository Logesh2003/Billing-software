import cron from "node-cron";

cron.schedule("0 0 1 * *", () => {
    // Runs 00:00 on 1st of every month
    sendMonthlyReport();
});
