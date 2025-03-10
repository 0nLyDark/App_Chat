package com.dangphuoctai.App_Chat.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.dangphuoctai.App_Chat.config.UserInfoConfig;
import com.dangphuoctai.App_Chat.payloads.MessageSatusRequset;
import com.dangphuoctai.App_Chat.payloads.DTO.ConversationDTO;
import com.dangphuoctai.App_Chat.payloads.DTO.MessageDTO;
import com.dangphuoctai.App_Chat.service.ConversationService;
import com.dangphuoctai.App_Chat.service.FriendService;
import com.dangphuoctai.App_Chat.service.MessageService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PutMapping;

@RestController
public class WebSocketController {
        @Autowired
        private SimpMessagingTemplate messagingTemplate;

        @Autowired
        private FriendService friendService;

        @Autowired
        private MessageService messageService;

        @Autowired
        private ConversationService conversationService;

        @PostMapping("/hello")
        @MessageMapping("/hello")
        @SendTo("/topic/greetings")
        public String HelloMessage(@Payload String message, SimpMessageHeaderAccessor headerAccessor) {
                UserInfoConfig user = (UserInfoConfig) headerAccessor.getUser();
                System.out.println("hhhhhhhhhhhhhhhhhh   " + user);

                return message;
        }

        @PostMapping("/messages")
        @MessageMapping("/messages")
        public MessageDTO sendMessage(@Payload MessageDTO message,
                        SimpMessageHeaderAccessor headerAccessor) {
                UserInfoConfig user = (UserInfoConfig) headerAccessor.getUser();
                System.out.println("hhhhhhhhhhhhhhhhhh   " + user);
                MessageDTO messageDTO = messageService.sendMessage(user.getUserId(), message.getConversationId(),
                                message.getContent());
                System.out.println("hhhhhhhhhhhhhhhhhh   " + message);
                messagingTemplate.convertAndSend("/queue/conversation/" + message.getConversationId(), messageDTO);
                return messageDTO;
        }

        @PutMapping("/messages")
        @MessageMapping("/messages/retrieve")
        public MessageDTO retrieveMessage(MessageDTO message,
                        SimpMessageHeaderAccessor headerAccessor) {
                UserInfoConfig user = (UserInfoConfig) headerAccessor.getUser();
                System.out.println("hhhhhhhhhhhhhhhhhh   " + user);
                MessageDTO messageDTO = messageService.retrieveMessages(message.getMessageId(), user.getUserId());
                messagingTemplate.convertAndSend(
                                "/queue/conversation/" + messageDTO.getConversationId() + "/retrieveMessage",
                                messageDTO);
                return messageDTO;
        }

        @MessageMapping("/messages/icon")
        public MessageDTO emotionalMessage(MessageSatusRequset messagesStatus,
                        SimpMessageHeaderAccessor headerAccessor) {
                UserInfoConfig user = (UserInfoConfig) headerAccessor.getUser();
                System.out.println("hhhhhhhhhhhhhhhhhh   " + user);
                MessageDTO messageDTO = messageService.emotionalMessages(messagesStatus.getMessageId(),
                                user.getUserId(),
                                messagesStatus.getIcon());
                messagingTemplate.convertAndSend("/queue/conversation/" + messageDTO.getConversationId() + "/icon",
                                messageDTO);
                return messageDTO;
        }

        @SubscribeMapping("/queue/conversation/{conversationId}")
        public ConversationDTO subscribeConversation(@PathVariable Long conversationId,
                        SimpMessageHeaderAccessor headerAccessor) {
                UserInfoConfig user = (UserInfoConfig) headerAccessor.getUser();
                System.out.println("hhhhhhhhhhhhhhhhhh   " + user);
                ConversationDTO conversationDTO = conversationService.getConversationById(conversationId,
                                user.getUserId());

                return conversationDTO;
        }

}
