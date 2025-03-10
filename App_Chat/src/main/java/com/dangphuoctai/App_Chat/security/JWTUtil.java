package com.dangphuoctai.App_Chat.security;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Map;
import java.util.StringJoiner;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import com.dangphuoctai.App_Chat.config.UserInfoConfig;
import com.dangphuoctai.App_Chat.payloads.DTO.UserDTO;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JWSObject;
import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.Payload;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;

@Component
public class JWTUtil {

    @Value("${jwt_secret}")
    private String jwt_key;

    public String generateToken(UserDTO userDTO) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject("User")
                .issuer("Auth")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(1, ChronoUnit.HOURS).toEpochMilli()))
                .claim("email", userDTO.getEmail())
                .claim("userId", userDTO.getUserId())
                .claim("username", userDTO.getUsername())
                .claim("scope", buildScope(userDTO))
                .build();
        Payload payload = new Payload(jwtClaimsSet.toJSONObject());

        JWSObject jwsObject = new JWSObject(header, payload);

        try {
            jwsObject.sign(new MACSigner(jwt_key.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            throw new RuntimeException(e);
        }
    }

    private String buildScope(UserDTO userDTO) {
        StringJoiner stringJoiner = new StringJoiner(" ");
        if (!CollectionUtils.isEmpty(userDTO.getRoles())) {
            userDTO.getRoles().forEach(s -> stringJoiner.add(s.getRoleName()));
        }
        return stringJoiner.toString();

    }

    public boolean validateToken(String token) throws JOSEException, ParseException {

        JWSVerifier verifier = new MACVerifier(jwt_key.getBytes());
        SignedJWT signedJWT = SignedJWT.parse(token);

        Date expiryDate = signedJWT.getJWTClaimsSet().getExpirationTime();

        boolean verified = signedJWT.verify(verifier);

        return verified && expiryDate.after(new Date());
    }

    public UserInfoConfig extractToken(String token) throws ParseException, JOSEException {
        UserInfoConfig userInfoConfig = new UserInfoConfig();
        JWSObject jwsObject = JWSObject.parse(token);
        Map<String, Object> object = jwsObject.getPayload().toJSONObject();
        userInfoConfig.setUserId((Long) object.get("userId"));
        userInfoConfig.setEmail((String) object.get("email"));
        userInfoConfig.setName((String) object.get("username"));
        userInfoConfig.setRole((String) object.get("scope"));

        return userInfoConfig;
    }
}
