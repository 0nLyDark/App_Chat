package com.dangphuoctai.App_Chat.service;

import com.dangphuoctai.App_Chat.payloads.EmailDetails;

public interface EmailService {

    // Method
    // To send a simple email
    String sendSimpleMail(EmailDetails details);

    // Method
    // To send an email with attachment
    String sendMailWithAttachment(EmailDetails details);
}
