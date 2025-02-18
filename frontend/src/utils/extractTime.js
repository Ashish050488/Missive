export function extractTime(dateString) {
    const date = new Date(dateString);
    let hours = date.getHours(); // Get hours (0-23)
    const minutes = padZero(date.getMinutes()); // Get minutes (0-59)
    const ampm = hours >= 12 ? 'PM' : 'AM'; // Determine AM or PM

    hours = hours % 12 || 12; // Convert 0-23 to 12-hour format (0 becomes 12)

    return `${hours}:${minutes} ${ampm}`; // Return formatted time as HH:MM AM/PM
}

// Helper function to add a leading zero to single-digit numbers
function padZero(number) {
    return number.toString().padStart(2, '0');
}
