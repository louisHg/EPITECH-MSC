package com.epitech.cryptoProject.services;

import static com.epitech.cryptoProject.utils.ConstantsMessages.BAD_PREFERENCES_GIVEN;
import static com.epitech.cryptoProject.utils.ConstantsMessages.NO_PREFERENCES_FOUND;
import static com.epitech.cryptoProject.utils.ConstantsMessages.ROLE_ADMIN_MANDATORY;
import static io.vavr.control.Either.left;
import static io.vavr.control.Either.right;

import com.epitech.cryptoProject.data.Preference;
import com.epitech.cryptoProject.dtos.ErrorResponseMessage;
import com.epitech.cryptoProject.dtos.PreferenceDto;
import com.epitech.cryptoProject.repositories.PreferencesRepository;
import com.epitech.cryptoProject.services.jwtAuthentication.JwtService;
import io.vavr.control.Either;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import javax.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@Transactional
public class PreferenceService {

    private final PreferencesRepository preferencesRepository;
    private final JwtService jwtService;
    private final ModelMapper modelMapper;

    public PreferenceService(PreferencesRepository preferencesRepository, JwtService jwtService, ModelMapper modelMapper) {
        this.preferencesRepository = preferencesRepository;
        this.jwtService = jwtService;
        this.modelMapper = modelMapper;
    }

    public Either<ErrorResponseMessage, List<PreferenceDto>> savePreferences(final List<PreferenceDto> preferencesDtoList) {

        List<Integer> exception = new ArrayList<>();

        final UUID userId = preferencesDtoList.get(0).getUserId();
        preferencesDtoList.forEach(preferenceDto -> {
            final Integer articleExcep = preferencesRepository.articleExists(preferenceDto.getArticleId(), userId);
            final Integer coinExcep = preferencesRepository.coinExists(preferenceDto.getCoinId(), userId);
            if (articleExcep == 1 || coinExcep == 1){
                exception.add(1);
            }
        });

        preferencesDtoList.forEach(preference -> {
            if (Objects.isNull(preference.getCoinId()) && Objects.isNull(preference.getArticleId())) {
                exception.add(1);
            }
        });

        if(!exception.isEmpty()) {
            return left(ErrorResponseMessage.of(400, BAD_PREFERENCES_GIVEN));
        }

        final List<Preference> preferencesList = preferencesDtoList.stream().map(preferenceDto -> modelMapper.map(preferenceDto, Preference.class))
                .collect(Collectors.toList());
        preferencesRepository.saveAll(preferencesList);

        return right(preferencesDtoList);
    }

    public Either<ErrorResponseMessage, List<PreferenceDto>> getAllPreferences(final String authorization) {

        if (Boolean.FALSE.equals(jwtService.isAdmin(authorization))) {
            return left(ErrorResponseMessage.of(401, ROLE_ADMIN_MANDATORY));
        }

        final List<Preference> preferencesList = preferencesRepository.findAll();

        if (preferencesList.isEmpty()) {
            return left(ErrorResponseMessage.of(404, NO_PREFERENCES_FOUND));
        }

        final List<PreferenceDto> preferenceDtoList = preferencesList.stream().map(preference -> modelMapper.map(preference, PreferenceDto.class))
                .collect(Collectors.toList());

        return right(preferenceDtoList);
    }

    public Either<ErrorResponseMessage, List<PreferenceDto>> getPreferencesByUserId(final UUID userId) {
        final Optional<List<Preference>> optionalPreferenceList = preferencesRepository.findPreferenceByUserId(userId);

        if (optionalPreferenceList.isEmpty()) {
            return left(ErrorResponseMessage.of(404, NO_PREFERENCES_FOUND));
        }

        final List<Preference> preferences = optionalPreferenceList.get();

        final List<PreferenceDto> preferenceDto = preferences.stream().map(preference -> modelMapper.map(preference, PreferenceDto.class))
            .collect(Collectors.toList());

        return right(preferenceDto);
    }

    public Optional<ErrorResponseMessage> deletePreferences(final List<PreferenceDto> preferenceDtoList) {
        final Optional<PreferenceDto> optionalBadPreferenceDto = preferenceDtoList.stream()
                .filter(preferenceDto -> Objects.isNull(preferenceDto.getId()) || Objects.isNull(preferenceDto.getUserId())).findFirst();

        if (optionalBadPreferenceDto.isPresent()) {
            return Optional.of(ErrorResponseMessage.of(400, BAD_PREFERENCES_GIVEN + " " + optionalBadPreferenceDto.get()));
        }

        preferenceDtoList.forEach(preferenceDto -> preferencesRepository.deletePreferenceByUuidAndId(preferenceDto.getUserId(), preferenceDto.getId()));

        return Optional.empty();
    }
}
