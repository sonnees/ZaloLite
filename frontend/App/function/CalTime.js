function getTimeDifference(timestamp) {
    const currentTime = new Date();
    const sentTime = new Date(timestamp);
    const timezoneOffset = currentTime.getTimezoneOffset() / 60;

    const sentTimeVN = new Date(sentTime.getTime() + (timezoneOffset + 7) * 60 * 60 * 1000);
    const currentTimeVN = new Date(currentTime.getTime() + (timezoneOffset + 7) * 60 * 60 * 1000);

    console.log("Sent time: " + sentTimeVN);
    console.log("Current time: " + currentTimeVN);

    const timeDifference = Math.abs(currentTimeVN - sentTimeVN) / 1000;

    if (timeDifference <= 60) {
        return '1 minute';
    } else if (timeDifference <= 3600) { // 60 * 60 seconds
        return `${Math.floor(timeDifference / 60)} minutes`;
    } else if (timeDifference <= 7200) { // 2 * 3600 seconds
        return '1 hour';
    } else if (timeDifference <= 84600) { // 60 * 60 seconds
        return `${Math.floor(timeDifference / 3600)} hours`;
    } else if (timeDifference <= 86400) { // 24 * 3600 seconds và cùng ngày
        return '1 day';
    } else if (timeDifference <= 172800) { // 2 * 86400 seconds
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return days[sentTimeVN.getDay()];
    } else if (sentTimeVN.getFullYear() === currentTimeVN.getFullYear()) {
        if (sentTimeVN.getMonth() === currentTimeVN.getMonth()) {
            return `${sentTimeVN.getDate()}/${sentTimeVN.toLocaleString('default', { month: '2-digit' })}`;
        } else {
            return `${sentTimeVN.getDate()}/${sentTimeVN.toLocaleString('default', { month: '2-digit' })}`;
        }
    } else {
        return `${sentTimeVN.getDate()}/${sentTimeVN.toLocaleString('default', { month: '2-digit' })}/${sentTimeVN.getFullYear().toString().slice(-2)}`;
    }
}
export { getTimeDifference };
