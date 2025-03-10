package com.dangphuoctai.App_Chat.payloads.Response;

import java.util.List;

import com.dangphuoctai.App_Chat.payloads.DTO.ConversationDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConversationResponse {
    
    private List<ConversationDTO> content;
    private Integer pageNumber;
    private Integer pageSize;
    private Long totalElements;
    private Integer totalPages;
    private boolean lastPage;
}
