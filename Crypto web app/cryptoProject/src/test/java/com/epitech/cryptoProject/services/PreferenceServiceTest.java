package com.epitech.cryptoProject.services;

import static com.epitech.cryptoProject.utils.ConstantsMessages.BAD_PREFERENCES_GIVEN;
import static com.epitech.cryptoProject.utils.ConstantsMessages.NO_PREFERENCES_FOUND;
import static com.epitech.cryptoProject.utils.ConstantsMessages.ROLE_ADMIN_MANDATORY;
import static com.epitech.cryptoProject.utils.TestConstants.ADMIN_TOKEN;
import static com.epitech.cryptoProject.utils.TestConstants.PREFERENCE_ID;
import static com.epitech.cryptoProject.utils.TestConstants.PREFERENCE_ZERO;
import static com.epitech.cryptoProject.utils.TestConstants.USER_UUID;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import com.epitech.cryptoProject.data.Preference;
import com.epitech.cryptoProject.dtos.ErrorResponseMessage;
import com.epitech.cryptoProject.dtos.PreferenceDto;
import com.epitech.cryptoProject.repositories.PreferencesRepository;
import com.epitech.cryptoProject.services.jwtAuthentication.JwtService;
import io.vavr.control.Either;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;

@ExtendWith(MockitoExtension.class)
public class PreferenceServiceTest {

    @InjectMocks
    PreferenceService preferenceService;

    @Mock
    private PreferencesRepository preferencesRepository;

    @Mock
    private JwtService jwtService;

    @Mock
    private ModelMapper modelMapper;

    @Test
    @DisplayName("Should return a 201 response code when a preference is successfully added")
    void testSavePreference() {
        final PreferenceDto preferenceDto = PreferenceDto.builder()
                .id(PREFERENCE_ID)
                .userId(USER_UUID)
                .articleId(PREFERENCE_ZERO)
                .coinId(PREFERENCE_ID)
                .build();

        final Preference preference = Preference.builder()
                .id(PREFERENCE_ID)
                .userId(USER_UUID)
                .articleId(PREFERENCE_ZERO)
                .coinId(PREFERENCE_ID)
                .build();

        final List<Preference> preferenceList = new ArrayList<>();
        preferenceList.add(preference);

        final List<PreferenceDto> preferenceDtoList = new ArrayList<>();
        preferenceDtoList.add(preferenceDto);

        given(preferencesRepository.articleExists(0, preferenceDto.getUserId())).willReturn(0);
        given(preferencesRepository.coinExists(PREFERENCE_ID, preferenceDto.getUserId())).willReturn(0);
        given(preferencesRepository.saveAll(preferenceList)).willReturn(preferenceList);
        given(modelMapper.map(any(), eq(Preference.class))).willReturn(preference);

        final Either<ErrorResponseMessage, List<PreferenceDto>> result = preferenceService.savePreferences(preferenceDtoList);

        assertTrue(result.isRight());

        final PreferenceDto resultPreference = result.get().get(0);

        assertEquals(PREFERENCE_ID, resultPreference.getId());
        assertEquals(PREFERENCE_ZERO, resultPreference.getArticleId());
        assertEquals(PREFERENCE_ID, resultPreference.getCoinId());
    }

    @Test
    @DisplayName("Should return 400 error code if article and coin is missing in the request")
    void testSavePreferenceBadPreferenceGiven(){
        final PreferenceDto preferenceDto = PreferenceDto.builder()
                .id(PREFERENCE_ID)
                .userId(USER_UUID)
                .articleId(null)
                .coinId(null)
                .build();

        final Preference preference = Preference.builder()
                .id(PREFERENCE_ID)
                .userId(USER_UUID)
                .articleId(null)
                .coinId(null)
                .build();

        final List<Preference> preferenceList = new ArrayList<>();
        preferenceList.add(preference);

        final List<PreferenceDto> preferenceDtoList = new ArrayList<>();
        preferenceDtoList.add(preferenceDto);

        given(preferencesRepository.articleExists(null, preferenceDto.getUserId())).willReturn(0);
        given(preferencesRepository.coinExists(null, preferenceDto.getUserId())).willReturn(0);

        final Either<ErrorResponseMessage, List<PreferenceDto>> result = preferenceService.savePreferences(preferenceDtoList);

        assertTrue(result.isLeft());
        assertEquals(400, result.getLeft().getCode());
        assertEquals(BAD_PREFERENCES_GIVEN, result.getLeft().getMessage());
    }

    @Test
    @DisplayName("Should return a 200 response code with a List<PreferenceDto>")
    void testGetPreferences() {
        final PreferenceDto preferenceDto = PreferenceDto.builder()
                .id(PREFERENCE_ID)
                .userId(USER_UUID)
                .articleId(null)
                .coinId(null)
                .build();

        final Preference preference = Preference.builder()
                .id(PREFERENCE_ID)
                .userId(USER_UUID)
                .articleId(null)
                .coinId(null)
                .build();

        final List<Preference> preferenceList = new ArrayList<>();
        preferenceList.add(preference);

        final List<PreferenceDto> preferenceDtoList = new ArrayList<>();
        preferenceDtoList.add(preferenceDto);

        given(preferencesRepository.findAll()).willReturn(preferenceList);
        given(modelMapper.map(any(), eq(PreferenceDto.class))).willReturn(preferenceDto);
        given(jwtService.isAdmin(anyString())).willReturn(true);

        final Either<ErrorResponseMessage, List<PreferenceDto>> result = preferenceService.getAllPreferences(ADMIN_TOKEN);

        assertTrue(result.isRight());
        assertEquals(preferenceDto, result.get().get(0));
    }

    @Test
    @DisplayName("Should return a 200 response code with a List<PreferenceDto>")
    void testGetPreferencesNotAdmin() {
      
        given(jwtService.isAdmin(anyString())).willReturn(false);

        final Either<ErrorResponseMessage, List<PreferenceDto>> result = preferenceService.getAllPreferences(ADMIN_TOKEN);

        verify(preferencesRepository, never()).findAll();
        verify(modelMapper, never()).map(any(), anyString());
        verify(jwtService, times(1)).isAdmin(anyString());

        assertTrue(result.isLeft());
        assertEquals(ROLE_ADMIN_MANDATORY, result.getLeft().getMessage());
        assertEquals(401, result.getLeft().getCode());
    }

    @Test
    @DisplayName("Should return a 404 not found response code if there are no preferences")
    void testGetPreferencesErrorNotFound() {
        given(preferencesRepository.findAll()).willReturn(Collections.emptyList());
        given(jwtService.isAdmin(anyString())).willReturn(true);

        final Either<ErrorResponseMessage, List<PreferenceDto>> result = preferenceService.getAllPreferences(ADMIN_TOKEN);

        assertTrue(result.isLeft());
        assertEquals(404, result.getLeft().getCode());
        assertEquals(NO_PREFERENCES_FOUND, result.getLeft().getMessage());
    }

    @Test
    @DisplayName("Should return a 200 response code if a user is retrieved")
    void testGetPreferencesByUuid() {
        final PreferenceDto preferenceDto = PreferenceDto.builder()
                .id(PREFERENCE_ID)
                .userId(USER_UUID)
                .articleId(null)
                .coinId(null)
                .build();

        final Preference preference = Preference.builder()
                .id(PREFERENCE_ID)
                .userId(USER_UUID)
                .articleId(null)
                .coinId(null)
                .build();

        final List<Preference> preferenceList = new ArrayList<>();
        preferenceList.add(preference);

        final List<PreferenceDto> preferenceDtoList = new ArrayList<>();
        preferenceDtoList.add(preferenceDto);

        given(preferencesRepository.findPreferenceByUserId(preferenceDto.getUserId())).willReturn(Optional.of(preferenceList));
        given(modelMapper.map(any(), eq(PreferenceDto.class))).willReturn(preferenceDto);

        final Either<ErrorResponseMessage, List<PreferenceDto>> result = preferenceService.getPreferencesByUserId(preferenceDto.getUserId());

        assertTrue(result.isRight());
        assertEquals(preferenceDtoList, result.get());
    }

    @Test
    @DisplayName("Should return a 404 response code if a preferences is not retrieved")
    void testGetPreferencesByUuidErrorNotFound() {
        given(preferencesRepository.findPreferenceByUserId(any())).willReturn(Optional.empty());

        final Either<ErrorResponseMessage, List<PreferenceDto>> result = preferenceService.getPreferencesByUserId(UUID.randomUUID());

        assertTrue(result.isLeft());
        assertEquals(404, result.getLeft().getCode());
        assertEquals(NO_PREFERENCES_FOUND, result.getLeft().getMessage());
    }

    @Test
    @DisplayName("Should return a 204 response code when given preferences are deleted")
    void testDeletePreferences() {
        final PreferenceDto preferenceDto = PreferenceDto.builder()
                .id(PREFERENCE_ID)
                .userId(USER_UUID)
                .articleId(null)
                .coinId(null)
                .build();

        final List<PreferenceDto> preferenceDtoList = new ArrayList<>();
        preferenceDtoList.add(preferenceDto);

        final Optional<ErrorResponseMessage> result = preferenceService.deletePreferences(preferenceDtoList);

        assertTrue(result.isEmpty());
    }

    @Test
    @DisplayName("Should return a 400 bad request response code when there an empty id or name in user given")
    void testDeletePreferencesNoIdNoUserId() {
        final PreferenceDto preferenceDto = PreferenceDto.builder()
                .id(null)
                .userId(null)
                .articleId(null)
                .coinId(null)
                .build();

        final List<PreferenceDto> preferenceDtoList = new ArrayList<>();
        preferenceDtoList.add(preferenceDto);

        final Optional<ErrorResponseMessage> result = preferenceService.deletePreferences(preferenceDtoList);

        assertEquals(400, result.get().getCode());
    }

}
