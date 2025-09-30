package com.project.pms.payrollservice.entity;

import java.util.Date;

@Entity
@Table(name = "payrolls")
@Data
public class Payroll {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long payrollId;

    @Column(nullable = false)
    private Long employeeId;

    @Temporal(TemporalType.DATE)
    @Column(nullable = false)
    private Date payrollPayDate;

    @Column(nullable = false)
    private Double payrollBaseSalary;

    @Column(nullable = false)
    private Double payrollExperienceBonus;

    @Column(nullable = false)
    private Double payrollDeductions;

    @Column(nullable = false)
    private Double payrollTotalPay;
}