package com.project.pms.departmentservice.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "positions")
@Data
public class Position {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long positionId;

    @Column(nullable = false)
    private String positionTitle;

    @Column(nullable = false)
    private Double positionExperienceBonus = 0.0;

    @Column(nullable = false)
    private Double positionBaseSalary = 0.0;
}