package com.project.pms.employeeservice.repository;

import com.project.pms.employeeservice.entity.Employee;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
}