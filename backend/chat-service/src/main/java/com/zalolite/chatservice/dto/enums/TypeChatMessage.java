package com.zalolite.chatservice.dto.enums;

public enum TypeChatMessage {
    TCM00, // notify from root user
    TCM01, // send message
    TCM02, // message delivery
    TCM03, // message read
    TCM04, // message hidden
    TCM05, // message recall
    TCM06, // user typing a text message
    TCM07, // append voter
    TCM08, // change voter
    TCM09, // lock voting
}
