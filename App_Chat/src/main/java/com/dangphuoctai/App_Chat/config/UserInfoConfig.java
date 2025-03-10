package com.dangphuoctai.App_Chat.config;

import java.security.Principal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserInfoConfig implements Principal {
    private Long userId;
    private String email;
    private String role;
    private String name;

}
