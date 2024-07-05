package com.epitech.cryptoProject.data;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "preferences")
public class Preference implements Serializable {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name = "id", updatable = false, nullable = false)
    private int id;

    private UUID userId;
    private Integer articleId;
    private Integer coinId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
