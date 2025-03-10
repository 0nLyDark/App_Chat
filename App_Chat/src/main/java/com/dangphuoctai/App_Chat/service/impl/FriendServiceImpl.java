package com.dangphuoctai.App_Chat.service.impl;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dangphuoctai.App_Chat.entity.FriendRequest;
import com.dangphuoctai.App_Chat.entity.User;
import com.dangphuoctai.App_Chat.exceptions.APIException;
import com.dangphuoctai.App_Chat.exceptions.ResourceNotFoundException;
import com.dangphuoctai.App_Chat.payloads.FriendRequestResponse;
import com.dangphuoctai.App_Chat.payloads.DTO.FriendRequestDTO;
import com.dangphuoctai.App_Chat.payloads.DTO.UserDTO;
import com.dangphuoctai.App_Chat.payloads.Response.UserResponse;
import com.dangphuoctai.App_Chat.repository.FriendRequestRepo;
import com.dangphuoctai.App_Chat.repository.UserRepo;
import com.dangphuoctai.App_Chat.service.FriendService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
class FriendServiceImpl implements FriendService {

    @Autowired
    private FriendRequestRepo friendRequestRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public UserResponse getAllFriendBykeyword(Long userId, String keyword, Integer pageNumber, Integer pageSize,
            String sortBy,
            String sortOrder) {
        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("desc") ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);
        Page<User> pageUsers = userRepo.findContactsByUserIdAndKeyword(userId, keyword, pageDetails);
        List<User> users = pageUsers.getContent();
        List<UserDTO> userDTOs = users.stream().map(user -> modelMapper.map(user, UserDTO.class))
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
    public FriendRequestResponse getFriendRequest(Long receiverId, Integer pageNumber, Integer pageSize, String sortBy,
            String sortOrder) {
        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);
        Page<FriendRequest> friendRequestsPage = friendRequestRepo.findAllByReceiverUserId(receiverId, pageDetails);

        List<FriendRequest> friendRequests = friendRequestsPage.getContent();
        List<FriendRequestDTO> friendRequestResponses = friendRequests.stream()
                .map(friend -> modelMapper.map(friend, FriendRequestDTO.class))
                .collect(Collectors.toList());

        FriendRequestResponse friendRequestResponse = new FriendRequestResponse();
        friendRequestResponse.setContent(friendRequestResponses);
        friendRequestResponse.setPageNumber(friendRequestsPage.getNumber());
        friendRequestResponse.setPageSize(friendRequestsPage.getSize());
        friendRequestResponse.setTotalElements(friendRequestsPage.getTotalElements());
        friendRequestResponse.setTotalPages(friendRequestsPage.getTotalPages());

        return friendRequestResponse;

    }

    @Override
    public FriendRequestDTO sendFriendRequest(Long senderId, Long receiverId) {
        FriendRequest friendRequest = friendRequestRepo.findBySenderUserIdAndReceiverUserId(senderId, receiverId);
        if (friendRequest != null || senderId == receiverId) {
            throw new APIException("Friend request already sent");
        }
        User sender = userRepo.findById(senderId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "userId", senderId));
        User receiver = userRepo.findById(receiverId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "userId", receiverId));
        if (sender.getContacts().contains(receiver)) {
            throw new APIException("The sender and recipient are friends");
        }
        friendRequest = new FriendRequest();
        friendRequest.setSender(sender);
        friendRequest.setReceiver(receiver);
        friendRequest.setStatus(false);
        friendRequest.setCreatedAt(new Date());
        friendRequestRepo.save(friendRequest);
        return modelMapper.map(friendRequest, FriendRequestDTO.class);
    }

    @Override
    public FriendRequestDTO cancelFriendRequest(Long senderId, Long receiverId) {
        FriendRequest friendRequest = friendRequestRepo.findBySenderUserIdAndReceiverUserId(senderId, receiverId);
        if (friendRequest == null) {
            throw new ResourceNotFoundException("FriendRequest", "SenderId and receiverId",
                    senderId + " and " + receiverId);
        }
        FriendRequestDTO friendRequestDTO = modelMapper.map(friendRequest, FriendRequestDTO.class);
        friendRequestRepo.delete(friendRequest);
        return friendRequestDTO;
    }

    @Override
    public FriendRequestDTO acceptFriend(Long senderId, Long receiverId) {
        FriendRequest friendRequest = friendRequestRepo.findBySenderUserIdAndReceiverUserId(senderId, receiverId);
        if (friendRequest == null) {
            new ResourceNotFoundException("FriendRequest", "senderId and receiverId", senderId + "and" + receiverId);
        }
        User sender = friendRequest.getSender();
        User receiver = friendRequest.getReceiver();
        if (sender.getContacts().contains(receiver)) {
            throw new APIException("The sender and recipient are friends");
        }
        sender.getContacts().add(receiver);
        receiver.getContacts().add(sender);

        FriendRequestDTO friendRequestDTO = modelMapper.map(friendRequest, FriendRequestDTO.class);

        friendRequestRepo.delete(friendRequest);

        return friendRequestDTO;
    }

    @Override
    public FriendRequestDTO notAcceptFriend(Long senderId, Long receiverId) {
        FriendRequest friendRequest = friendRequestRepo.findBySenderUserIdAndReceiverUserId(senderId, receiverId);
        if (friendRequest == null) {
            new ResourceNotFoundException("FriendRequest", "senderId and receiverId", senderId + "and" + receiverId);
        }

        FriendRequestDTO friendRequestDTO = modelMapper.map(friendRequest, FriendRequestDTO.class);

        friendRequestRepo.delete(friendRequest);

        return friendRequestDTO;
    }

    @Override
    public String unFriendRequest(Long userId, Long friendId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "userId", userId));
        User friend = user.getContacts().stream().filter(fr -> fr.getUserId() == friendId).findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("User", "friendId", friendId));
        user.getContacts().remove(friend);
        friend.getContacts().remove(user);
        userRepo.save(user);
        userRepo.save(friend);
        return "UserId:" + userId + " unfriend success UserId:" + friendId;
    }

}
