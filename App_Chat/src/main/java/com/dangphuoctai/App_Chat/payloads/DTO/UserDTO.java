package com.dangphuoctai.App_Chat.payloads.DTO;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long userId;
    private String fullName;
    private String username;
    private String email;
    private String avatar;
    private Date dateOfBirth;
    private Boolean isOnline;
    private LocalDateTime timeOffline;
    // private String phoneNumber;
    private Boolean enabled;

    private List<RoleDTO> roles;
}
