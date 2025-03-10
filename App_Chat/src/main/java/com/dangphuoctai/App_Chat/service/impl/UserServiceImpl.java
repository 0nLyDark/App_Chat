package com.dangphuoctai.App_Chat.service.impl;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.dangphuoctai.App_Chat.entity.User;
import com.dangphuoctai.App_Chat.exceptions.ResourceNotFoundException;
import com.dangphuoctai.App_Chat.payloads.DTO.UserDTO;
import com.dangphuoctai.App_Chat.payloads.DTO.UserSearchDTO;
import com.dangphuoctai.App_Chat.payloads.Response.UserResponse;
import com.dangphuoctai.App_Chat.repository.RoleRepo;
import com.dangphuoctai.App_Chat.repository.UserRepo;
import com.dangphuoctai.App_Chat.service.FileService;
import com.dangphuoctai.App_Chat.service.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private RoleRepo roleRepo;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private FileService fileService;

    @Autowired
    private PasswordEncoder passwordEncoder;
    @Value("${project.image}")
    private String path;

    @Override
    public List<User> getUsers() {
        return userRepo.findAll();
    }

    @Override
    public UserDTO getUserById(Long userId, Boolean status) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "userId", userId));
        UserDTO userDTO;
        if (status) {
            userDTO = modelMapper.map(user, UserDTO.class);
        } else {
            userDTO = new UserDTO();
            userDTO.setUserId(userId);
            userDTO.setFullName(user.getFullName());
            userDTO.setAvatar(user.getAvatar());
        }
        return userDTO;
    }

    @Override
    public UserDTO getUserByEmail(String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("user", "email", email));
        return modelMapper.map(user, UserDTO.class);
    }

    @Override
    public UserResponse searchUser(Long userId, String keyword, Integer pageNumber, Integer pageSize, String sortBy,
            String sortOrder) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "userId", userId));

        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);

        Page<User> pageUsers = userRepo.findByFullNameContaining(keyword, pageDetails);

        List<User> users = pageUsers.getContent();

        Set<Long> friendIds = user.getContacts().stream()
                .map(User::getUserId)
                .collect(Collectors.toSet());
        Set<Long> receiverIds = user.getSentFriendRequests().stream()
                .map(friendRequest -> friendRequest.getReceiver().getUserId())
                .collect(Collectors.toSet());
        Set<Long> senderIds = user.getFriendRequestsReceived().stream()
                .map(friendRequest -> friendRequest.getSender().getUserId())
                .collect(Collectors.toSet());

        List<UserSearchDTO> userSearchDTOs = users.stream()
                .filter(u -> u.getUserId() != userId)
                .map(userSearch -> {
                    UserSearchDTO userSearchDTO = new UserSearchDTO();
                    userSearchDTO.setUserId(userSearch.getUserId());
                    userSearchDTO.setFullName(userSearch.getFullName());
                    userSearchDTO.setAvatar(userSearch.getAvatar());

                    if (friendIds.contains(userSearch.getUserId())) {
                        userSearchDTO.setTypeContact("FRIEND");
                    } else if (senderIds.contains(userSearch.getUserId())) {
                        userSearchDTO.setTypeContact("ACCEPT");
                    } else if (receiverIds.contains(userSearch.getUserId())) {
                        userSearchDTO.setTypeContact("REQUEST");
                    } else {
                        userSearchDTO.setTypeContact("NOT");
                    }
                    return userSearchDTO;
                })
                .collect(Collectors.toList());

        UserResponse userResponse = new UserResponse();
        userResponse.setContent(userSearchDTOs);
        userResponse.setPageNumber(pageUsers.getNumber());
        userResponse.setPageSize(pageUsers.getSize());
        userResponse.setTotalElements(pageUsers.getTotalElements());
        userResponse.setTotalPages(pageUsers.getTotalPages());
        userResponse.setLastPage(pageUsers.isLast());
        return userResponse;
    }

    @Override
    public User updateUser(Long userId, User user) {
        User existingUser = userRepo.findById(userId).orElse(null);
        if (existingUser != null) {
            existingUser.setUsername(user.getUsername());
            // existingUser.setPassword(user.getPassword());
            existingUser.setEmail(user.getEmail());
            existingUser.setFullName(user.getFullName());
            return userRepo.save(existingUser);
        }
        return null;
    }

    @Override
    public UserDTO updateAvatar(Long userId, MultipartFile image) throws IOException {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "userId", userId));

        String fileName = fileService.uploadImage(path, image);
        user.setAvatar(fileName);
        userRepo.save(user);
        return modelMapper.map(user, UserDTO.class);
    }

    @Override
    public InputStream getAvatar(String fileName) throws FileNotFoundException {
        return fileService.getResource(path, fileName);
    }

    @Override
    public String resetPassword(Long userId, String password) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "userId", userId));
        String encodedPass = passwordEncoder.encode(password);
        user.setPassword(encodedPass);
        userRepo.save(user);
        return "Reset new password succcessfuly";
    }

    @Override
    public UserDTO updateFullName(UserDTO userDTO) {
        User user = userRepo.findById(userDTO.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "userId", userDTO.getUserId()));
        user.setFullName(userDTO.getFullName());
        userRepo.save(user);

        return modelMapper.map(user, UserDTO.class);
    }

    @Override
    public UserDTO updateUserStatus(Long userId, Boolean online) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "userId", userId));
        user.setIsOnline(online);
        user.setTimeOffline(LocalDateTime.now());
        userRepo.save(user);
        UserDTO userDTO = modelMapper.map(user, UserDTO.class);
        for (User friend : user.getContacts()) {
            messagingTemplate.convertAndSendToUser(friend.getUsername(),
                    "/queue/status", userDTO);
        }
        return userDTO;
    }

}
