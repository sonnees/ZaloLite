package com.zalolite.chatservice.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class GroupSetting {
    private Boolean changeChatNameAndAvatar;
    private Boolean pinMessages;
    private Boolean sendMessages;
    private Boolean membershipApproval;
    private Boolean createNewPolls;

}
