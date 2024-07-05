package com.epitech.cryptoProject.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PreferenceDto {

    private Integer id;
    private UUID userId;
    private Integer articleId;
    private Integer coinId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
