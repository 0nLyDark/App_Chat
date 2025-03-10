package com.dangphuoctai.App_Chat.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dangphuoctai.App_Chat.entity.ConversationMember;

@Repository
public interface ConversationMemberRepo extends JpaRepository<ConversationMember, Long> {

    Optional<ConversationMember> findByUserUserIdAndConversationConversationId(Long userId, Long conversationId);
}
