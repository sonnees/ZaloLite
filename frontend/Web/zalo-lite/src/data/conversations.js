const conversations = [{
        userID: "2",
        userName: "Hà Anh Thảo",
        userAvatar: "https://avatars.githubusercontent.com/u/81128952?v=4",
        chatID: "1",
        type: "friend",
        groupID: "",
        connectAt: "2024-01-20T12:00:00Z",
        lastUpdateAt: "2024-01-20T14:30:00Z",
        topChatActivity: [{
            _id: "uuid1",
            chatActivity: [
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
                // Thêm các tin nhắn khác ở đây
            ]
        }]
    },
    {
        userID: "3",
        userName: "Hiếu Đông",
        userAvatar: "https://s120-ava-talk.zadn.vn/b/1/6/9/2/120/49c735f44a48922c94785739bc2b91e7.jpg",
        chatID: "",
        type: "friend",
        groupID: "",
        connectAt: "2024-01-20T14:30:00Z",
        lastUpdateAt: "2024-01-20T14:30:00Z",
        topChatActivity: [{
            _id: "uuid2",
            chatActivity: [{
                messageID: "mmid2",
                userID: "1",
                timetamp: "2024-01-16T14:30:00Z",
                parentID: "",
                content: [{
                    key: "text",
                    value: "Ông làm code đến đâu rồi"
                }],
                status: {
                    isSent: true,
                    delivery: ["1"],
                    read: []
                }
            }]
        }]
    }, {
        userID: "4",
        userName: "Bích Trâm",
        userAvatar: "https://zpsocial-f48-org.zadn.vn/8f551df048eca6b2fffd.jpg",
        chatID: "",
        type: "friend",
        groupID: "",
        connectAt: "2024-01-20T14:30:00Z",
        lastUpdateAt: "2024-01-20T14:30:00Z",
        topChatActivity: [{
            _id: "uuid3",
            chatActivity: [{
                    messageID: "mmid3",
                    userID: "3",
                    timetamp: "2024-01-20T14:30:00Z",
                    parentID: "",
                    content: [{
                        key: "text",
                        value: "Hello! Hôm nay của anh thế nào?"
                    }],
                    status: {
                        isSent: true,
                        delivery: ["1"],
                        read: []
                    }
                },
                {
                    messageID: "mmid3",
                    userID: "3",
                    timetamp: "2024-01-16T02:30:00Z",
                    parentID: "",
                    content: [{
                        key: "text",
                        value: "Anh ăn gì chưa"
                    }],
                    status: {
                        isSent: true,
                        delivery: ["1"],
                        read: []
                    }
                }
            ]
        }]
    },
    {
        userID: "5",
        userName: "Pé Yêu",
        userAvatar: "https://luv.vn/wp-content/uploads/2021/12/hinh-anh-gai-mat-vuong-xinh-dep-12.jpg",
        chatID: "",
        type: "friend",
        groupID: "",
        connectAt: "2024-01-20T14:30:00Z",
        lastUpdateAt: "2024-01-20T14:30:00Z",
        topChatActivity: [{
            _id: "uuid4",
            chatActivity: [{
                messageID: "mmid4",
                userID: "4",
                timetamp: "2024-01-15T14:30:00Z",
                parentID: "",
                content: [{
                    key: "text",
                    value: "Dạ, Em đang rảnh đây."
                }],
                status: {
                    isSent: true,
                    delivery: ["1"],
                    read: []
                }
            }]
        }]
    }, {
        userID: "6",
        userName: "Mai Linh",
        userAvatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSS3FjhqmMmpDz8QyIE7PkxUm1xmHn1TY9ARw&usqp=CAU",
        chatID: "",
        type: "friend",
        groupID: "",
        connectAt: "2024-01-20T14:30:00Z",
        lastUpdateAt: "2024-01-20T14:30:00Z",
        topChatActivity: [{
            _id: "uuid5",
            chatActivity: [{
                messageID: "mmid5",
                userID: "1",
                timetamp: "2024-01-14T14:30:00Z",
                parentID: "",
                content: [{
                    key: "text",
                    value: "Đã xem phim chưa?"
                }],
                status: {
                    isSent: true,
                    delivery: ["1"],
                    read: []
                }
            }]
        }]
    }, {
        userID: "7",
        userName: "Quang Minh",
        userAvatar: "https://htmediagroup.vn/wp-content/uploads/2021/06/Anh-profile-46.jpg",
        chatID: "",
        type: "friend",
        groupID: "",
        connectAt: "2024-01-20T14:30:00Z",
        lastUpdateAt: "2024-01-20T14:30:00Z",
        topChatActivity: [{
            _id: "uuid6",
            chatActivity: [{
                messageID: "mmid6",
                userID: "6",
                timetamp: "2023-12-10T14:30:00Z",
                parentID: "",
                content: [{
                    key: "text",
                    value: "Chào bạn! Hôm nay bạn đã làm gì mới? Tôi hy vọng bạn có một ngày tốt lành và đầy ý nghĩa!"
                }],
                status: {
                    isSent: true,
                    delivery: ["1"],
                    read: []
                }
            }]
        }]
    },
    {
        userID: 8,
        userAvatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsxmJ_6AgWofnHmTSdCBopgOXiQMZPzvc-vWT_Vvd2B-BvMxzI6Vp7OCE3tuWuXIwx3aY&usqp=CAU",
        userName: "Trang Hồ",
        chatID: "2",
        type: "friend",
        groupID: "",
        connectAt: "2024-01-21T10:45:00Z",
        lastUpdateAt: "2024-01-21T11:15:00Z",
        topChatActivity: [{
            _id: "uuid2",
            chatActivity: [{
                messageID: "mmid4",
                userID: "1",
                timetamp: "2023-11-10T11:00:00Z",
                parentID: "",
                content: [{
                    key: "text",
                    value: "Cảm ơn bạn đã đọc tin nhắn của tôi."
                }],
                status: {
                    isSent: true,
                    delivery: ["7"],
                    read: []
                }
            }]
        }]
    }, {
        userID: 9,
        userAvatar: "https://hthaostudio.com/wp-content/uploads/2019/08/Nam-11-min.jpg",
        userName: "Tuấn Kiệt",
        chatID: "3",
        type: "group",
        groupID: "g1",
        connectAt: "2024-01-21T08:00:00Z",
        lastUpdateAt: "2024-01-21T11:30:00Z",
        topChatActivity: [{
            _id: "uuid3",
            chatActivity: [{
                messageID: "mmid5",
                userID: "8",
                timetamp: "2023-07-21T11:15:00Z",
                parentID: "",
                content: [{
                    key: "text",
                    value: "Thông báo quan trọng! Đừng quên tham gia sự kiện vào ngày mai."
                }],
                status: {
                    isSent: true,
                    delivery: ["8"],
                    read: []
                }
            }]
        }]
    }, {
        userID: 10,
        userAvatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOjVTVcNlPaeEpJnMLi3IGfoSlmZ-jj4MJpA&usqp=CAU",
        userName: "Linh Nhi",
        chatID: "4",
        type: "friend",
        groupID: "",
        connectAt: "2024-01-21T09:30:00Z",
        lastUpdateAt: "2024-01-21T10:30:00Z",
        topChatActivity: [{
            _id: "uuid4",
            chatActivity: [{
                messageID: "mmid6",
                userID: "1",
                timetamp: "2023-05-21T10:00:00Z",
                parentID: "",
                content: [{
                    key: "text",
                    value: "Mình rất vui khi nhận được tin nhắn của bạn."
                }],
                status: {
                    isSent: true,
                    delivery: ["9"],
                    read: []
                }
            }]
        }]
    }, {
        userID: 11,
        userAvatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRw6-fmpGWQFg8JA4eUKWwGwYNgS4H-FyLtnQ&usqp=CAU",
        userName: "Phương Anh",
        chatID: "5",
        type: "friend",
        groupID: "",
        connectAt: "2024-01-21T07:45:00Z",
        lastUpdateAt: "2024-01-21T09:30:00Z",
        topChatActivity: [{
            _id: "uuid5",
            chatActivity: [{
                messageID: "mmid7",
                userID: "10",
                timetamp: "2023-04-21T08:30:00Z",
                parentID: "",
                content: [{
                    key: "text",
                    value: "Bình thường thôi. Bạn đã ăn trưa chưa?"
                }],
                status: {
                    isSent: true,
                    delivery: ["10"],
                    read: []
                }
            }]
        }]
    },
    // {
    //     userID: 11,
    //     userAvatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmSlqvXJn5BzWQlTak89FL-NbRIpndsNxFWg&usqp=CAU",
    //     userName: "Phương Nam",
    //     msg: "À, mình rất vui!",
    //     time: "1 giờ",
    //     unread: 0,
    // },
    // {
    //     userID: 12,
    //     userAvatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlb38HezTM0NVDza71H9dzD1Pjpc0POT1ktg&usqp=CAU",
    //     userName: "Minh Nam",
    //     msg: "À, mình rất vui!",
    //     time: "1 giờ",
    //     unread: 0,
    // },
    // , {
    //     userID: 13,
    //     userAvatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVl_S9KDd8spljejf8DtrGNlgEbMKB24OPUDKlQUZWd89USkHBYRHWrhHKw0oc3ZecR9U&usqp=CAU",
    //     userName: "Phương Anh",
    //     msg: "Bình thường thôi.",
    //     time: "4 giờ",
    //     unread: 1,
    // }, {
    //     userID: 14,
    //     userAvatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxfNQZ4dI6KAKWVVy9eHMPY3C4PF1w1r9fgQ&usqp=CAU",
    //     userName: "Phương Nam",
    //     msg: "À, mình rất vui!",
    //     time: "1 giờ",
    //     unread: 0,
    // }, {
    //     userID: 15,
    //     userAvatar: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlb38HezTM0NVDza71H9dzD1Pjpc0POT1ktg&usqp=CAU",
    //     userName: "Minh Nam",
    //     msg: "À, mình rất vui!",
    //     time: "1 giờ",
    //     unread: 0,
    // }
];

export default conversations;