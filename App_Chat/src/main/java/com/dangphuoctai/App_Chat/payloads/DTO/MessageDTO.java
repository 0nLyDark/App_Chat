package com.dangphuoctai.App_Chat.payloads.DTO;

import java.util.Date;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MessageDTO {

    private Long messageId;

    private ConversationMemberDTO senderMember;

    private Long conversationId;

    private List<MessageStatusDTO> listMessageStatus;

    private Boolean isDeleted;

    private String content;

    private Date createdAt;
}
