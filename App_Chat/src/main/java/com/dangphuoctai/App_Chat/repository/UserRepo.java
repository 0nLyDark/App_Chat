package com.dangphuoctai.App_Chat.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.dangphuoctai.App_Chat.entity.User;

@Repository
public interface UserRepo extends JpaRepository<User, Long> {

        Optional<User> findByEmail(String email);

        Optional<User> findByUsername(String username);

        Page<User> findByFullNameContaining(String username, Pageable pageable);

        @Query("SELECT u FROM User u JOIN u.contacts c WHERE c.id = ?1")
        Page<User> findContactsByUserId(Long userId, Pageable pageable);

        @Query("SELECT u FROM User u JOIN u.contacts c WHERE c.id = ?1 AND u.fullName LIKE %?2%")
        Page<User> findContactsByUserIdAndKeyword(Long userId, String keyword, Pageable pageable);

        @Query("SELECT DISTINCT u FROM User u " +
                        "JOIN u.contacts c " +
                        "LEFT JOIN ConversationMember cm ON cm.user = u AND cm.conversation.id = ?3 " +
                        "WHERE c.id = ?1 " +
                        "AND LOWER(u.fullName) LIKE LOWER(CONCAT('%', ?2, '%')) " +
                        "AND (cm.id IS NULL OR cm.isOut = true)")
        Page<User> findContactsByUserIdAndKeywordAndNotConversationId(Long userId, String keyword, Long conversationId,
                        Pageable pageable);

        Boolean existsByUsername(String username);

        Boolean existsByEmail(String email);
}
