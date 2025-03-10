package com.dangphuoctai.App_Chat.service.impl;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.Date;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dangphuoctai.App_Chat.config.AppConstants;
import com.dangphuoctai.App_Chat.entity.OTP;
import com.dangphuoctai.App_Chat.entity.Role;
import com.dangphuoctai.App_Chat.entity.User;
import com.dangphuoctai.App_Chat.exceptions.APIException;
import com.dangphuoctai.App_Chat.exceptions.ResourceNotFoundException;
import com.dangphuoctai.App_Chat.payloads.DTO.OtpDTO;
import com.dangphuoctai.App_Chat.payloads.DTO.UserDTO;
import com.dangphuoctai.App_Chat.repository.OTPRepo;
import com.dangphuoctai.App_Chat.repository.RoleRepo;
import com.dangphuoctai.App_Chat.repository.UserRepo;
import com.dangphuoctai.App_Chat.service.AuthService;

@Service
@Transactional
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private RoleRepo roleRepo;

    @Autowired
    private OTPRepo otpRepo;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public UserDTO registerUser(User user) {
        try {
            Role role = roleRepo.findById(AppConstants.USER_ID).get();
            user.setRoles(Set.of(role));
            user.setEnabled(false);
            user.setAvatar("default.png");
            User registeredUser = userRepo.save(user);
            return modelMapper.map(registeredUser, UserDTO.class);
        } catch (Exception e) {
            throw new APIException("User already exists with emailId: " +
                    user.getEmail() + e);
        }
    }

    @Override
    public UserDTO loginUser(String username, String password) {
        User user;
        if (username.matches("[a-zA-Z0-9]+@[a-zA-Z0-9.]+")) {
            user = userRepo.findByEmail(username)
                    .orElseThrow(() -> new ResourceNotFoundException("user", "email", username));
        } else {
            user = userRepo.findByUsername(username)
                    .orElseThrow(() -> new ResourceNotFoundException("user", "username", username));
        }
        boolean authentication = passwordEncoder.matches(password, user.getPassword());
        if (!authentication) {
            throw new APIException("Invalid password");
        }
        if (user.getEnabled() == false) {
            throw new AccessDeniedException("Unverified account");
        }

        return modelMapper.map(user, UserDTO.class);
    }

    @Override
    public UserDTO verityOTPEmailRegister(OtpDTO otpDTO) {
        Boolean verityOTP = verityOTPEmail(otpDTO);
        if (!verityOTP) {
            throw new APIException("Invalid OTD Email");
        }
        User user = userRepo.findByEmail(otpDTO.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Users", "email", otpDTO.getEmail()));
        user.setEnabled(true);
        userRepo.save(user);
        return modelMapper.map(user, UserDTO.class);
    }

    @Override
    public UserDTO verityOTPEmailForgotPassword(OtpDTO otpDTO) {
        Boolean verityOTP = verityOTPEmail(otpDTO);
        if (!verityOTP) {
            throw new APIException("Invalid OTD Email");
        }
        User user = userRepo.findByEmail(otpDTO.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Users", "email", otpDTO.getEmail()));
        return modelMapper.map(user, UserDTO.class);
    }

    @Override
    public String generateOTDEmailForgotPassword(String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        return generateOTPEmail(email);
    }

    @Override
    public String generateOTPEmail(String email) {
        Optional<OTP> optionalOtp = otpRepo.findByEmail(email);
        OTP otp;
        if (optionalOtp.isPresent()) {
            otp = optionalOtp.get();
        } else {
            otp = new OTP();
            otp.setEmail(email);
        }
        SecureRandom secureRandom = new SecureRandom();
        int code = secureRandom.nextInt(90000) + 10000;
        String strOTP = String.valueOf(code);
        otp.setCodeOTP(strOTP);
        otp.setExpirationTime(new Date(
                Instant.now().plus(5, ChronoUnit.MINUTES).toEpochMilli()));
        otpRepo.save(otp);
        return strOTP;
    }

    @Override
    public Boolean verityOTPEmail(OtpDTO otpDTO) {
        OTP otp = otpRepo.findByEmail(otpDTO.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("OTP", "email", otpDTO.getEmail()));
        if (!otp.getCodeOTP().equals(otpDTO.getCodeOTP())) {
            return false;
        }
        Date currentDate = new Date();
        if (otp.getExpirationTime().before(currentDate)) {
            return false;
        }
        otpRepo.delete(otp);
        return true;
    }

}
