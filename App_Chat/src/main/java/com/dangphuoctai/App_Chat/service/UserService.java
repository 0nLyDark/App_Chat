package com.dangphuoctai.App_Chat.service;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.dangphuoctai.App_Chat.entity.User;
import com.dangphuoctai.App_Chat.payloads.DTO.UserDTO;
import com.dangphuoctai.App_Chat.payloads.Response.UserResponse;

public interface UserService {

    List<User> getUsers();

    UserDTO getUserById(Long userId, Boolean status);

    UserDTO getUserByEmail(String email);

    User updateUser(Long userId, User user);

    UserResponse searchUser(Long userId, String keyword, Integer pageNumber, Integer pageSize, String sortBy,
            String sortOrder);

    UserDTO updateAvatar(Long userId, MultipartFile image) throws IOException;

    InputStream getAvatar(String fileName) throws FileNotFoundException;

    String resetPassword(Long userId, String password);

    UserDTO updateFullName(UserDTO userDTO);

    UserDTO updateUserStatus(Long userId, Boolean online);

}
