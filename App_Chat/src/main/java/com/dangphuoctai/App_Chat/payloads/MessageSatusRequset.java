package com.dangphuoctai.App_Chat.payloads;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MessageSatusRequset {
    private Long messageId;

    private String icon;
}
