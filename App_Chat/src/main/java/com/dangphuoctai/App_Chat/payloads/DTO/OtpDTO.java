package com.dangphuoctai.App_Chat.payloads.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OtpDTO {

    private String email;
    private String codeOTP;
}
