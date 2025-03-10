package com.dangphuoctai.App_Chat.repository;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dangphuoctai.App_Chat.entity.FriendRequest;

@Repository
public interface FriendRequestRepo extends JpaRepository<FriendRequest, Long> {

    Page<FriendRequest> findAllByReceiverUserId(Long receiverId, Pageable pageable);

    FriendRequest findBySenderUserIdAndReceiverUserId(Long senderId, Long receiverId);

    FriendRequest findByReceiverUserIdAndSenderUserId(Long receiverId, Long senderId);
}
