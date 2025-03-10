package com.dangphuoctai.App_Chat.controller;

import java.util.Collections;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dangphuoctai.App_Chat.entity.User;
import com.dangphuoctai.App_Chat.exceptions.UserNotFoundException;
import com.dangphuoctai.App_Chat.payloads.EmailDetails;
import com.dangphuoctai.App_Chat.payloads.RequestLogin;
import com.dangphuoctai.App_Chat.payloads.DTO.OtpDTO;
import com.dangphuoctai.App_Chat.payloads.DTO.UserDTO;
import com.dangphuoctai.App_Chat.security.JWTUtil;
import com.dangphuoctai.App_Chat.service.AuthService;
import com.dangphuoctai.App_Chat.service.EmailService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@CrossOrigin("*")
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private JWTUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> registerHandler(@RequestBody User user)
            throws UserNotFoundException {

        String encodedPass = passwordEncoder.encode(user.getPassword());

        user.setPassword(encodedPass);

        UserDTO userDTO = authService.registerUser(user);

        String otd = authService.generateOTPEmail(userDTO.getEmail());
        EmailDetails emailDetails = new EmailDetails();
        emailDetails.setRecipient(userDTO.getEmail());
        emailDetails.setMsgBody("Mã OTP đăng ký của bạn là: " + otd);
        emailDetails.setSubject("App Chat");
        System.out.println(emailService.sendSimpleMail(emailDetails));

        System.out.println(userDTO);

        return new ResponseEntity<Map<String, Object>>(
                Collections.singletonMap("messages", "Account register succcessful "),
                HttpStatus.CREATED);

    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginHandler(@Valid @RequestBody RequestLogin requestLogin) {

        UserDTO userDTO = authService.loginUser(requestLogin.getUsername(), requestLogin.getPassword());

        String token = jwtUtil.generateToken(userDTO);

        return new ResponseEntity<Map<String, Object>>(Collections.singletonMap("jwt-token", token),
                HttpStatus.OK);
    }

    @GetMapping("/otp/register/email/{email}")
    public ResponseEntity<Map<String, Object>> generateOTDEmailRegister(@PathVariable String email) {
        String otd = authService.generateOTPEmail(email);
        EmailDetails emailDetails = new EmailDetails();
        emailDetails.setRecipient(email);
        emailDetails.setMsgBody("Mã OTP đăng ký của bạn là: " + otd);
        emailDetails.setSubject("Mã xác thực OTP Đăng ký App Chat");
        emailService.sendSimpleMail(emailDetails);

        return new ResponseEntity<Map<String, Object>>(Collections.singletonMap("Time", 5),
                HttpStatus.OK);

    }

    @GetMapping("/otp/forgotPassword/email/{email}")
    public ResponseEntity<Map<String, Object>> generateOTDEmailForgotPassword(@PathVariable String email) {
        String otd = authService.generateOTDEmailForgotPassword(email);
        EmailDetails emailDetails = new EmailDetails();
        emailDetails.setRecipient(email);
        emailDetails.setMsgBody("Mã OTP xác thực tài khoản của bạn là: " + otd);
        emailDetails.setSubject("Mã xác thực OTP tài khoản App Chat");
        emailService.sendSimpleMail(emailDetails);

        return new ResponseEntity<Map<String, Object>>(Collections.singletonMap("Time", 5),
                HttpStatus.OK);

    }

    

    @PostMapping("/otp/verity/register")
    public ResponseEntity<Map<String, Object>> verityOTPEmailRegister(@RequestBody OtpDTO otpDTO) {
        UserDTO userDTO = authService.verityOTPEmailRegister(otpDTO);

        String token = jwtUtil.generateToken(userDTO);

        return new ResponseEntity<Map<String, Object>>(Collections.singletonMap("jwt-token", token),
                HttpStatus.OK);

    }

    @PostMapping("/otp/verity/forgotPassword")
    public ResponseEntity<Map<String, Object>> verityOTPEmailForgotPassword(@RequestBody OtpDTO otpDTO) {
        UserDTO userDTO = authService.verityOTPEmailForgotPassword(otpDTO);

        String token = jwtUtil.generateToken(userDTO);

        return new ResponseEntity<Map<String, Object>>(Collections.singletonMap("jwt-token", token),
                HttpStatus.OK);

    }

}
