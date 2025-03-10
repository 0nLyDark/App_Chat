package com.dangphuoctai.App_Chat.service;

import com.dangphuoctai.App_Chat.payloads.DTO.MessageDTO;
import com.dangphuoctai.App_Chat.payloads.Response.MessageResponse;

public interface MessageService {

    MessageDTO sendMessage(Long senderId, Long conversationId, String content);

    MessageResponse getMessageByConversationId(Long conversationId, Long userId, Integer pageNumber, Integer pageSize,
            String sortBy,
            String sortOrder);

    // MessageResponse getMessageByConversationId(Long conversationId, Long userId, Integer pageNumber, Integer pageSize,
    //         String sortBy,
    //         String sortOrder);

    MessageDTO retrieveMessages(Long messageId, Long userId);

    MessageDTO hiddenMessages(Long messageId, Long userId);

    MessageDTO emotionalMessages(Long messageId, Long userId, String icon);

}
