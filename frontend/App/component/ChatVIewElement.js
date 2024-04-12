export { ChatItem, containsDoublePipe }
import React, { memo } from 'react';
import { ChatOfReCall } from './ChatOfRecall';
import { ChatListNoneRecall } from './ChatListNoneRecall';
import { MyMessageNoneRecall } from './MyMessageNoneRecall';
import { OpponentMessageNoneRecall } from './OpponentMessageNoneRecall';
const ChatItem = memo(({ item, conversationOpponent, myUserInfo }) => {
    const findParent = findTopChatActivity(item.parenID, conversationOpponent.topChatActivity)
    //Hiển thị bên đối phương
    if (item.userID !== myUserInfo.id) {
        if (!item.hidden.includes(myUserInfo.id)) {
            //Chat None Recall
            if (!item.recall) {
                if (item.contents.length > 1) {
                    return (
                        <ChatListNoneRecall
                            item={item}
                            conversationOpponent={conversationOpponent}
                            myUserInfo={myUserInfo}
                        />
                    );
                }
                else {
                    return (
                        <OpponentMessageNoneRecall
                            item={item}
                            conversationOpponent={conversationOpponent}
                            myUserInfo={myUserInfo}
                        />
                    );
                }
            }
            //Chat Recall
            else {
                return (
                    <ChatOfReCall item={item} myUserInfo={myUserInfo} conversationOpponent={conversationOpponent} />
                )
            }
        }
    }
    /// Hiển thị bên mình
    else {
        if (!item.hidden.includes(myUserInfo.id)) {
            if (!item.recall) {
                //Chat None Recall
                if (item.contents.length > 1) {
                    return (
                        <ChatListNoneRecall
                            item={item}
                            conversationOpponent={conversationOpponent}
                            myUserInfo={myUserInfo}
                        />
                    );
                }

                else {
                    return (
                        <MyMessageNoneRecall
                            item={item}
                            conversationOpponent={conversationOpponent}
                            myUserInfo={myUserInfo}
                        />
                    );
                }
            }
            //Chat Recall
            else {
                return (
                    <ChatOfReCall item={item} myUserInfo={myUserInfo} conversationOpponent={conversationOpponent} />
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