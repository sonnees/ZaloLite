function getTimeDifference(timestamp) {
    function calculateTimeDifference() {
        const currentTime = new Date();
        const sentTime = new Date(timestamp);
        const timezoneOffset = currentTime.getTimezoneOffset() / 60;

        const sentTimeVN = new Date(sentTime.getTime() + (timezoneOffset + 7) * 60 * 60 * 1000);
        const currentTimeVN = new Date(currentTime.getTime() + (timezoneOffset + 7) * 60 * 60 * 1000);
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

    // Gọi lần đầu
    const initialDifference = calculateTimeDifference();

    // Cập nhật mỗi 60 giây
    setInterval(function () {
        const updatedDifference = calculateTimeDifference();
        // Trả về giá trị thời gian
        return updatedDifference;
    }, 6000); // 60000 milliseconds tương ứng với 60 giây

    // Trả về giá trị thời gian ban đầu
    return initialDifference;
}
export { getTimeDifference, getTime, formatDateTime };



// Hàm lấy giờ, phút từ đối tượng thời gian
const getTime = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0'); // Lấy giờ (00 đến 23)
    const minutes = date.getMinutes().toString().padStart(2, '0'); // Lấy phút (00 đến 59)
    return `${hours}:${minutes}`; // Trả về chuỗi giờ/phút
};

const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const day = date.getDate();
    const month = date.getMonth() + 1; // Tháng bắt đầu từ 0 nên cần cộng thêm 1
    const year = date.getFullYear();
    const formattedDateTime = `${hours}:${minutes} ${day}/${month}/${year}`;
    return formattedDateTime;
};

// Sử dụng hàm để lấy giờ và phút từ dữ liệu timestamp
const timestamp = {
    $date: "2024-03-29T09:11:55.075Z"
};
const formattedDateTime = formatDateTime(timestamp);
console.log(formattedDateTime);

// Sử dụng hàm để lấy ngày/tháng/năm và giờ/phút từ timestamp
const time = getTime(timestamp);

console.log(time);