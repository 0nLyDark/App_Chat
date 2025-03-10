package com.dangphuoctai.App_Chat.payloads.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MessageStatusDTO {

    private Long messageStatusId;

    // private MessageDTO message;

    private ConversationMemberDTO member;

    private String icon;

}
