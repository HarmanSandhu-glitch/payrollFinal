package com.project.pms.employeeservice.entity;

import java.util.Date;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "employees")
@Data
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long employeeId;

    @NotBlank(message = "Employee name cannot be blank")
    @Column(nullable = false)
    private String employeeName;

    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Invalid email format")
    @Column(nullable = false, unique = true)
    private String employeeEmail;

    @NotNull(message = "Join date is required")
    @Temporal(TemporalType.DATE)
    @Column(nullable = false)
    private Date employeeJoinDate;

    @Column(nullable = false)
    private Long positionId;

    @Column(nullable = false)
    private Long departmentId;
}