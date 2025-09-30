package com.project.pms.departmentservice.repository;

import com.project.pms.departmentservice.entity.Department;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
}