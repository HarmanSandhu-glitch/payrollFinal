package com.project.pms.payrollservice.dto;


import lombok.Data;
@Data
public class Position {
    private Long positionId;
    private String positionTitle;
    private Double positionExperienceBonus;
    private Double positionBaseSalary;
}