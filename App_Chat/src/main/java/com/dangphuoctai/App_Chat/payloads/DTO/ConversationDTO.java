package com.dangphuoctai.App_Chat.payloads.DTO;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ConversationDTO {
    private Long conversationId;

    private List<ConversationMemberDTO> conversationMembers;

    private String conversationName;

    private Boolean isGroup;

    private String avatar;

    private MessageDTO lastMessage;

}
