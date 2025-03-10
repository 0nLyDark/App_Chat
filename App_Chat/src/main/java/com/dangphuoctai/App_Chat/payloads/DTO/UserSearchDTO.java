package com.dangphuoctai.App_Chat.payloads.DTO;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class UserSearchDTO extends UserDTO {

    public enum ContactType {
        FRIEND,
        ACCEPT,
        REQUEST,
        NOT
    }

    @Enumerated(EnumType.STRING)
    private ContactType typeContact;

    // Setter hỗ trợ chuỗi
    public void setTypeContact(String typeContact) {
        try {
            this.typeContact = ContactType.valueOf(typeContact.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Giá trị không hợp lệ cho typeContact: " + typeContact);
        }
    }
}
