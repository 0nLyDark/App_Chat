package com.dangphuoctai.App_Chat.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.dangphuoctai.App_Chat.entity.Conversation;

@Repository
public interface ConversationRepo extends JpaRepository<Conversation, Long> {

    Page<Conversation> findAllByConversationMembers_User_UserId(Long userId, Pageable pageable);

    @Query("SELECT c FROM Conversation c JOIN c.conversationMembers cm WHERE cm.user.userId = ?1 AND c.isGroup = false")
    List<Conversation> findByConversation_User_UserId(Long userId);

    Page<Conversation> findAllByConversationMembers_User_UserIdAndIsGroup(Long userId, Boolean isgroup,
            Pageable pageDetails);

}