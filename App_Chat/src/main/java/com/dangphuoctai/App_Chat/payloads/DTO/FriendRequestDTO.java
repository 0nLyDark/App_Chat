package com.dangphuoctai.App_Chat.payloads.DTO;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FriendRequestDTO {
    private Long FriendRequestId;

    private UserDTO sender;

    private UserDTO receiver;

    private String status;

    private Date createdAt;

}
