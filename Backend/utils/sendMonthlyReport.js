import fetch from "node-fetch";

async function sendMonthlyReport() {
    const reportData = await getMonthlyReport(12, 2025); // December 2025
    const monthName = "December 2025";

    await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            service_id: import.meta.env.VITE_EMAILJS_SERVICE_ID,
            template_id: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
            user_id: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
            template_params: {
                month: monthName,
                reportData: JSON.stringify(reportData, null, 2)
            }
        })
    });

    console.log("Monthly invoice report sent!");
}
