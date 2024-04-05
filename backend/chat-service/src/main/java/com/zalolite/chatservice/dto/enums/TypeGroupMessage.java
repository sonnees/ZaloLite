package com.zalolite.chatservice.dto.enums;

public enum TypeGroupMessage {
    TGM00, // notify from root user
    TGM01, // create group
    TGM02, // delete group
    TGM03, // append member
    TGM04, // append admin
    TGM05, // remove admin
    TGM06, // remove member
    TGM07, // change owner
    TGM08, // change name chat
    TGM09, // change avatar
    TGM10, // update setting change chat name and avatar
}
