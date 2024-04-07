const findChatIDByUserID = (data, userID, myUserID) => {
    // Duyệt qua danh sách conversations và friendRequests để tìm userID
    for (const conversation of data.conversations) {
        if (conversation.chatID !== myUserID) {
            return conversation.chatID;
        }
    }
    for (const friendRequest of data.friendRequests) {
        if (friendRequest.userID !== myUserID) {
            return friendRequest.userID;
        }
    }
    return null; // Trả về null nếu không tìm thấy userID
};
export { findChatIDByUserID }
const data = {
    "conversations":
        [
            {
                "chatAvatar": "https://upanh123.com/wp-content/uploads/2020/10/Anh-gai-xinh-lam-anh-dai-dien-facebook1.jpg",
                "chatID": "5b685d06-8fbe-4ab7-8053-7746760a8000",
                "chatName": "Ánh Tina", "connectAt": "2024-03-28T15:34:44.288+00:00", "deliveries": [Array], "lastUpdateAt": "2024-03-28T15:34:44.288+00:00", "reads": [Array], "topChatActivity": [Array], "type": "REQUESTED"
            },
            {
                "chatAvatar": "https://res.cloudinary.com/dj9ulywm8/image/upload/v1711638195/yaelqfegjxfkbjdmwyef.png",
                "chatID": "5b685d06-8fbe-4ab7-8053-7746760a8001", "chatName": "Lê Hữu Bằng", "connectAt": "2024-03-28T15:34:51.667+00:00", "deliveries": [Array], "lastUpdateAt": "2024-03-29T12:55:40.075+00:00", "reads": [Array], "topChatActivity": [Array], "type": "REQUESTED"
            },
            {
                "chatAvatar": "https://dungplus.com/wp-content/uploads/2019/12/girl-xinh-2-600x750.jpg",
                "chatID": "5b685d06-8fbe-4ab7-8053-7746760a8002", "chatName": "Nguyễn Thị Việt Chi", "connectAt": "2024-03-28T15:36:25.978+00:00", "deliveries": [Array], "lastUpdateAt": "2024-03-28T15:36:25.978+00:00", "reads": [Array], "topChatActivity": [Array], "type": "REQUESTED"
            },
            {
                "chatAvatar": "https://hexcdn.hexasync.vn/wp-content/uploads/2023/01/hexasync_huong-dan-dang-ky-zalo-oa-cho-doanh-nghiep-year-moi-quan-he-hop-tac-giua-haravan-va-beehexa-copy-7.png.webp",
                "chatID": "49a9768c-a2a8-0000-9653-5291b9718dc9", "chatName": "Zalo Lite", "connectAt": "2024-04-03T03:08:17.329+00:00", "deliveries": [Array], "lastUpdateAt": "2024-04-03T03:08:17.329+00:00", "reads": [Array], "topChatActivity": [Array], "type": "GROUP"
            },
            {
                "chatAvatar": "https://1.bp.blogspot.com/-eN47VVX_K_o/XaPQecwuXjI/AAAAAAAAFF0/5RjYlNU-EBYAt9TLMwrW5IgD7KcSjptBwCLcBGAsYHQ/s640/Love1.jpg",
                "chatID": "6a3a53e6-45ec-46ff-acd3-5eb8007837e2", "chatName": "Love ❤️", "connectAt": "2024-04-03T03:10:35.879+00:00", "deliveries": [Array], "lastUpdateAt": "2024-04-03T03:10:35.879+00:00", "reads": [Array], "topChatActivity": [Array], "type": "GROUP"
            },
            {
                "chatAvatar": "https://blog.urbancatalyst.com/hubfs/Deadline.jpg",
                "chatID": "c6920ec4-d53f-49df-9896-ee5be91dcf62",
                "chatName": "Hội nhũng người bị Deadline dí",
                "connectAt": "2024-04-03T03:13:13.351+00:00",
                "deliveries": [Array],
                "lastUpdateAt": "2024-04-03T03:13:13.351+00:00",
                "reads": [Array],
                "topChatActivity": [Array],
                "type": "GROUP"
            },
            {
                "chatAvatar": "https://dungplus.com/wp-content/uploads/2019/12/girl-xinh-1-600x750.jpg",
                "chatID": "6a1c22fa-73d8-4332-8053-7746760a8354",
                "chatName": "Thư Minh",
                "connectAt": "2024-04-03T03:29:53.264+00:00",
                "deliveries": [Array],
                "lastUpdateAt": "2024-04-02T10:54:40.075+00:00",
                "reads": [Array],
                "topChatActivity": [Array],
                "type": "STRANGER"
            },
            {
                "chatAvatar": "https://dungplus.com/wp-content/uploads/2019/12/girl-xinh-20.jpg",
                "chatID": "51600131-f45b-4101-8053-7746760a8354",
                "chatName": "Huyền Trang",
                "connectAt": "2024-04-03T03:34:49.539+00:00",
                "deliveries": [Array],
                "lastUpdateAt": "2024-04-03T03:34:49.539+00:00",
                "reads": [Array],
                "topChatActivity": [Array],
                "type": "STRANGER"
            },
            {
                "chatAvatar": "https://dungplus.com/wp-content/uploads/2019/12/girl-xinh-27.jpg",
                "chatID": "0a2f80df-655f-47f7-8053-7746760a8354", "chatName": "Thúy An", "connectAt": "2024-04-03T03:36:18.506+00:00",
                "deliveries": [Array],
                "lastUpdateAt": "2024-04-03T12:55:40.075+00:00",
                "reads": [Array],
                "topChatActivity": [Array],
                "type": "STRANGER"
            },
            {
                "chatAvatar": "https://res.cloudinary.com/dj9ulywm8/image/upload/v1711636843/exftni5o9msptdxgukhk.png",
                "chatID": "79feacfd-507b-4721-8053-7746760a8354", "chatName": "Haley Neith", "connectAt": "2024-04-05T14:46:56.108+00:00",
                "deliveries": [Array],
                "lastUpdateAt": "2024-04-05T14:46:56.108+00:00",
                "reads": [Array],
                "topChatActivity": [Array],
                "type": "REQUESTED"
            }],
    "friendRequests": [
        { "description": "Tôi muốn được kết bạn với pro!", "isSender": false, "sendAt": "2024-03-28T15:34:44.138+00:00", "userAvatar": "https://upanh123.com/wp-content/uploads/2020/10/Anh-gai-xinh-lam-anh-dai-dien-facebook1.jpg", "userID": "5b685d06-8fbe-4ab7-a18b-b713b2ba4daa", "userName": "Ánh Tina" },
        { "description": "Tôi muốn được kết bạn với pro!", "isSender": false, "sendAt": "2024-03-28T15:34:51.640+00:00", "userAvatar": "https://res.cloudinary.com/dj9ulywm8/image/upload/v1711638195/yaelqfegjxfkbjdmwyef.png", "userID": "f1cee7b8-7712-4042-9e94-17bd21209a62", "userName": "Lê Hữu Bằng" },
        { "description": "Tôi muốn được kết bạn với pro!", "isSender": false, "sendAt": "2024-03-28T15:36:25.955+00:00", "userAvatar": "https://dungplus.com/wp-content/uploads/2019/12/girl-xinh-2-600x750.jpg", "userID": "b95ad4f4-68b0-4dd8-a4db-59b5874c4bdf", "userName": "Nguyễn Thị Việt Chi" },
        { "description": "Tôi muốn được kết bạn với pro!", "isSender": false, "sendAt": "2024-04-05T14:46:55.226+00:00", "userAvatar": "https://res.cloudinary.com/dj9ulywm8/image/upload/v1711636843/exftni5o9msptdxgukhk.png", "userID": "79feacfd-507b-4721-b7b0-92869f06cf20", "userName": "Haley Neith" }],
    "id": "26ce60d1-64b9-45d2-8053-7746760a8354"
};

const myUserID = "26ce60d1-64b9-45d2-8053-7746760a8354"; // Thay thế bằng myUserID thực tế của bạn


const userIDToFind = "f1cee7b8-7712-4042-9e94-17bd21209a62"; // Thay thế bằng userID bạn muốn tìm

const chatID = findChatIDByUserID(data, userIDToFind, myUserID);
if (chatID) {
    console.log(`Chat ID của userID ${userIDToFind} là: ${chatID}`);
} else {
    console.log(`Không tìm thấy chat ID cho userID ${userIDToFind}`);
}
// 5b685d06 - 8fbe - 4ab7 - 8053 - 7746760a8001

// Hàm render nội dung của tin nhắn
const renderContent = () => {
    return contents.map((content, index) => {
        if (content.key === "image") {
            return (
                <img
                    key={index}
                    src={content.value}
                    alt="Image"
                    className="mb-2 mr-2 h-auto max-w-[200px]"
                />
            );
        } else if (content.key === "text") {
            return (
                <p
                    key={index}
                    className={`text-[#081c36] ${userID !== userIDFromCookies ? "" : ""
                        }`}
                >
                    {content.value}
                </p>
            );
        } else if (content.key === "link") {
            return <LinkPreview key={index} url={content.value} />;
        } else if (content.key.startsWith("zip")) {
            const [fileLabel, fileName, fileSize] = content.key.split("|");
            return (
                <FileLink
                    key={index}
                    fileName={fileName}
                    fileSize={fileSize}
                    fileURL={content.value}
                    fileKey={content.key}
                />
            );
        } else if (content.key === "mp4") {
            return (
                <video key={index} controls className="h-auto max-w-[200px]">
                    <source src={content.value} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            );
        } else if (content.key === "emoji") {
            return <p key={index}>{content.value}</p>; // Hiển thị emoji dưới dạng Unicode
        }
        // Thêm các trường hợp xử lý cho các key khác nếu cần
        return null; // Trường hợp không xác định, trả về null
    });
};