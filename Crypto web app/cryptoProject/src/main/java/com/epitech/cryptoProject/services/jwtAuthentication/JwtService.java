package com.epitech.cryptoProject.services.jwtAuthentication;

import com.epitech.cryptoProject.dtos.UserWithoutPwdDto;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.Date;
import java.util.Objects;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtService implements JwtTokenInterface {

  @Value("${jwt.secret}")
  private String jwtSecret;

  @Override
  public UserWithoutPwdDto generateJwtToken(UserWithoutPwdDto userWithoutPwdDto) {
    final String jwtToken = Jwts.builder().setSubject(userWithoutPwdDto.getEmail())
        .setIssuedAt(new Date()).signWith(SignatureAlgorithm.HS256, jwtSecret).claim("role", userWithoutPwdDto.getRole()).compact();
    userWithoutPwdDto.setAccess_token(jwtToken);
    return userWithoutPwdDto;
  }

  public boolean isAdmin(final String authorization) {
    final String token = authorization.substring(7);
    final Claims claims = Jwts.parser().setSigningKey("PxG6btQ6H76WqlKaqRfc6yWan8XaMDz5AHTRChiX2qm5GQfDVfsA2oR2WjvynCt").parseClaimsJws(token).getBody();

    if (Objects.isNull(claims.get("role"))) {
      return false;
    }

    final String role = claims.get("role").toString();

    return role.equals("ADMIN");
  }
}
