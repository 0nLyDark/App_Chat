package com.dangphuoctai.App_Chat.controller;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.dangphuoctai.App_Chat.config.AppConstants;
import com.dangphuoctai.App_Chat.payloads.DTO.ConversationDTO;
import com.dangphuoctai.App_Chat.payloads.DTO.MessageDTO;
import com.dangphuoctai.App_Chat.payloads.Response.ConversationResponse;
import com.dangphuoctai.App_Chat.payloads.Response.MessageResponse;
import com.dangphuoctai.App_Chat.service.ConversationService;
import com.dangphuoctai.App_Chat.service.MessageService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;

@CrossOrigin("*")
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ConversationController {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private ConversationService conversationService;

    @Autowired
    private MessageService messageService;

    ///////////// CONVERSATIONS ////////////////

    @GetMapping("/public/conversations/user/{userId}/type/{type}")
    public ResponseEntity<ConversationResponse> getMethodName(@PathVariable Long userId, @PathVariable String type,
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_CONVERSATION_BY, required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Jwt jwt = (Jwt) authentication.getPrincipal();
        String role = (String) jwt.getClaims().get("scope");
        Long id = (Long) jwt.getClaims().get("userId");
        if (!role.contains("ADMIN") && id != userId) {
            throw new AccessDeniedException(" No Access info conversation");
        }
        ConversationResponse conversationResponse = conversationService.getAllConversationbyUserId(userId,
                "all".equals(type) ? null : ("group".equals(type) ? true : false),
                pageNumber == 0 ? pageNumber : pageNumber - 1,
                pageSize,
                "id".equals(sortBy) ? "conversationId" : sortBy,
                sortOrder);
        return new ResponseEntity<ConversationResponse>(conversationResponse, HttpStatus.OK);
    }

    @GetMapping("/public/conversations/user/{userId}/friend/{friendId}")
    public ResponseEntity<ConversationDTO> getConversationPresonal(@PathVariable Long userId,
            @PathVariable Long friendId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Jwt jwt = (Jwt) authentication.getPrincipal();
        String role = (String) jwt.getClaims().get("scope");
        Long id = (Long) jwt.getClaims().get("userId");
        if (!role.contains("ADMIN") && id != userId) {
            throw new AccessDeniedException(" No Access info conversation");
        }
        ConversationDTO conversationDTO = conversationService.getConversationByPresonal(userId, friendId);
        return new ResponseEntity<ConversationDTO>(conversationDTO, HttpStatus.OK);

    }

    @GetMapping("/public/conversations/{conversationId}")
    public ResponseEntity<ConversationDTO> getMethodName(@PathVariable Long conversationId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = (Long) jwt.getClaims().get("userId");

        ConversationDTO conversationDTO = conversationService.getConversationById(conversationId, userId);

        return new ResponseEntity<ConversationDTO>(conversationDTO, HttpStatus.OK);
    }

    @PostMapping({ "/public/conversations/conversationName/",
            "/public/conversations/conversationName/{conversationName}" })
    public ResponseEntity<ConversationDTO> createConversationGroup(
            @PathVariable(name = "conversationName", required = false) String conversationName,
            @RequestBody List<Long> listFriendId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = (Long) jwt.getClaims().get("userId");

        ConversationDTO conversationDTO = conversationService.createConversationGroup(listFriendId, userId,
                conversationName);
        conversationDTO.getConversationMembers().forEach(member -> {
            messagingTemplate.convertAndSendToUser(member.getUser().getUsername(),
                    "/queue/conversations/create", conversationDTO);
        });

        return new ResponseEntity<ConversationDTO>(conversationDTO, HttpStatus.OK);
    }

    @PostMapping("/public/conversations/{conversationId}/conversationMembers")
    public ResponseEntity<ConversationDTO> addConversationMember(@PathVariable Long conversationId,
            @RequestBody List<Long> listFriendId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = (Long) jwt.getClaims().get("userId");

        ConversationDTO conversationDTO = conversationService.addMemberConversationGroup(listFriendId, userId,
                conversationId);

        return new ResponseEntity<ConversationDTO>(conversationDTO, HttpStatus.OK);
    }

    @PutMapping("/public/conversations/{conversationId}/conversationMembers")
    public ResponseEntity<Map<String, Object>> updateConversationMember(@PathVariable Long conversationId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = (Long) jwt.getClaims().get("userId");

        String result = conversationService.outConversationGroup(conversationId, userId);

        return new ResponseEntity<Map<String, Object>>(Collections.singletonMap("result", result),
                HttpStatus.OK);
    }

    @PutMapping("/public/conversations/{conversationId}/leader/{leaderId}")
    public ResponseEntity<Map<String, Object>> updateConversationLeader(@PathVariable Long conversationId,
            @PathVariable Long leaderId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = (Long) jwt.getClaims().get("userId");

        String result = conversationService.changeLeaderConversationGroup(conversationId, userId, leaderId);

        return new ResponseEntity<Map<String, Object>>(Collections.singletonMap("result", result),
                HttpStatus.OK);
    }

    @PutMapping("/public/conversations/{conversationId}/avatar")
    public ResponseEntity<ConversationDTO> updateConversationAvatar(@PathVariable Long conversationId,
            @RequestParam("image") MultipartFile image) throws IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = (Long) jwt.getClaims().get("userId");

        ConversationDTO updateConversationDTO = conversationService.updateAvatar(conversationId, userId, image);

        updateConversationDTO.getConversationMembers().forEach(member -> {
            messagingTemplate.convertAndSend("/queue/users/" + member.getUser().getUserId() + "/conversations/group",
                    updateConversationDTO);
        });
        return new ResponseEntity<ConversationDTO>(updateConversationDTO, HttpStatus.OK);
    }

    @PutMapping("/public/conversations/{conversationId}/conversationName")
    public ResponseEntity<ConversationDTO> updateConversationConversationName(@PathVariable Long conversationId,
            @RequestBody ConversationDTO conversationDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = (Long) jwt.getClaims().get("userId");
        ConversationDTO updateConversationDTO = conversationService.updateConversationName(userId, conversationDTO);

        updateConversationDTO.getConversationMembers().forEach(member -> {
            messagingTemplate.convertAndSendToUser(member.getUser().getUsername(),
                    "/queue/conversations/create", conversationDTO);
        });

        return new ResponseEntity<ConversationDTO>(updateConversationDTO, HttpStatus.OK);
    }
    ///////////// MESSAGES ////////////////

    @GetMapping("/public/conversations/{conversationId}/messages")
    public ResponseEntity<MessageResponse> getMessageByConversation(@PathVariable Long conversationId,
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_MESSAGE_BY, required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = (Long) jwt.getClaims().get("userId");
        MessageResponse messageResponse = messageService.getMessageByConversationId(conversationId, userId,
                pageNumber == 0 ? pageNumber : pageNumber - 1,
                pageSize,
                "id".equals(sortBy) ? "messageId" : sortBy,
                sortOrder);

        return new ResponseEntity<MessageResponse>(messageResponse, HttpStatus.OK);
    }

    @PutMapping("/public/conversations/messages/{messageId}")
    public ResponseEntity<MessageDTO> updateMessage(@PathVariable Long messageId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = (Long) jwt.getClaims().get("userId");

        MessageDTO message = messageService.hiddenMessages(messageId, userId);

        return new ResponseEntity<MessageDTO>(message, HttpStatus.OK);
    }

}
