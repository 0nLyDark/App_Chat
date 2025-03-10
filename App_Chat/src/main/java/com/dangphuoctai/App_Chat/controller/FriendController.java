package com.dangphuoctai.App_Chat.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dangphuoctai.App_Chat.config.AppConstants;
import com.dangphuoctai.App_Chat.payloads.FriendRequestResponse;
import com.dangphuoctai.App_Chat.payloads.DTO.ConversationDTO;
import com.dangphuoctai.App_Chat.payloads.DTO.FriendRequestDTO;
import com.dangphuoctai.App_Chat.payloads.Response.UserResponse;
import com.dangphuoctai.App_Chat.service.ConversationService;
import com.dangphuoctai.App_Chat.service.FriendService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@CrossOrigin("*")
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class FriendController {
        @Autowired
        private SimpMessagingTemplate messagingTemplate;

        @Autowired
        private FriendService friendService;

        @Autowired
        private ConversationService conversationService;

        @GetMapping({ "/public/myFriend/keyword/", "/public/myFriend/keyword/{keyword}" })
        public ResponseEntity<UserResponse> getMyFriend(
                        @PathVariable(name = "keyword", required = false) String keyword,
                        @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
                        @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
                        @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_USERS_BY, required = false) String sortBy,
                        @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder) {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                Jwt jwt = (Jwt) authentication.getPrincipal();
                Long userId = (Long) jwt.getClaims().get("userId");
                UserResponse userResponse = friendService.getAllFriendBykeyword(userId, keyword != null ? keyword : "",
                                pageNumber == 0 ? pageNumber : pageNumber - 1,
                                pageSize,
                                "id".equals(sortBy) ? "userId" : sortBy,
                                "desc");
                return new ResponseEntity<UserResponse>(userResponse, HttpStatus.OK);
        }

        @GetMapping({ "/public/myFriend/conversation/{conversationId}/keyword/",
                        "/public/myFriend/conversation/{conversationId}/keyword/{keyword}" })
        public ResponseEntity<UserResponse> getMyFriendNotConversation(
                        @PathVariable(name = "keyword", required = false) String keyword,
                        @PathVariable Long conversationId,
                        @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
                        @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
                        @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_USERS_BY, required = false) String sortBy,
                        @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder) {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                Jwt jwt = (Jwt) authentication.getPrincipal();
                Long userId = (Long) jwt.getClaims().get("userId");
                UserResponse userResponse = conversationService.searchUserNotConversation(userId,
                                keyword != null ? keyword : "", conversationId,
                                pageNumber == 0 ? pageNumber : pageNumber - 1,
                                pageSize,
                                "id".equals(sortBy) ? "userId" : sortBy,
                                "desc");
                return new ResponseEntity<UserResponse>(userResponse, HttpStatus.OK);
        }

        @GetMapping("/public/friendRequest")
        public ResponseEntity<FriendRequestResponse> getFriendRequest(
                        @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
                        @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
                        @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_FRIENDREQUEST_BY, required = false) String sortBy,
                        @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder) {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                Jwt jwt = (Jwt) authentication.getPrincipal();
                Long userId = (Long) jwt.getClaims().get("userId");
                FriendRequestResponse friendRequestResponse = friendService.getFriendRequest(userId,
                                pageNumber == 0 ? pageNumber : pageNumber - 1,
                                pageSize,
                                "id".equals(sortBy) ? "friendRequestId" : sortBy,
                                sortOrder);
                return new ResponseEntity<FriendRequestResponse>(friendRequestResponse, HttpStatus.OK);
        }

        @PostMapping("/public/friendRequest/{receiverId}")
        public ResponseEntity<FriendRequestDTO> sendFriendRequest(@PathVariable Long receiverId) {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                Jwt jwt = (Jwt) authentication.getPrincipal();
                Long userId = (Long) jwt.getClaims().get("userId");

                FriendRequestDTO friendRequestDTO = friendService.sendFriendRequest(userId, receiverId);
                messagingTemplate.convertAndSend("/queue/friendRequest/" + receiverId, friendRequestDTO);
                return new ResponseEntity<FriendRequestDTO>(friendRequestDTO, HttpStatus.CREATED);
        }

        @PutMapping("/public/friendRequest/status")
        public ResponseEntity<FriendRequestDTO> updateFriendRequest(
                        @RequestBody FriendRequestDTO friendRequest) {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                Jwt jwt = (Jwt) authentication.getPrincipal();
                Long userId = (Long) jwt.getClaims().get("userId");
                System.out.println("aaaaaaaaaaaaaaaaaaaaaaaaaaa " + friendRequest);
                FriendRequestDTO friendRequestDTO;
                if (friendRequest.getStatus().equals("cancel")) {
                        friendRequestDTO = friendService.cancelFriendRequest(userId,
                                        friendRequest.getReceiver().getUserId());
                        messagingTemplate.convertAndSend("/queue/unFriendRequest/" +
                                        friendRequest.getReceiver().getUserId(),
                                        friendRequestDTO);
                } else if (friendRequest.getStatus().equals("accept")) {
                        friendRequestDTO = friendService.acceptFriend(friendRequest.getSender().getUserId(), userId);
                        ConversationDTO conversationDTO = conversationService.getConversationByPresonal(userId,
                                        friendRequest.getSender().getUserId());
                        messagingTemplate.convertAndSend("/queue/friendRequest/" + userId,
                                        friendRequestDTO);
                } else {
                        // if (friendRequest.getStatus().equals("notAccept"))
                        friendRequestDTO = friendService.notAcceptFriend(friendRequest.getSender().getUserId(), userId);
                        messagingTemplate.convertAndSend("/queue/unFriendRequest/" + userId,
                                        friendRequestDTO);
                }

                return new ResponseEntity<FriendRequestDTO>(friendRequestDTO, HttpStatus.OK);
        }

}
