package com.epitech.cryptoProject.services.jwtAuthentication;

import com.epitech.cryptoProject.dtos.UserWithoutPwdDto;

public interface JwtTokenInterface {

  UserWithoutPwdDto generateJwtToken(UserWithoutPwdDto userWithoutPwdDto);
}
