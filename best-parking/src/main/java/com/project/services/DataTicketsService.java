package com.project.services;

import com.project.models.Ticket;
import com.project.repositories.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.WeekFields;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DataTicketsService {

    private final TicketRepository ticketRepository;

    // Ingresos diarios entre dos fechas
    public Map<LocalDate, Double> getIngresosDiarios(LocalDate start, LocalDate end) {
        List<Ticket> tickets = ticketRepository.findByEntryTimeBetween(start.atStartOfDay(), end.atTime(23, 59));

        return tickets.stream()
                .filter(t -> t.getEntryTime() != null)
                .collect(Collectors.groupingBy(
                        t -> t.getEntryTime().toLocalDate(),
                        Collectors.summingDouble(t -> t.getTotalAmount() != null ? t.getTotalAmount() : 0.0)
                ));
    }
    // Ingresos semanales de un mes
    public Map<Integer, Double> getIngresosSemanales(int mes, int año) {
        List<Ticket> tickets = ticketRepository.findByEntryTimeMonthYear(mes, año);

        WeekFields weekFields = WeekFields.of(Locale.getDefault());

        Map<Integer, Double> ingresosPorSemana = tickets.stream()
                .collect(Collectors.groupingBy(
                        t -> t.getEntryTime().get(weekFields.weekOfWeekBasedYear()),
                        TreeMap::new,
                        Collectors.summingDouble(Ticket::getTotalAmount)
                ));

        return ingresosPorSemana;
    }

    // Ingresos mensuales de un año
    public Map<Integer, Double> getIngresosMensuales(int año) {
        List<Ticket> tickets = ticketRepository.findByEntryTimeYear(año);

        Map<Integer, Double> ingresosPorMes = tickets.stream()
                .collect(Collectors.groupingBy(
                        t -> t.getEntryTime().getMonthValue(),
                        TreeMap::new,
                        Collectors.summingDouble(Ticket::getTotalAmount)
                ));

        return ingresosPorMes;
    }

    // Ingresos anuales
    public Map<Integer, Double> getIngresosAnuales() {
        List<Ticket> tickets = ticketRepository.findAll();

        Map<Integer, Double> ingresosPorAño = tickets.stream()
                .collect(Collectors.groupingBy(
                        t -> t.getEntryTime().getYear(),
                        TreeMap::new,
                        Collectors.summingDouble(Ticket::getTotalAmount)
                ));

        return ingresosPorAño;
    }
}
