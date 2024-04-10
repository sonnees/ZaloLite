package com.zalolite.accountservice.serialization;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

@AllArgsConstructor
@Component
public class JsonConverter {
    private ObjectMapper objectMapper;

    public <T> String objToString(T obj) {
        ObjectMapper objectMapper = new ObjectMapper();
        String objStr = null;
        try {
            objStr = objectMapper.writeValueAsString(obj);
        } catch (Exception e){
            return e.getMessage();
        }
        return objStr;
    }
}
