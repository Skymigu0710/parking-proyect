package com.project.services;

import com.project.dto.AbonadoRequest;
import com.project.models.Abonado;
import com.project.repositories.AbonadoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AbonadoService {

    private final AbonadoRepository abonado_r;


    public Abonado createAbonado(AbonadoRequest dto) {
        Abonado abonado = Abonado.builder()
                .nombre(dto.getNombre())
                .placa(dto.getPlaca())
                .celular(dto.getCelular())
                .build();
    Abonado saved = abonado_r.save(abonado);
        return Abonado.builder()
                .id(saved.getId())
                .nombre(saved.getNombre())
                .placa(saved.getPlaca())
                .celular(saved.getCelular())
                .afiliaciones(saved.getAfiliaciones())
                .build();
    }

    public Abonado getAbonadoById(Long id) {
        Abonado abonado = abonado_r.findById(id)
                .orElseThrow(() -> new RuntimeException("Abonado no encontrado"));

        return Abonado.builder()
                .id(abonado.getId())
                .nombre(abonado.getNombre())
                .placa(abonado.getPlaca())
                .celular(abonado.getCelular())
                .afiliaciones(abonado.getAfiliaciones())
                .build();
    }

    public List<AbonadoRequest> getAllAbonados() {
        return abonado_r.findAll()
                .stream()
                .map(t -> AbonadoRequest.builder()
                        .id(t.getId())
                        .nombre(t.getNombre())
                        .placa(t.getPlaca())
                        .celular(t.getCelular())
                        .afiliaciones(t.getAfiliaciones())
                        .build())
                .collect(Collectors.toList());
    }

    public AbonadoRequest updateAbonado(Long id, AbonadoRequest updateAbonado) {

        Abonado abonado = abonado_r.findById(id)
                .orElseThrow(() -> new RuntimeException("No existe abonado con el id: " + id));

        abonado.setNombre(updateAbonado.getNombre());
        abonado.setPlaca(updateAbonado.getPlaca());
        abonado.setCelular(updateAbonado.getCelular());

        Abonado saved = abonado_r.save(abonado);

        return AbonadoRequest.builder()
                .id(saved.getId())
                .nombre(saved.getNombre())
                .placa(saved.getPlaca())
                .celular(saved.getCelular())
                .build();
    }

    public void deleteAbonado(Long id) {
        Abonado abonado=abonado_r.findById(id).orElseThrow(
                ()->new RuntimeException("No existe el abonado con id: "+id));
        abonado_r.deleteById(id);
    }
}
