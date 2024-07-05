package com.epitech.cryptoProject.controllers;

import com.epitech.cryptoProject.dtos.ErrorResponseMessage;
import com.epitech.cryptoProject.dtos.PreferenceDto;
import com.epitech.cryptoProject.services.PreferenceService;
import com.epitech.cryptoProject.utils.ResponseWrapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/preferences")
public class PreferenceController {

    private final PreferenceService preferenceService;

    public PreferenceController(PreferenceService preferenceService) {
        this.preferenceService = preferenceService;
    }

    @PostMapping
    @Operation(description = "Save preferences in database")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Preferences successfully saved in database"),
            @ApiResponse(responseCode = "500",
                    description = "An error occurred. for the given parameters, Please check the body return for further information.",
                    content = @Content(schema = @Schema(implementation = ErrorResponseMessage.class))
            )
    })
    public ResponseEntity<List<PreferenceDto>> savePreference(
            @Valid @RequestBody List<PreferenceDto> preferenceDtoList) {

        return (ResponseEntity<List<PreferenceDto>>) ResponseWrapper.matchEitherOnPost(preferenceService.savePreferences(preferenceDtoList));
    }

    @GetMapping
    @Operation(description = "Get all preferences")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Preferences successfully retrieved"),
            @ApiResponse(responseCode = "500",
                    description = "An error occurred. for the given parameters, Please check the body return for further information.",
                    content = @Content(schema = @Schema(implementation = ErrorResponseMessage.class))
            )
    })
    public ResponseEntity<List<PreferenceDto>> getArticles(
        @RequestHeader("Authorization") String authorization
    ) {

        return (ResponseEntity<List<PreferenceDto>>) ResponseWrapper.matchEitherOnGetOrPatch(preferenceService.getAllPreferences(authorization));
    }

    @GetMapping("/{user_id}")
    @Operation(description = "Get references by User Id")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Reference successfully retrieved"),
            @ApiResponse(responseCode = "500",
                    description = "An error occurred. for the given parameters, Please check the body return for further information.",
                    content = @Content(schema = @Schema(implementation = ErrorResponseMessage.class))
            )
    })
    public ResponseEntity<List<PreferenceDto>> getReferenceById(
            @PathVariable("user_id") @Parameter(required = true, name = "user_id", description = "User id",
                    example = "1234") UUID userId) {

        return (ResponseEntity<List<PreferenceDto>>) ResponseWrapper.matchEitherOnGetOrPatch(preferenceService.getPreferencesByUserId(userId));
    }

    @DeleteMapping
    @Operation(description = "Delete preferences in database")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Preferences successfully deleted in database"),
            @ApiResponse(responseCode = "500",
                    description = "An error occurred. for the given parameters, Please check the body return for further information.",
                    content = @Content(schema = @Schema(implementation = ErrorResponseMessage.class))
            )
    })
    public ResponseEntity<?> deleteArticles(
            @Valid @RequestBody List<PreferenceDto> preferencesDtoList) {

        return ResponseWrapper.matchOptionalOnDelete(preferenceService.deletePreferences(preferencesDtoList));
    }

}
