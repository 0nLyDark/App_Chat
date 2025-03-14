package com.dangphuoctai.App_Chat.controller;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Collections;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.dangphuoctai.App_Chat.config.AppConstants;
import com.dangphuoctai.App_Chat.entity.User;
import com.dangphuoctai.App_Chat.payloads.DTO.ResetPasswordDTO;
import com.dangphuoctai.App_Chat.payloads.DTO.UserDTO;
import com.dangphuoctai.App_Chat.payloads.Response.UserResponse;
import com.dangphuoctai.App_Chat.service.UserService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestParam;

@CrossOrigin("*")
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {

    @Autowired
    private UserService userService;

    // @GetMapping("/public/users")
    // public ResponseEntity<List<User>> getUsers() {
    // // Authentication authentication =
    // // SecurityContextHolder.getContext().getAuthentication();
    // // Jwt jwt = (Jwt) authentication.getPrincipal();
    // // // Lấy các thông tin từ claims trong JWT

    // List<User> users = userService.getUsers();
    // return new ResponseEntity<List<User>>(users, HttpStatus.OK);
    // }

    @GetMapping("/public/users/{userId}")
    public ResponseEntity<UserDTO> getUser(@PathVariable Long userId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Jwt jwt = (Jwt) authentication.getPrincipal();
        String role = (String) jwt.getClaims().get("scope");
        Long id = (Long) jwt.getClaims().get("userId");
        Boolean status = true;
        if (!role.contains("ADMIN") && id != userId) {
            status = false;
        }
        UserDTO user = userService.getUserById(userId, status);
        return new ResponseEntity<UserDTO>(user, HttpStatus.OK);
    }

    @GetMapping("/public/users/email/{email}")
    public ResponseEntity<UserDTO> getUser(@PathVariable String email) {
        if (email.equals("token")) {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Jwt jwt = (Jwt) authentication.getPrincipal();
            email = (String) jwt.getClaims().get("email");
        }
        UserDTO userDTO = userService.getUserByEmail(email);
        return new ResponseEntity<UserDTO>(userDTO, HttpStatus.OK);
    }

    @GetMapping("/public/users/keyword/{keyword}")
    public ResponseEntity<UserResponse> searchUser(@PathVariable String keyword,
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_USERS_BY, required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = (Long) jwt.getClaims().get("userId");
        UserResponse userResponse = userService.searchUser(userId, keyword,
                pageNumber == 0 ? pageNumber : pageNumber - 1,
                pageSize,
                "id".equals(sortBy) ? "userId" : sortBy,
                sortOrder);
        return new ResponseEntity<UserResponse>(userResponse, HttpStatus.OK);
    }

    public String getMethodName(@RequestParam String param) {
        return new String();
    }

    @PutMapping("/public/users/{userId}")
    public ResponseEntity<User> updateUser(@PathVariable Long userId, @RequestBody User user) {
        User updatedUser = userService.updateUser(userId, user);
        return ResponseEntity.ok(updatedUser);
    }

    @GetMapping("/public/users/avatar/{fileName}")
    public ResponseEntity<InputStreamResource> getImage(@PathVariable String fileName) throws FileNotFoundException {
        InputStream imageStream = userService.getAvatar(fileName);
        HttpHeaders headers = new HttpHeaders();

        headers.setContentType(MediaType.IMAGE_PNG);
        headers.setContentDispositionFormData("inline", fileName);

        return new ResponseEntity<>(new InputStreamResource(imageStream), headers, HttpStatus.OK);
    }

    @PutMapping("/public/users/avatar")
    public ResponseEntity<UserDTO> updateUserAvatar(
            @RequestParam("image") MultipartFile image) throws IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Jwt jwt = (Jwt) authentication.getPrincipal();
        Long userId = (Long) jwt.getClaims().get("userId");

        UserDTO updateUser = userService.updateAvatar(userId, image);

        return new ResponseEntity<UserDTO>(updateUser, HttpStatus.OK);
    }

    @PostMapping("/public/users/resetPassword")
    public ResponseEntity<Map<String, Object>> ResetPassword(@RequestBody ResetPasswordDTO resetPasswordDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Jwt jwt = (Jwt) authentication.getPrincipal();
        String role = (String) jwt.getClaims().get("scope");
        Long id = (Long) jwt.getClaims().get("userId");
        String result = userService.resetPassword(role.contains("ADMIN") ? resetPasswordDTO.getUserId() : id,
                resetPasswordDTO.getPassword());

        return new ResponseEntity<Map<String, Object>>(Collections.singletonMap("result", result),
                HttpStatus.OK);

    }

    @PutMapping("/public/users/fullName")
    public ResponseEntity<UserDTO> updateFullName(@RequestBody UserDTO userDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Jwt jwt = (Jwt) authentication.getPrincipal();
        String role = (String) jwt.getClaims().get("scope");
        Long id = (Long) jwt.getClaims().get("userId");
        if (id != userDTO.getUserId()) {
            throw new AccessDeniedException("No user access");
        }
        UserDTO user = userService.updateFullName(userDTO);

        return new ResponseEntity<UserDTO>(user, HttpStatus.OK);
    }
}
