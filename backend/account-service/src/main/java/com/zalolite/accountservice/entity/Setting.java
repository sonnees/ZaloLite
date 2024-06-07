package com.zalolite.accountservice.entity;

import com.zalolite.accountservice.enums.AllowMessaging;
import com.zalolite.accountservice.enums.ShowBirthday;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@AllArgsConstructor
@Getter
@Setter
public class Setting {
    private AllowMessaging allowMessaging;
    private ShowBirthday showBirthday;

    public Setting() {
        this.allowMessaging = AllowMessaging.EVERYONE;
        this.showBirthday = ShowBirthday.SHOW_DMY;
    }
}
