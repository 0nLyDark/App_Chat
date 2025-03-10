package com.dangphuoctai.App_Chat.service.impl;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.dangphuoctai.App_Chat.entity.Conversation;
import com.dangphuoctai.App_Chat.entity.ConversationMember;
import com.dangphuoctai.App_Chat.entity.User;
import com.dangphuoctai.App_Chat.exceptions.APIException;
import com.dangphuoctai.App_Chat.exceptions.ResourceNotFoundException;
import com.dangphuoctai.App_Chat.payloads.DTO.ConversationDTO;
import com.dangphuoctai.App_Chat.payloads.DTO.UserDTO;
import com.dangphuoctai.App_Chat.payloads.Response.ConversationResponse;
import com.dangphuoctai.App_Chat.payloads.Response.UserResponse;
import com.dangphuoctai.App_Chat.repository.ConversationMemberRepo;
import com.dangphuoctai.App_Chat.repository.ConversationRepo;
import com.dangphuoctai.App_Chat.repository.UserRepo;
import com.dangphuoctai.App_Chat.service.ConversationService;
import com.dangphuoctai.App_Chat.service.FileService;

@Service
public class ConversationServiceImpl implements ConversationService {
        @Autowired
        private SimpMessagingTemplate messagingTemplate;

        @Autowired
        private ConversationRepo conversationRepo;

        @Autowired
        private UserRepo userRepo;

        @Autowired
        private ConversationMemberRepo conversationMemberRepo;

        @Autowired
        private ModelMapper modelMapper;

        @Autowired
        private FileService fileService;

        @Value("${project.image}")
        private String path;

        @Override
        public ConversationResponse getAllConversationbyUserId(Long userId, Boolean isGroup, Integer pageNumber,
                        Integer pageSize,
                        String sortBy,
                        String sortOrder) {
                Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending()
                                : Sort.by(sortBy).descending();
                Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);

                Page<Conversation> pageConversation;
                if (isGroup == null) {
                        pageConversation = conversationRepo
                                        .findAllByConversationMembers_User_UserId(userId, pageDetails);
                } else {
                        pageConversation = conversationRepo
                                        .findAllByConversationMembers_User_UserIdAndIsGroup(userId, isGroup,
                                                        pageDetails);
                }

                List<Conversation> conversations = pageConversation.getContent();
                List<ConversationDTO> conversationDTOs = conversations.stream()
                                .map(conversation -> modelMapper.map(conversation, ConversationDTO.class))
                                .collect(Collectors.toList());

                ConversationResponse conversationResponse = new ConversationResponse();
                conversationResponse.setContent(conversationDTOs);
                conversationResponse.setTotalElements(pageConversation.getTotalElements());
                conversationResponse.setTotalPages(pageConversation.getTotalPages());
                conversationResponse.setPageNumber(pageConversation.getNumber());
                conversationResponse.setPageSize(pageConversation.getSize());

                return conversationResponse;
        }

        @Override
        public UserResponse searchUserNotConversation(Long userId, String keyword, Long conversationId,
                        Integer pageNumber,
                        Integer pageSize,
                        String sortBy,
                        String sortOrder) {
                Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending()
                                : Sort.by(sortBy).descending();
                Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);
                Page<User> pageUsers = userRepo.findContactsByUserIdAndKeywordAndNotConversationId(userId, keyword,
                                conversationId, pageDetails);

                List<UserDTO> userDTOs = pageUsers.getContent().stream()
                                .map(user -> modelMapper.map(user, UserDTO.class))
                                .collect(Collectors.toList());
                UserResponse userResponse = new UserResponse();
                userResponse.setContent(userDTOs);
                userResponse.setPageNumber(pageUsers.getNumber());
                userResponse.setPageSize(pageUsers.getSize());
                userResponse.setTotalElements(pageUsers.getTotalElements());
                userResponse.setTotalPages(pageUsers.getTotalPages());
                userResponse.setLastPage(pageUsers.isLast());
                return userResponse;
        }

        @Override
        public ConversationDTO getConversationByPresonal(Long userId, Long friendId) {
                List<Conversation> conversations = conversationRepo.findByConversation_User_UserId(userId);
                for (Conversation conversation : conversations) {
                        if (conversation.getConversationMembers().stream()
                                        .anyMatch(conversationMember -> conversationMember.getUser().getUserId()
                                                        .equals(friendId))) {
                                return modelMapper.map(conversation, ConversationDTO.class);
                        }
                }
                Conversation conversation = new Conversation();
                conversation.setIsGroup(false);
                User user = userRepo.findById(userId)
                                .orElseThrow(() -> new ResourceNotFoundException("User", "UserId", userId));
                User friend = userRepo.findById(friendId)
                                .orElseThrow(() -> new ResourceNotFoundException("User", "UserId", friendId));
                ConversationMember conversationMember = new ConversationMember();
                conversationMember.setUser(user);
                conversationMember.setConversation(conversation);
                ConversationMember conversationMember2 = new ConversationMember();
                conversationMember2.setUser(friend);
                conversationMember2.setConversation(conversation);

                // Save conversation
                conversation.setConversationMembers(List.of(conversationMember, conversationMember2));
                conversation = conversationRepo.save(conversation);
                conversationMemberRepo.save(conversationMember);
                conversationMemberRepo.save(conversationMember2);
                ConversationDTO conversationDTO = modelMapper.map(conversation, ConversationDTO.class);
                messagingTemplate.convertAndSendToUser(user.getUsername(),
                                "/queue/conversations/create", conversationDTO);
                messagingTemplate.convertAndSendToUser(friend.getUsername(),
                                "/queue/conversations/create", conversationDTO);

                return conversationDTO;
        }

        @Override
        public ConversationDTO getConversationById(Long conversationId, Long userId) {
                Conversation conversation = conversationRepo.findById(conversationId)
                                .orElseThrow(() -> new ResourceNotFoundException("Conversation", "ConversationId",
                                                conversationId));
                User user = userRepo.findById(userId)
                                .orElseThrow(() -> new ResourceNotFoundException("User", "UserId", userId));
                Boolean access = false;
                if (user.getRoles().stream().anyMatch(role -> role.getRoleName().equals("ADMIN"))) {
                        access = true;
                } else {
                        access = conversation.getConversationMembers().stream().filter(member -> !member.getIsOut())
                                        .anyMatch(conversationMember -> conversationMember.getUser().getUserId()
                                                        .equals(userId));
                }
                if (!access) {
                        throw new AccessDeniedException("You not access this conversation");
                }
                return modelMapper.map(conversation, ConversationDTO.class);
        }

        public ConversationDTO createConversationGroup(List<Long> listFriendId, Long userId, String conversationName) {
                User user = userRepo.findById(userId)
                                .orElseThrow(() -> new ResourceNotFoundException("User", "userId", userId));

                Conversation conversation = new Conversation();
                conversation.setIsGroup(true);
                conversation.setConversationName(conversationName);
                // New ConversationMember in listFriend
                List<ConversationMember> conversationMembers = user.getContacts().stream()
                                .filter(friend -> listFriendId.contains(friend.getUserId()))
                                .map(friend -> {
                                        ConversationMember conversationMember = new ConversationMember();
                                        conversationMember.setUser(friend);
                                        conversationMember.setConversation(conversation);
                                        return conversationMember;

                                }).collect(Collectors.toList());
                // New ConversationMember by user
                ConversationMember conversationMember = new ConversationMember();
                conversationMember.setUser(user);
                conversationMember.setConversation(conversation);
                conversationMember.setRole("LEADER");
                conversationMembers.add(conversationMember);
                // Save Conversation and conversationMember
                conversationRepo.save(conversation);
                conversationMemberRepo.saveAll(conversationMembers);
                conversation.setConversationMembers(conversationMembers);

                return modelMapper.map(conversation, ConversationDTO.class);
        }

        @Override
        public ConversationDTO addMemberConversationGroup(List<Long> listFriendId, Long userId, Long conversationId) {
                Conversation conversation = conversationRepo.findById(conversationId)
                                .orElseThrow(() -> new ResourceNotFoundException("Conversation", "ConversationId",
                                                conversationId));
                Boolean access = conversation.getConversationMembers().stream().filter(member -> !member.getIsOut())
                                .anyMatch(conversationMember -> conversationMember.getUser().getUserId()
                                                .equals(userId));
                if (!access) {
                        throw new AccessDeniedException("You not access this conversation");
                }
                List<ConversationMember> conversationMembers = conversation.getConversationMembers().stream()
                                .filter(member -> {
                                        if (listFriendId.contains(member.getUser().getUserId())) {
                                                listFriendId.remove(member.getUser().getUserId());
                                                return member.getIsOut();
                                        }
                                        return false;
                                })
                                .map(member -> {
                                        member.setIsOut(false);
                                        return member;
                                }).collect(Collectors.toList());
                List<User> listUser = userRepo.findAllById(listFriendId);
                if (listFriendId.size() != listUser.size()) {
                        throw new APIException("Some users do not exist");
                }
                List<ConversationMember> newConversationMembers = listUser.stream().map(user -> {
                        ConversationMember conversationMember = new ConversationMember();
                        conversationMember.setConversation(conversation);
                        conversationMember.setUser(user);
                        return conversationMember;
                }).collect(Collectors.toList());

                conversationMembers.addAll(newConversationMembers);
                conversationMemberRepo.saveAll(conversationMembers);
                conversationRepo.save(conversation);

                return modelMapper.map(conversation, ConversationDTO.class);

        }

        @Override
        public String outConversationGroup(Long conversationId, Long userId) {
                Conversation conversation = conversationRepo.findById(conversationId).orElseThrow(
                                () -> new ResourceNotFoundException("Conversation", "conversationId", conversationId));
                if (!conversation.getIsGroup()) {
                        throw new APIException("Conversation is not a group");
                }
                ConversationMember conversationMember = conversation.getConversationMembers().stream()
                                .filter(member -> member.getUser().getUserId().equals(userId))
                                .findFirst()
                                .orElseThrow(() -> new APIException("User is not a member of the Conversation"));
                if (conversationMember.getRole().equals("LEADER")) {
                        conversationMember.setRole("MEMBER");
                        ConversationMember newLeader = conversation.getConversationMembers().stream().findFirst()
                                        .orElseThrow(() -> new APIException(
                                                        "This group has no more members"));
                        newLeader.setRole("LEADER");
                        conversationMemberRepo.save(newLeader);
                }

                conversationMember.setIsOut(true);
                conversationMemberRepo.save(conversationMember);

                return "User out conversation group successful";
        }

        public String changeLeaderConversationGroup(Long conversationId, Long userId, Long leaderId) {

                ConversationMember conversationMember = conversationMemberRepo
                                .findByUserUserIdAndConversationConversationId(userId, conversationId)
                                .orElseThrow(() -> new ResourceNotFoundException("ConversationMember",
                                                "UserId and conversationId", userId + " and " + conversationId));
                if (conversationMember.getRole().equals("LEADER")) {
                        throw new AccessDeniedException("User not access permission");
                }
                ConversationMember newLeader = conversationMemberRepo
                                .findByUserUserIdAndConversationConversationId(userId, conversationId)
                                .orElseThrow(() -> new ResourceNotFoundException("ConversationMember",
                                                "UserId and conversationId", userId + " and " + conversationId));
                conversationMember.setRole("MEMBER");
                newLeader.setRole("LEADER");
                conversationMemberRepo.save(conversationMember);
                conversationMemberRepo.save(newLeader);

                return "User changed leader conversation group successful";

        }

        public ConversationDTO updateAvatar(Long conversationId, Long userId, MultipartFile image) throws IOException {
                Conversation conversation = conversationRepo.findById(conversationId).orElseThrow(
                                () -> new ResourceNotFoundException("Conversation", "conversationId", conversationId));
                Boolean access = conversation.getConversationMembers().stream()
                                .anyMatch(member -> member.getUser().getUserId() == userId && !member.getIsOut());
                if (!access) {
                        throw new AccessDeniedException("No conversation access!");
                }
                String fileName = fileService.uploadImage(path, image);
                conversation.setAvatar(fileName);
                conversationRepo.save(conversation);

                return modelMapper.map(conversation, ConversationDTO.class);
        }

        public ConversationDTO updateConversationName(Long userId, ConversationDTO conversationDTO) {
                Conversation conversation = conversationRepo.findById(conversationDTO.getConversationId())
                                .orElseThrow(() -> new ResourceNotFoundException("Conversation", "conversationId",
                                                conversationDTO.getConversationId()));
                Boolean access = conversation.getConversationMembers().stream()
                                .anyMatch(member -> member.getUser().getUserId() == userId && !member.getIsOut());
                if (!access) {
                        throw new AccessDeniedException("No conversation access!");
                }
                conversation.setConversationName(conversationDTO.getConversationName());
                conversation = conversationRepo.save(conversation);

                return modelMapper.map(conversation, ConversationDTO.class);
        }
}
