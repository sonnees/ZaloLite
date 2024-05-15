function getDataFromConversationsAndChatData(conversations, chatData) {
    return {
        chatID: conversations.chatID,
        chatName: conversations.chatName,
        chatAvatar: conversations.chatAvatar,
        type: conversations.type,
        connectAt: conversations.connectAt,
        lastUpdateAt: conversations.lastUpdateAt,
        deliveries: conversations.deliveries,
        reads: conversations.reads,
        topChatActivity: chatData,
    }
}

const findConversationByUserID = (data, userID) => {
    return data.conversations.find(conversation => conversation.id_UserOrGroup === userID) || null;
};
export { findConversationByUserID, getDataFromConversationsAndChatData };