const data = [
    { "description": "Tôi muốn được kết bạn với pro!", "isSender": false, "sendAt": "2024-03-28T15:34:44.138+00:00", "userAvatar": "https://upanh123.com/wp-content/uploads/2020/10/Anh-gai-xinh-lam-anh-dai-dien-facebook1.jpg", "userID": "5b685d06-8fbe-4ab7-a18b-b713b2ba4daa", "userName": "Ánh Tina" },
    { "description": "Tôi muốn được kết bạn với pro!", "isSender": false, "sendAt": "2024-03-28T15:34:51.640+00:00", "userAvatar": "https://res.cloudinary.com/dj9ulywm8/image/upload/v1711638195/yaelqfegjxfkbjdmwyef.png", "userID": "f1cee7b8-7712-4042-9e94-17bd21209a62", "userName": "Lê Hữu Bằng" },
    { "description": "Tôi muốn được kết bạn với pro!", "isSender": false, "sendAt": "2024-03-28T15:36:25.955+00:00", "userAvatar": "https://dungplus.com/wp-content/uploads/2019/12/girl-xinh-2-600x750.jpg", "userID": "b95ad4f4-68b0-4dd8-a4db-59b5874c4bdf", "userName": "Nguyễn Thị Việt Chi" },
    { "description": "Tôi muốn được kết bạn với pro!", "isSender": false, "sendAt": "2024-04-05T14:46:55.226+00:00", "userAvatar": "https://res.cloudinary.com/dj9ulywm8/image/upload/v1711636843/exftni5o9msptdxgukhk.png", "userID": "79feacfd-507b-4721-b7b0-92869f06cf20", "userName": "Haley Neith" }
]
function checkDuplicateUser(data, userId) {
    for (let i = 0; i < data.length; i++) {
        if (data[i].userID === userId) {
            return data[i];
        }
    }
    return null;

}
function checkType(data) {
    if (!data) {
        return 'NOTSEND'
    }
    else if (data.isSender) {
        return 'SENT'
    }
    else if (data.isSender == false)
        return 'REQUEST'
}
const userIdToCheck = "5b685d06-8fbe-4ab7-a18b-b713b2ba4daa";  // userID cần kiểm tra
const newData = checkDuplicateUser(data, userIdToCheck);
console.log(newData);
const check = checkType(checkDuplicateUser(data, userIdToCheck))
// Kiểm tra xem có dữ liệu nào trùng với userID không
console.log(check);