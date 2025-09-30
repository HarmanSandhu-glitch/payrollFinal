package com.project.pms.leaveservice.service;

import com.project.pms.leaveservice.entity.Leave;
import com.project.pms.leaveservice.repository.LeaveRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class LeaveService {

    @Autowired
    private LeaveRepository leaveRepository;

    public Leave applyForLeave(Long employeeId, Leave leave) {
        leave.setEmployeeId(employeeId);
        return leaveRepository.save(leave);
    }

    public Leave updateLeaveStatus(Long leaveId, Leave.LeaveStatus status) {
        Leave leave = leaveRepository.findById(leaveId)
                .orElseThrow(() -> new RuntimeException("Leave record not found"));
        leave.setStatus(status);
        return leaveRepository.save(leave);
    }

    public List<Leave> getLeavesForEmployee(Long employeeId) {
        return leaveRepository.findByEmployeeId(employeeId);
    }

    public List<Leave> getAllLeaveRequests() {
        return leaveRepository.findAll();
    }
}