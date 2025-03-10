package com.dangphuoctai.App_Chat.service;

import java.io.IOException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.dangphuoctai.App_Chat.payloads.DTO.ConversationDTO;
import com.dangphuoctai.App_Chat.payloads.Response.ConversationResponse;
import com.dangphuoctai.App_Chat.payloads.Response.UserResponse;

public interface ConversationService {

    ConversationResponse getAllConversationbyUserId(Long userId, Boolean isGroup, Integer pageNumber, Integer pageSize,
            String sortBy,
            String sortOrder);

    UserResponse searchUserNotConversation(Long userId, String keyword, Long conversationId, Integer pageNumber,
            Integer pageSize,
            String sortBy,
            String sortOrder);

    ConversationDTO getConversationByPresonal(Long userId, Long friendId);

    ConversationDTO getConversationById(Long conversationId, Long userId);

    ConversationDTO createConversationGroup(List<Long> listFriendId, Long userId, String conversationName);

    ConversationDTO addMemberConversationGroup(List<Long> listFriendId, Long userId, Long conversationId);

    String outConversationGroup(Long conversationId, Long userId);

    String changeLeaderConversationGroup(Long conversationId, Long userId, Long leaderId);

    ConversationDTO updateAvatar(Long conversationId, Long userId, MultipartFile image) throws IOException;

    ConversationDTO updateConversationName(Long userId, ConversationDTO userDTO);

}
