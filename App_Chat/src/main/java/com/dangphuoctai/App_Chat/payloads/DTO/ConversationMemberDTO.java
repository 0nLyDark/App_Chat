package com.dangphuoctai.App_Chat.payloads.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ConversationMemberDTO {
    private Long conversationMemberId;

    private Boolean isOut;

    private String role;

    private UserDTO user;
}
