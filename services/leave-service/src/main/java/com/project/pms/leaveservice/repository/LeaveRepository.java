package com.project.pms.leaveservice.repository;

import com.project.pms.leaveservice.entity.Leave;
import java.util.List;


@Repository
public interface LeaveRepository extends JpaRepository<Leave, Long> {
    List<Leave> findByEmployeeId(Long employeeId);
}