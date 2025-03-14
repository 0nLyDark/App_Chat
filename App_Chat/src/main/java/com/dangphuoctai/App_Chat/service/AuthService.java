package com.dangphuoctai.App_Chat.service;

import com.dangphuoctai.App_Chat.entity.User;
import com.dangphuoctai.App_Chat.payloads.DTO.OtpDTO;
import com.dangphuoctai.App_Chat.payloads.DTO.UserDTO;

public interface AuthService {

    UserDTO registerUser(User user);

    UserDTO loginUser(String username, String password);

    UserDTO loginGoogle(UserDTO userDTO);

    Boolean verityOTPEmail(OtpDTO otpDTO);

    UserDTO verityOTPEmailRegister(OtpDTO otpDTO);

    UserDTO verityOTPEmailForgotPassword(OtpDTO otpDTO);

    String generateOTPEmail(String email);

    String generateOTDEmailForgotPassword(String email);

}
