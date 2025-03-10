package com.dangphuoctai.App_Chat.service;


import com.dangphuoctai.App_Chat.payloads.FriendRequestResponse;
import com.dangphuoctai.App_Chat.payloads.DTO.FriendRequestDTO;
import com.dangphuoctai.App_Chat.payloads.Response.UserResponse;

public interface FriendService {
        UserResponse getAllFriendBykeyword(Long userId, String keyword, Integer pageNumber, Integer pageSize,
                        String sortBy,
                        String sortOrder);

        FriendRequestResponse getFriendRequest(Long receiverId, Integer pageNumber, Integer pageSize, String sortBy,
                        String sortOrder);

        FriendRequestDTO sendFriendRequest(Long senderId, Long receiverId);

        FriendRequestDTO cancelFriendRequest(Long senderId, Long receiverId);

        FriendRequestDTO notAcceptFriend(Long receiverId, Long friendRequestId);

        FriendRequestDTO acceptFriend(Long receiverId, Long friendRequestId);

        String unFriendRequest(Long userId, Long friendId);

}
