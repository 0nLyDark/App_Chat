package com.dangphuoctai.App_Chat.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dangphuoctai.App_Chat.entity.MessageStatus;

@Repository
public interface MessageStatusRepo extends JpaRepository<MessageStatus, Long> {

    Optional<MessageStatus> findByMessageMessageIdAndMemberUserUserId(Long messageId, Long userId);
}
