package com.eventbooking.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class EventDto {
    private Long id;

    @NotBlank
    private String title;

    private String description;

    @NotNull
    private LocalDate date;

    @NotNull
    private LocalTime time;

    @NotBlank
    private String venue;

    @NotNull
    private BigDecimal price;

    private int totalSeats;
    private int availableSeats;
}
