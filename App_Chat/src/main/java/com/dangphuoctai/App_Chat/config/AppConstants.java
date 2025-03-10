package com.dangphuoctai.App_Chat.config;

public class AppConstants {
    public static final String PAGE_NUMBER = "0";
    public static final String PAGE_SIZE = "5";
    public static final String SORT_USERS_BY = "userId";
    public static final String SORT_FRIENDREQUEST_BY = "friendRequestId";
    public static final String SORT_CONVERSATION_BY = "conversationId";
    public static final String SORT_MESSAGE_BY = "messageId";

    public static final String SORT_DIR = "asc";

    public static final String[] PUBLIC_URLS = { "/v3/api-docs/**", "/swagger-ui/**", "/api/register",
            "/api/login", "/api/otp/**", "/api/public/users/avatar/**"
    };
    public static final String[] USER_URLS = { "/api/public/**",
    };
    public static final String[] AUTH_URLS = { "/api/public/**", "/ws/**"
    };
    public static final Long USER_ID = 102L;
    public static final Long ADMIN_ID = 101L;

}
