const AddListChatID = (conversation) => {
    const list = [];
    conversation.forEach((item) => {
        list.push(item.chatID);
    })
    return list;
}
export { AddListChatID }