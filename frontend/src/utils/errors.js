export const formatError = (err, fallbackMsg = "An unexpected error occurred.") => {
    if (!err) return fallbackMsg;
    
    let msg = typeof err === 'string' ? err : (err.message || "");
    if (!msg) return fallbackMsg;

    const msgLower = msg.toLowerCase();

    // Firebase specific errors
    if (msgLower.includes("auth/invalid-verification-code")) {
        return "Invalid OTP code. Please check and try again.";
    }
    if (msgLower.includes("auth/invalid-phone-number")) {
        return "Invalid phone number. Please enter a valid number.";
    }
    if (msgLower.includes("auth/too-many-requests")) {
        return "Too many attempts. Please try again later.";
    }
    if (msgLower.includes("auth/user-disabled")) {
        return "This account has been disabled.";
    }
    if (msgLower.includes("auth/popup-closed-by-user")) {
        return "Sign in cancelled.";
    }
    if (msgLower.includes("auth/network-request-failed") || msgLower.includes("network error") || msgLower.includes("failed to fetch")) {
        return "Network error. Please check your internet connection.";
    }
    if (msgLower.includes("firebase")) {
        return "An authentication error occurred. Please try again.";
    }

    // Default formatting if it doesn't match specific technical patterns
    if (msgLower.includes("db") || msgLower.includes("database") || msgLower.includes("sql")) {
        return "We are experiencing a temporary issue. Please try again later.";
    }

    // If it's a generic backend response, it might already be nicely formatted by our Go backend, so just return it.
    // Otherwise fallback if it still looks too raw (e.g. contains "error")
    return msg || fallbackMsg;
};
