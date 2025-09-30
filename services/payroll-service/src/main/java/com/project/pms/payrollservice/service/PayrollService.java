package com.project.pms.payrollservice.service;

import com.project.pms.payrollservice.dto.Employee;
import com.project.pms.payrollservice.dto.Position;
import com.project.pms.payrollservice.entity.Payroll;
import com.project.pms.payrollservice.repository.PayrollRepository;
import java.util.Date;
import java.util.List;
import java.util.Map;


@Service
public class PayrollService {

    @Autowired
    private PayrollRepository payrollRepository;

    @Autowired
    private RestTemplate restTemplate;

    public Payroll generatePayroll(Long employeeId, Map<String, Double> payload) {
        Employee employee = restTemplate.getForObject("http://employee-service/api/employees/" + employeeId, Employee.class);
        if (employee == null) {
            throw new RuntimeException("Employee not found");
        }

        Position position = restTemplate.getForObject("http://department-service/api/positions/" + employee.getPositionId(), Position.class);
        if (position == null) {
            throw new RuntimeException("Position not found");
        }

        Double initialDeductions = (payload != null) ? payload.getOrDefault("deductions", 0.0) : 0.0;

        Double baseSalary = position.getPositionBaseSalary();
        Double experienceBonus = position.getPositionExperienceBonus();
        Double grossPay = baseSalary + experienceBonus;
        Double taxDeductions = calculateTax(grossPay);
        Double totalDeductions = initialDeductions + taxDeductions;
        Double totalPay = grossPay - totalDeductions;

        Payroll payroll = new Payroll();
        payroll.setEmployeeId(employeeId);
        payroll.setPayrollPayDate(new Date());
        payroll.setPayrollBaseSalary(baseSalary);
        payroll.setPayrollExperienceBonus(experienceBonus);
        payroll.setPayrollDeductions(totalDeductions);
        payroll.setPayrollTotalPay(totalPay);

        return payrollRepository.save(payroll);
    }

    public List<Payroll> getPayrollsForEmployee(Long employeeId) {
        return payrollRepository.findByEmployeeId(employeeId);
    }

    private Double calculateTax(Double grossPay) {
        if (grossPay > 2400000) return grossPay * 0.30;
        if (grossPay > 2000000) return grossPay * 0.25;
        if (grossPay > 1600000) return grossPay * 0.20;
        if (grossPay > 1200000) return grossPay * 0.15;
        if (grossPay > 800000) return grossPay * 0.10;
        if (grossPay > 400000) return grossPay * 0.05;
        return 0.0;
    }
}