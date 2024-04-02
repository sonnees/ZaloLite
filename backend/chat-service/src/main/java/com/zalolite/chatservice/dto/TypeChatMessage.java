package com.zalolite.chatservice.dto;

public enum TypeChatMessage {
    TCM00, // notify from root user
    TCM01, // send message
    TCM02, // message delivery
    TCM03, // message read
    TCM04, // message hidden
    TCM05, // message recall
    TCM06, // user typing a text message
}
