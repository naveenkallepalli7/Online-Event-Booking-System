package com.eventbooking.util;

import com.eventbooking.model.Event;
import com.eventbooking.model.Role;
import com.eventbooking.model.Seat;
import com.eventbooking.model.SeatStatus;
import com.eventbooking.model.User;
import com.eventbooking.repository.EventRepository;
import com.eventbooking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            User admin = User.builder()
                    .name("Admin User")
                    .email("admin@eventify.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ROLE_ADMIN)
                    .build();
            userRepository.save(admin);

            User user = User.builder()
                    .name("Test User")
                    .email("user@eventify.com")
                    .password(passwordEncoder.encode("user123"))
                    .role(Role.ROLE_USER)
                    .build();
            userRepository.save(user);

            Event event1 = Event.builder()
                    .title("Tech Conference 2026")
                    .description("The biggest tech conference of the year.")
                    .date(LocalDate.now().plusDays(10))
                    .time(LocalTime.of(9, 0))
                    .venue("Silicon Valley Center")
                    .price(new BigDecimal("199.99"))
                    .seats(new ArrayList<>())
                    .build();
                    
            for (int i = 1; i <= 20; i++) {
                event1.getSeats().add(Seat.builder().event(event1).seatNumber("A" + i).status(SeatStatus.AVAILABLE).build());
            }
            eventRepository.save(event1);

            Event event2 = Event.builder()
                    .title("Music Festival Summer")
                    .description("Live music, food, and fun!")
                    .date(LocalDate.now().plusDays(30))
                    .time(LocalTime.of(16, 0))
                    .venue("Central Park")
                    .price(new BigDecimal("50.00"))
                    .seats(new ArrayList<>())
                    .build();
                    
            for (int i = 1; i <= 50; i++) {
                event2.getSeats().add(Seat.builder().event(event2).seatNumber("G" + i).status(SeatStatus.AVAILABLE).build());
            }
            eventRepository.save(event2);
        }
    }
}
