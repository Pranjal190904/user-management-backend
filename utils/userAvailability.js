// function for checking if a user is available at the current time.
const isUserAvailable = (availabilityTime) => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes(); // Convert current time to minutes for easy comparison

    for (const slot of availabilityTime) {
        const [startHour, startMinute] = slot.start.split(':').map(Number);
        const [endHour, endMinute] = slot.end.split(':').map(Number);
        
        const startTime = startHour * 60 + startMinute;
        const endTime = endHour * 60 + endMinute;

        if (currentTime >= startTime && currentTime <= endTime) {
            return true; // User is available now
        }
    }
    return false; // User is unavailable
};

module.exports = isUserAvailable;