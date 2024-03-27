const chat = [{
    _id: "uuid1",
    chatActivity: [
        // Thêm các tin nhắn cũ hơn ở đây
        {
            messageID: "mmid4",
            userID: "1",
            timetamp: "2024-01-19T18:45:00Z",
            parentID: "",
            content: [{
                key: "text",
                value: "Xin chào! Bạn đã ăn tối chưa?"
            }],
            status: {
                isSent: true,
                delivery: ["1"],
                read: []
            }
        }, {
            messageID: "mmid5",
            userID: "2",
            timetamp: "2024-01-19T19:00:00Z",
            parentID: "",
            content: [{
                key: "text",
                value: "Chưa, bạn muốn đi ăn cùng không?"
            }],
            status: {
                isSent: true,
                delivery: ["1"],
                read: []
            }
        }, {
            messageID: "mmid6",
            userID: "1",
            timetamp: "2024-01-19T19:05:00Z",
            parentID: "",
            content: [{
                key: "text",
                value: "Được chứ, hẹn bạn ở đâu?"
            }],
            status: {
                isSent: true,
                delivery: ["1"],
                read: []
            }
        }, {
            messageID: "mmid7",
            userID: "2",
            timetamp: "2024-01-19T19:10:00Z",
            parentID: "",
            content: [{
                key: "text",
                value: "Hôm nay mình ăn ở nhà hàng gần công viên."
            }],
            status: {
                isSent: true,
                delivery: ["1"],
                read: []
            }
        },
        {
            messageID: "mmid1",
            userID: "1",
            timetamp: "2024-01-20T12:30:00Z",
            parentID: "",
            content: [{
                key: "text",
                value: "Chào bạn! Hôm nay bạn đã làm gì mới?"
            }],
            status: {
                isSent: true,
                delivery: ["1"],
                read: [2]
            }
        },
        {
            messageID: "mmid2",
            userID: "2",
            timetamp: "2024-01-20T12:30:00Z",
            parentID: "",
            content: [{
                key: "text",
                value: "Tôi đã đi chơi với bạn bè."
            }],
            status: {
                isSent: true,
                delivery: ["1"],
                read: []
            }
        },
        {
            messageID: "mmid3",
            userID: "2",
            timetamp: "2024-01-20T11:55:00Z",
            parentID: "",
            content: [{
                key: "text",
                value: "Oke kkkk"
            }],
            status: {
                isSent: true,
                delivery: ["1"],
                read: []
            }
        },

    ]
}]
export default chat;