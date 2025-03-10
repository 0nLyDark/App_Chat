package com.dangphuoctai.App_Chat.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "conversations")
public class Conversation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long conversationId;

    private String conversationName;

    @Column(nullable = false)
    private Boolean isGroup;

    private String avatar;

    @OneToOne
    @JoinColumn(name = "last_message_id", referencedColumnName = "messageId")
    private Message lastMessage;

    @OneToMany(mappedBy = "conversation")
    private List<ConversationMember> conversationMembers = new ArrayList<>();

    @OneToMany(mappedBy = "conversation")
    private List<Message> messages = new ArrayList<>();

}
