package com.project.repositories;

import com.project.models.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    Optional<Ticket> findByIdAndStatus(Long id, TicketStatus status);
    Optional<Ticket> findByVehicleAndStatus(Vehicle vehicle, TicketStatus status);
    List<Ticket> findByStatus(TicketStatus status);
    Optional <Ticket> findById(Long id);

    // Tickets entre fechas (para ingresos diarios)
    List<Ticket> findByEntryTimeBetween(LocalDateTime start, LocalDateTime end);

    // Tickets de un mes específico (para ingresos semanales)
    @Query("SELECT t FROM Ticket t WHERE YEAR(t.entryTime) = :year AND MONTH(t.entryTime) = :month")
    List<Ticket> findByEntryTimeMonthYear(@Param("month") int month, @Param("year") int year);

    // Tickets de un año específico (para ingresos mensuales o anuales)
    @Query("SELECT t FROM Ticket t WHERE YEAR(t.entryTime) = :year")
    List<Ticket> findByEntryTimeYear(@Param("year") int year);
}
