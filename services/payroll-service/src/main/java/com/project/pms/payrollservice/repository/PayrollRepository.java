package com.project.pms.payrollservice.repository;

import com.project.pms.payrollservice.entity.Payroll;
import java.util.List;


@Repository
public interface PayrollRepository extends JpaRepository<Payroll, Long> {
    List<Payroll> findByEmployeeId(Long employeeId);
}