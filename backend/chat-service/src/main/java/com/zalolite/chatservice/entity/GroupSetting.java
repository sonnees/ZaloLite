package com.zalolite.chatservice.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class GroupSetting {
    private Boolean changeChatNameAndAvatar;
    private Boolean pinMessages;
    private Boolean sendMessages;
    private Boolean membershipApproval;
    private Boolean createNewPolls;

    public GroupSetting() {
        this.changeChatNameAndAvatar = true;
        this.pinMessages = true;
        this.sendMessages = true;
        this.membershipApproval = true;
        this.createNewPolls = true;
    }
}
