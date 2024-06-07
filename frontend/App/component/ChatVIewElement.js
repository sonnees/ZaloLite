export { ChatItem, containsDoublePipe }
import React, { memo, useContext, useState } from 'react';
import { ChatOfReCall } from './ChatOfRecall';
import { ChatListNoneRecall } from './ChatListNoneRecall';
import { MyMessageNoneRecall } from './MyMessageNoneRecall';
import { OpponentMessageNoneRecall } from './OpponentMessageNoneRecall';
import { GlobalContext } from '../context/GlobalContext';
const ChatItem = memo(({ item, conversationOpponent, friend }) => {
    // console.log('ChatItem key =>>>>>>>>>>>>>>>>:', item.messageID);
    const { myUserInfo, setMyUserInfo, chatID, myProfile, setMyProfile,setComponentChatID } = useContext(GlobalContext)

    const findParent = findTopChatActivity(item.parenID, conversationOpponent.topChatActivity)
    const [parentMessage, setParentMessage] = useState()
    //Hiển thị bên đối phương
    if (findParent) {
        setParentMessage(
            <ChatItem item={findParent}
                conversationOpponent={conversationOpponent}
                 />
        );
    }
    if (item.userID !== myUserInfo.id) {
        if (!item.hidden || !item.hidden.includes(myUserInfo.id)) {
            //Chat None Recall
            if (!item.recall) {
                if (item.contents && item.contents.length > 1) {
                    return (
                        <ChatListNoneRecall
                            item={item}
                            conversationOpponent={conversationOpponent}
                            friend={friend}
                        />
                    );
                }
                else {
                    return (
                        <OpponentMessageNoneRecall
                            item={item}
                            conversationOpponent={conversationOpponent}
                            friend={friend}
                        />
                    );
                }
            }
            //Chat Recall
            else {
                return (
                    <ChatOfReCall item={item}  conversationOpponent={conversationOpponent} friend={friend} />
                )
            }
        }
    }
    /// Hiển thị bên mình
    else {
        if (!item.hidden || !item.hidden.includes(myUserInfo.id)) {
            if (!item.recall) {
                //Chat None Recall
                if (item.contents && item.contents.length > 1) {
                    return (
                        <ChatListNoneRecall
                            item={item}
                            conversationOpponent={conversationOpponent}
                            friend={friend}
                        />
                    );
                }

                else {
                    return (
                        <MyMessageNoneRecall
                            item={item}
                            conversationOpponent={conversationOpponent}
                            friend={friend}
                        />
                    );
                }
            }
            //Chat Recall
            else {
                return (
                    <ChatOfReCall item={item}  conversationOpponent={conversationOpponent} friend={friend} />
                )
            }
        }
    }
});

function containsDoublePipe(key) {
    return key.indexOf('|') !== key.lastIndexOf('|');
}
function findTopChatActivity(messageID, topChatActivity) {
    for (let i = 0; i < topChatActivity.length; i++) {
        if (topChatActivity[i].messageID === messageID) {
            return topChatActivity[i];
        }
    }
    return null;
}