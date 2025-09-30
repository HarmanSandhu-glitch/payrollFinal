package com.project.pms.payrollservice.controller;

import com.project.pms.payrollservice.entity.Payroll;
import com.project.pms.payrollservice.service.PayrollService;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payroll")
public class PayrollController {

    @Autowired
    private PayrollService payrollService;

    @PostMapping("/generate/{employeeId}")
    public ResponseEntity<Payroll> generatePayroll(@PathVariable Long employeeId, @RequestBody(required = false) Map<String, Double> payload) {
        try {
            Payroll savedPayroll = payrollService.generatePayroll(employeeId, payload);
            return ResponseEntity.ok(savedPayroll);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<Payroll>> getPayrollsForEmployee(@PathVariable Long employeeId) {
        List<Payroll> payrolls = payrollService.getPayrollsForEmployee(employeeId);
        return ResponseEntity.ok(payrolls);
    }
}