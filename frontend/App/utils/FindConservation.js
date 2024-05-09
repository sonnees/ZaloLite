function findConversationByID(conversations, chatID) {
    return conversations.find(conversation => conversation.chatID === chatID);
}
const findConversationByUserID = (data, userID) => {
    return data.conversations.find(conversation => conversation.id_UserOrGroup === userID) || null;
};
const findDeliveryUser = (data, userID) => {
    return data.deliveries.find(deliverie => deliverie.userID === userID) || null;
}
const findReadUser = (data, userID) => {
    // console.log("data:", data.reads);
    // console.log("userID:", userID);
    const readUser = data.reads.find(read => read.userID === userID) || null;
    // console.log("Value of findReadUser:", readUser);
    return readUser;
}

export { findConversationByID, findConversationByUserID, findDeliveryUser, findReadUser };

