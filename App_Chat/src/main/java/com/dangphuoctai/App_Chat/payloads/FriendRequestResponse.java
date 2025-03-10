package com.dangphuoctai.App_Chat.payloads;

import java.util.List;

import com.dangphuoctai.App_Chat.payloads.DTO.FriendRequestDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FriendRequestResponse {
    List<FriendRequestDTO> content;
    private Integer pageNumber;
    private Integer pageSize;
    private Long totalElements;
    private Integer totalPages;
    private boolean lastPage;
}
