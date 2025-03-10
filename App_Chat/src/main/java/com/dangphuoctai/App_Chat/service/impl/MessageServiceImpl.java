package com.dangphuoctai.App_Chat.service.impl;

import com.dangphuoctai.App_Chat.entity.Message;
import com.dangphuoctai.App_Chat.entity.MessageStatus;


import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dangphuoctai.App_Chat.entity.Conversation;
import com.dangphuoctai.App_Chat.entity.ConversationMember;
import com.dangphuoctai.App_Chat.entity.User;
import com.dangphuoctai.App_Chat.exceptions.ResourceNotFoundException;
import com.dangphuoctai.App_Chat.payloads.DTO.MessageDTO;
import com.dangphuoctai.App_Chat.payloads.Response.MessageResponse;
import com.dangphuoctai.App_Chat.repository.ConversationMemberRepo;
import com.dangphuoctai.App_Chat.repository.ConversationRepo;
import com.dangphuoctai.App_Chat.repository.MessageStatusRepo;
import com.dangphuoctai.App_Chat.repository.MessagesRepo;
import com.dangphuoctai.App_Chat.repository.UserRepo;
import com.dangphuoctai.App_Chat.service.MessageService;

@Service
@Transactional
public class MessageServiceImpl implements MessageService {

        @Autowired
        private ModelMapper modelMapper;

        @Autowired
        private UserRepo userRepo;

        @Autowired
        private ConversationMemberRepo conversationMemberRepo;

        @Autowired
        private ConversationRepo conversationRepo;

        @Autowired
        private MessagesRepo messagesRepo;

        @Autowired
        private MessageStatusRepo messageStatusRepo;

        @Override
        public MessageDTO sendMessage(Long senderId, Long conversationId, String content) {
                ConversationMember senderMember = conversationMemberRepo
                                .findByUserUserIdAndConversationConversationId(senderId, conversationId)
                                .orElseThrow(() -> new ResourceNotFoundException("ConversationMember",
                                                "userId and conversation_id",
                                                senderId + " and " + conversationId));
                if (senderMember.getIsOut()) {
                        throw new AccessDeniedException("User is not a member of the conversation");
                }
                Message message = new Message();
                message.setSenderMember(senderMember);
                message.setConversation(senderMember.getConversation());
                message.setContent(content);
                message.setCreatedAt(new Date());
                message.setIsDeleted(false);
                Conversation conversation = senderMember.getConversation();
                List<MessageStatus> listMessageStatus = conversation.getConversationMembers().stream()
                                .filter(member -> !member.getIsOut()).map(member -> {
                                        MessageStatus messageStatus = new MessageStatus();
                                        messageStatus.setMember(member);
                                        messageStatus.setIsDeleted(false);
                                        messageStatus.setMessage(message);
                                        return messageStatus;
                                }).collect(Collectors.toList());
                // Save messageStatus and message
                messageStatusRepo.saveAll(listMessageStatus);
                messagesRepo.save(message);
                conversation.setLastMessage(message);
                // Add message
                senderMember.getMessages().add(message);
                conversation.getMessages().add(message);
                return modelMapper.map(message, MessageDTO.class);
        }

        @Override
        public MessageResponse getMessageByConversationId(Long conversationId, Long userId, Integer pageNumber,
                        Integer pageSize,
                        String sortBy,
                        String sortOrder) {
                Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending()
                                : Sort.by(sortBy).descending();
                Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);

                // check if user is a member of the conversation or user is an admin
                Conversation conversation = conversationRepo.findById(conversationId)
                                .orElseThrow(() -> new ResourceNotFoundException("Conversation", "conversationId",
                                                conversationId));
                User user = userRepo.findById(userId)
                                .orElseThrow(() -> new ResourceNotFoundException("User", "userId", userId));
                boolean isMember = conversation.getConversationMembers().stream()
                                .anyMatch(member -> member.getUser().getUserId().equals(userId));
                boolean isAdmin = user.getRoles().stream().anyMatch(role -> role.getRoleName().equals("ROLE_ADMIN"));
                if (isMember == false && isAdmin == false) {
                        throw new AccessDeniedException("You are not a member of this conversation");
                }
                Page<Message> pageMessage;
                List<MessageDTO> messagesDTO;
                // get messages
                if (isAdmin) {
                        pageMessage = messagesRepo.findAllByConversationConversationId(conversationId,
                                        pageDetails);
                        messagesDTO = pageMessage.getContent().stream()
                                        .map(message -> modelMapper.map(message, MessageDTO.class)).toList();
                } else {
                        pageMessage = messagesRepo.findAllByConversationIdAndUserId(conversationId, userId,
                                        pageDetails);
                        messagesDTO = pageMessage.getContent().stream()
                                        .map(message -> {
                                                MessageDTO messageDTO = modelMapper.map(message, MessageDTO.class);
                                                if (messageDTO.getIsDeleted()) {
                                                        messageDTO.setContent("Tin nhắn đã được thu hồi");
                                                }
                                                return messageDTO;
                                        }).toList();
                }

                // Return messageResponse
                MessageResponse messageResponse = new MessageResponse();
                messageResponse.setContent(messagesDTO);
                messageResponse.setPageNumber(pageMessage.getNumber());
                messageResponse.setPageSize(pageMessage.getSize());
                messageResponse.setTotalElements(pageMessage.getTotalElements());
                messageResponse.setTotalPages(pageMessage.getTotalPages());

                return messageResponse;
        }

        @Override
        public MessageDTO retrieveMessages(Long messageId, Long userId) {
                Message message = messagesRepo.findById(messageId)
                                .orElseThrow(() -> new ResourceNotFoundException("Messages", "messageId", messageId));
                if (message.getSenderMember().getUser().getUserId() != userId || message.getSenderMember().getIsOut()) {
                        throw new AccessDeniedException("You do not have permission to access messages");
                }
                message.setIsDeleted(true);
                messagesRepo.save(message);
                MessageDTO messageDTO = modelMapper.map(message, MessageDTO.class);
                messageDTO.setContent("");
                return messageDTO;
        }

        @Override
        public MessageDTO hiddenMessages(Long messageId, Long userId) {
                MessageStatus messageStatus = messageStatusRepo
                                .findByMessageMessageIdAndMemberUserUserId(messageId, userId)
                                .orElseThrow(() -> new ResourceNotFoundException("MessageStatus",
                                                "messageId And userId", messageId + " and " + userId));
                messageStatus.setIsDeleted(true);
                messageStatusRepo.save(messageStatus);
                return modelMapper.map(messageStatus.getMessage(), MessageDTO.class);
        }

        @Override
        public MessageDTO emotionalMessages(Long messageId, Long userId, String icon) {
                MessageStatus messageStatus = messageStatusRepo
                                .findByMessageMessageIdAndMemberUserUserId(messageId, userId)
                                .orElseThrow(() -> new ResourceNotFoundException("MessageStatus",
                                                "messageId and userId", messageId + " and " + userId));
                if (messageStatus.getMember().getIsOut()) {
                        throw new AccessDeniedException("You do not have permission to access messages");
                }
                if (icon.equals(messageStatus.getIcon())) {
                        messageStatus.setIcon(null);
                } else {
                        messageStatus.setIcon(icon);
                }
                messageStatus = messageStatusRepo.save(messageStatus);

                return modelMapper.map(messageStatus.getMessage(), MessageDTO.class);
        }

}
