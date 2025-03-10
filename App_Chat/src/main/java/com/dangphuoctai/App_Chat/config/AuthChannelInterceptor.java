package com.dangphuoctai.App_Chat.config;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.SimpMessageType;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;

import org.springframework.stereotype.Component;

import com.dangphuoctai.App_Chat.exceptions.APIException;
import com.dangphuoctai.App_Chat.security.JWTUtil;
import com.dangphuoctai.App_Chat.service.UserService;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 99) // Đảm bảo thứ tự thực thi
public class AuthChannelInterceptor implements ChannelInterceptor {

    @Autowired
    private JWTUtil jwtUtil;

    @Lazy
    @Autowired
    private UserService userService;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        try {

            StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

            String token = accessor.getFirstNativeHeader("Authorization");
            if (SimpMessageType.CONNECT.equals(accessor.getMessageType())) {
                if (token != null && token.startsWith("Bearer ")) {
                    token = token.substring(7);
                    if (jwtUtil.validateToken(token)) {
                        System.out.println("Token hợp lệ: " + token);
                        System.out.println("Token : " + jwtUtil.extractToken(token));
                        UserInfoConfig userPrincipal = jwtUtil.extractToken(token);
                        accessor.setUser(userPrincipal);
                        userService.updateUserStatus(userPrincipal.getUserId(), true);
                    } else {
                        throw new Exception("Invalid Token");
                    }
                } else {
                    System.out.println("Không tìm thấy token.");
                    throw new Exception("Invalid Token");
                }
            }
        } catch (Exception e) {
            System.out.println("Error Authorization Tokenssssss: " + e.getMessage());
            throw new APIException("Error Authorization Token: " + e.getMessage());
            // return null;
        }
        return message;
    }

    @Override
    public void postSend(Message<?> message, MessageChannel channel, boolean sent) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (SimpMessageType.DISCONNECT.equals(accessor.getMessageType())) {
            UserInfoConfig userInfoConfig = (UserInfoConfig) accessor.getUser();
            userService.updateUserStatus(userInfoConfig.getUserId(), false);
        }
    }
}
