package com.zalolite.accountservice.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum Type {
    personal(0);

    private final int value;
}
