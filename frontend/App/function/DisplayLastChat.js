function getLastChatForEachID(chat) {
    const lastChat = {};
    chat.forEach(element => {
        if (element.chatActivity.length > 0) {
            id = element._id
            lastChat = {
                id: id,
                chat: element.chatActivity[element.chatActivity.length - 1],
                reads: element.reads,
                deliveries: element.deliveries,
            }
        }
    });
    return lastChat;
};
function getlastContent(lastChat) {
    const lastContent = {};
    // lastChat.forEach(element => {
    //     messageID = element.chat.
    //         // lastContent[]
    // });
    return lastContent
}
export { getLastChatForEachID };
