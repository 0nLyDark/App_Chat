package com.dangphuoctai.App_Chat.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.dangphuoctai.App_Chat.entity.Message;

@Repository
public interface MessagesRepo extends JpaRepository<Message, Long> {

    Page<Message> findAllByConversationConversationId(Long conversationId, Pageable pageable);

    @Query("SELECT m FROM Message m " +
            "JOIN MessageStatus ms ON m.messageId = ms.message.messageId " +
            "WHERE m.conversation.conversationId = :conversationId AND ms.member.user.userId = :userId " +
            "AND (ms.isDeleted = false OR ms.isDeleted IS NULL)")
    Page<Message> findAllByConversationIdAndUserId(Long conversationId, Long userId, Pageable pageable);
}
