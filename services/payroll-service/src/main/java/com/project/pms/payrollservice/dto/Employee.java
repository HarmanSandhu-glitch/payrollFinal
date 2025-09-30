package com.project.pms.payrollservice.dto;

import java.util.Date;
import lombok.Data;

@Data
public class Employee {
    private Long employeeId;
    private String employeeName;
    private String employeeEmail;
    private Date employeeJoinDate;
    private Long positionId;
    private Long departmentId;
}