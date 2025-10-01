/**
 * APC Payroll Management System - Frontend JavaScript Module
 * Modern Material Design Implementation with Modular Architecture
 */

// =============================================================================
// UTILITY FUNCTIONS & HELPERS
// =============================================================================

/**
 * Utility class for common operations
 */
class Utils {
    /**
     * Format date to locale string
     * @param {string|Date} date - The date to format
     * @returns {string} Formatted date string
     */
    static formatDate(date) {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    /**
     * Show Material Design style notification
     * @param {string} message - Message to display
     * @param {string} type - Type of notification (success, error, info)
     */
    static showNotification(message, type = 'info') {
        // Remove existing notifications
        const existing = document.querySelector('.md-snackbar');
        if (existing) existing.remove();

        const snackbar = document.createElement('div');
        snackbar.className = `md-snackbar md-snackbar-${type}`;
        snackbar.innerHTML = `
            <div class="md-snackbar-content">
                <span class="material-icons">${type === 'error' ? 'error' : type === 'success' ? 'check_circle' : 'info'}</span>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(snackbar);
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            if (snackbar.parentNode) {
                snackbar.remove();
            }
        }, 4000);
    }

    /**
     * Create Material Design button with icon
     * @param {string} text - Button text
     * @param {string} icon - Material icon name
     * @param {string} variant - Button variant (filled, outlined, text)
     * @param {Function} onclick - Click handler
     * @returns {HTMLButtonElement} Button element
     */
    static createButton(text, icon, variant = 'filled', onclick = null) {
        const button = document.createElement('button');
        button.className = `md-button md-button-${variant}`;
        button.innerHTML = `
            <span class="material-icons" style="font-size: 18px;">${icon}</span>
            ${text}
        `;
        if (onclick) button.onclick = onclick;
        return button;
    }

    /**
     * Enhanced fetch with error handling
     * @param {string} url - Request URL
     * @param {Object} options - Fetch options
     * @returns {Promise} Fetch promise with error handling
     */
    static async apiRequest(url, options = {}) {
        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            Utils.showNotification(`Request failed: ${error.message}`, 'error');
            throw error;
        }
    }
}

// Add Material Design snackbar styles if not present
if (!document.querySelector('#md-snackbar-styles')) {
    const style = document.createElement('style');
    style.id = 'md-snackbar-styles';
    style.textContent = `
        .md-snackbar {
            position: fixed;
            bottom: 24px;
            left: 50%;
            transform: translateX(-50%);
            background-color: var(--md-sys-color-surface-variant);
            color: var(--md-sys-color-on-surface-variant);
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: var(--md-elevation-3);
            z-index: 10000;
            animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            max-width: 400px;
        }
        
        .md-snackbar-success {
            background-color: var(--md-sys-color-secondary);
            color: var(--md-sys-color-on-secondary);
        }
        
        .md-snackbar-error {
            background-color: var(--md-sys-color-error);
            color: var(--md-sys-color-on-primary);
        }
        
        .md-snackbar-content {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 0.875rem;
            font-weight: 500;
        }
        
        @keyframes slideUp {
            from {
                transform: translateX(-50%) translateY(100%);
                opacity: 0;
            }
            to {
                transform: translateX(-50%) translateY(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
}

// =============================================================================
// EMPLOYEE MANAGEMENT MODULE
// =============================================================================

/**
 * Employee management functionality
 */
class EmployeeManager {
    /**
     * Load and display all employees
     */
    static async loadEmployees() {
        try {
            const employees = await Utils.apiRequest('/api/employees');
            const tableBody = document.querySelector('#employeesTable tbody');
            
            if (!tableBody) return;
            
            tableBody.innerHTML = '';
            employees.forEach(employee => {
                const row = tableBody.insertRow();
                row.insertCell(0).textContent = employee.employeeId;
                row.insertCell(1).textContent = employee.employeeName;
                row.insertCell(2).textContent = employee.employeeEmail;
                row.insertCell(3).textContent = Utils.formatDate(employee.employeeJoinDate);
                
                const actionsCell = row.insertCell(4);
                actionsCell.style.display = 'flex';
                actionsCell.style.gap = '8px';
                
                const editBtn = Utils.createButton('Edit', 'edit', 'text', 
                    () => EmployeeManager.editEmployee(employee.employeeId));
                const deleteBtn = Utils.createButton('Delete', 'delete', 'text', 
                    () => EmployeeManager.deleteEmployee(employee.employeeId));
                deleteBtn.classList.add('md-button-error');
                
                actionsCell.appendChild(editBtn);
                actionsCell.appendChild(deleteBtn);
            });
            
            Utils.showNotification(`Loaded ${employees.length} employees`, 'success');
        } catch (error) {
            console.error('Error loading employees:', error);
        }
    }
}

// Legacy function for backward compatibility
function loadEmployees() {
    fetch('/api/employees')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('employeesTable').getElementsByTagName('tbody')[0];
            tableBody.innerHTML = '';
            data.forEach(employee => {
                let row = tableBody.insertRow();
                row.insertCell(0).innerHTML = employee.employeeId;
                row.insertCell(1).innerHTML = employee.employeeName;
                row.insertCell(2).innerHTML = employee.employeeEmail;
                row.insertCell(3).innerHTML = new Date(employee.employeeJoinDate).toLocaleDateString();
                row.insertCell(4).innerHTML = `
                    <button onclick="editEmployee(${employee.employeeId})">Edit</button>
                    <button onclick="deleteEmployee(${employee.employeeId})">Delete</button>
                `;
            });
        });
}

function showAddEmployeeForm() {
    document.getElementById('employeeForm').style.display = 'block';
}

function hideEmployeeForm() {
    document.getElementById('employeeForm').style.display = 'none';
    document.getElementById('employeeId').value = '';
    document.getElementById('employeeName').value = '';
    document.getElementById('employeeEmail').value = '';
    document.getElementById('employeeJoinDate').value = '';
}

function submitEmployeeForm(event) {
    event.preventDefault();
    const employeeId = document.getElementById('employeeId').value;
    const employee = {
        employeeName: document.getElementById('employeeName').value,
        employeeEmail: document.getElementById('employeeEmail').value,
        employeeJoinDate: document.getElementById('employeeJoinDate').value,
        departmentId: document.getElementById('employeeDepartment').value,
        positionId: document.getElementById('employeePosition').value
    };

    const method = employeeId ? 'PUT' : 'POST';
    const url = employeeId ? `/api/employees/${employeeId}` : '/api/employees';

    fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employee)
    }).then(() => {
        hideEmployeeForm();
        loadEmployees();
    });
}

function editEmployee(id) {
    fetch(`/api/employees/${id}`)
        .then(response => response.json())
        .then(employee => {
            document.getElementById('employeeId').value = employee.employeeId;
            document.getElementById('employeeName').value = employee.employeeName;
            document.getElementById('employeeEmail').value = employee.employeeEmail;
            document.getElementById('employeeJoinDate').value = new Date(employee.employeeJoinDate).toISOString().split('T')[0];
            document.getElementById('employeeDepartment').value = employee.departmentId;
            document.getElementById('employeePosition').value = employee.positionId;
            showAddEmployeeForm();
        });
}

function deleteEmployee(id) {
    if (confirm('Are you sure you want to delete this employee?')) {
        fetch(`/api/employees/${id}`, { method: 'DELETE' })
            .then(() => {
                loadEmployees();
            });
    }
}


// Department Management
function loadDepartments() {
    fetch('/api/departments')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('departmentsTable').getElementsByTagName('tbody')[0];
            tableBody.innerHTML = '';
            data.forEach(department => {
                let row = tableBody.insertRow();
                row.insertCell(0).innerHTML = department.departmentId;
                row.insertCell(1).innerHTML = department.departmentName;
                row.insertCell(2).innerHTML = `
                    <button onclick="editDepartment(${department.departmentId})">Edit</button>
                    <button onclick="deleteDepartment(${department.departmentId})">Delete</button>
                `;
            });
        });
}

function showAddDepartmentForm() {
    document.getElementById('departmentForm').style.display = 'block';
}

function hideDepartmentForm() {
    document.getElementById('departmentForm').style.display = 'none';
    document.getElementById('departmentId').value = '';
    document.getElementById('departmentName').value = '';
}

function submitDepartmentForm(event) {
    event.preventDefault();
    const departmentId = document.getElementById('departmentId').value;
    const department = { departmentName: document.getElementById('departmentName').value };

    const method = departmentId ? 'PUT' : 'POST';
    const url = departmentId ? `/api/departments/${departmentId}` : '/api/departments';

    fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(department)
    }).then(() => {
        hideDepartmentForm();
        loadDepartments();
    });
}

function editDepartment(id) {
    fetch(`/api/departments/${id}`)
        .then(response => response.json())
        .then(department => {
            document.getElementById('departmentId').value = department.departmentId;
            document.getElementById('departmentName').value = department.departmentName;
            showAddDepartmentForm();
        });
}

function deleteDepartment(id) {
    if (confirm('Are you sure you want to delete this department?')) {
        fetch(`/api/departments/${id}`, { method: 'DELETE' })
            .then(() => {
                loadDepartments();
            });
    }
}

// Position Management
function loadPositions() {
    fetch('/api/positions')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('positionsTable').getElementsByTagName('tbody')[0];
            tableBody.innerHTML = '';
            data.forEach(position => {
                let row = tableBody.insertRow();
                row.insertCell(0).innerHTML = position.positionId;
                row.insertCell(1).innerHTML = position.positionTitle;
                row.insertCell(2).innerHTML = position.positionBaseSalary;
                row.insertCell(3).innerHTML = position.positionExperienceBonus;
                row.insertCell(4).innerHTML = `
                    <button onclick="editPosition(${position.positionId})">Edit</button>
                    <button onclick="deletePosition(${position.positionId})">Delete</button>
                `;
            });
        });
}

function showAddPositionForm() {
    document.getElementById('positionForm').style.display = 'block';
}

function hidePositionForm() {
    document.getElementById('positionForm').style.display = 'none';
    document.getElementById('positionId').value = '';
    document.getElementById('positionTitle').value = '';
    document.getElementById('positionBaseSalary').value = '';
    document.getElementById('positionExperienceBonus').value = '';
}

function submitPositionForm(event) {
    event.preventDefault();
    const positionId = document.getElementById('positionId').value;
    const position = {
        positionTitle: document.getElementById('positionTitle').value,
        positionBaseSalary: document.getElementById('positionBaseSalary').value,
        positionExperienceBonus: document.getElementById('positionExperienceBonus').value
    };

    const method = positionId ? 'PUT' : 'POST';
    const url = positionId ? `/api/positions/${positionId}` : '/api/positions';

    fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(position)
    }).then(() => {
        hidePositionForm();
        loadPositions();
    });
}

function editPosition(id) {
    fetch(`/api/positions/${id}`)
        .then(response => response.json())
        .then(position => {
            document.getElementById('positionId').value = position.positionId;
            document.getElementById('positionTitle').value = position.positionTitle;
            document.getElementById('positionBaseSalary').value = position.positionBaseSalary;
            document.getElementById('positionExperienceBonus').value = position.positionExperienceBonus;
            showAddPositionForm();
        });
}

function deletePosition(id) {
    if (confirm('Are you sure you want to delete this position?')) {
        fetch(`/api/positions/${id}`, { method: 'DELETE' })
            .then(() => {
                loadPositions();
            });
    }
}

// Payroll Management
function generatePayroll(event) {
    event.preventDefault();
    const employeeId = document.getElementById('payrollEmployeeId').value;
    let deductions = document.getElementById('deductions').value;

    // If deductions is empty or not a valid number, default to 0
    if (deductions === '' || isNaN(parseFloat(deductions))) {
        deductions = 0;
    }

    const payload = { deductions: parseFloat(deductions) };

    fetch(`/api/payroll/generate/${employeeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    }).then(response => {
        if (response.ok) {
            alert('Payroll generated successfully!');
        } else {
            alert('Failed to generate payroll. Please check the console for more details.');
            console.error('Error generating payroll:', response);
        }
    });
}
function viewPayroll(event) {
    event.preventDefault();
    const employeeId = document.getElementById('viewPayrollEmployeeId').value;
    fetch(`/api/payroll/employee/${employeeId}`)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('payrollTable').getElementsByTagName('tbody')[0];
            tableBody.innerHTML = '';
            data.forEach(payroll => {
                let row = tableBody.insertRow();
                row.insertCell(0).innerHTML = payroll.payrollId;
                row.insertCell(1).innerHTML = new Date(payroll.payrollPayDate).toLocaleDateString();
                row.insertCell(2).innerHTML = payroll.payrollBaseSalary;
                row.insertCell(3).innerHTML = payroll.payrollExperienceBonus;
                row.insertCell(4).innerHTML = payroll.payrollDeductions;
                row.insertCell(5).innerHTML = payroll.payrollTotalPay;
            });
        });
}

// Dropdown Loaders
function loadDepartmentsDropdown() {
    fetch('/api/departments')
        .then(response => response.json())
        .then(data => {
            const select = document.getElementById('employeeDepartment');
            select.innerHTML = '';
            data.forEach(department => {
                const option = document.createElement('option');
                option.value = department.departmentId;
                option.text = department.departmentName;
                select.appendChild(option);
            });
        });
}

function loadPositionsDropdown() {
    fetch('/api/positions')
        .then(response => response.json())
        .then(data => {
            const select = document.getElementById('employeePosition');
            select.innerHTML = '';
            data.forEach(position => {
                const option = document.createElement('option');
                option.value = position.positionId;
                option.text = position.positionTitle;
                select.appendChild(option);
            });
        });
}

function loadEmployeesDropdown(selectId) {
    fetch('/api/employees')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch employees');
            }
            return response.json();
        })
        .then(data => {
            const select = document.getElementById(selectId);
            select.innerHTML = '<option value="">Select an employee...</option>';
            data.forEach(employee => {
                const option = document.createElement('option');
                option.value = employee.employeeId;
                option.text = employee.employeeName;
                select.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error loading employees:', error);
            const select = document.getElementById(selectId);
            select.innerHTML = '<option value="">Error loading employees</option>';
        });
}

// --- NEW FEATURES ---

// Attendance Management
function checkIn() {
    const employeeId = document.getElementById('attendanceEmployeeId').value;
    fetch(`/api/attendance/checkin/${employeeId}`, { method: 'POST' })
        .then(response => {
            if(response.ok) alert('Checked-in successfully!');
            else alert('Check-in failed!');
        });
}

function checkOut() {
    const employeeId = document.getElementById('attendanceEmployeeId').value;
    fetch(`/api/attendance/checkout/${employeeId}`, { method: 'POST' })
        .then(response => {
            if(response.ok) alert('Checked-out successfully!');
            else alert('Check-out failed!');
        });
}

// Leave Management
function applyForLeave(event) {
    event.preventDefault();
    const employeeId = document.getElementById('leaveEmployeeId').value;
    const leave = {
        startDate: document.getElementById('startDate').value,
        endDate: document.getElementById('endDate').value,
        reason: document.getElementById('reason').value
    };
    fetch(`/api/leaves/apply/${employeeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leave)
    }).then(() => {
        alert('Leave applied successfully!');
        loadAllLeaveRequests();
    });
}

function loadAllLeaveRequests() {
    fetch('/api/leaves')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            const tableBody = document.getElementById('leavesTable').getElementsByTagName('tbody')[0];
            tableBody.innerHTML = '';
            if (Array.isArray(data)) {
                data.forEach(leave => {
                    let row = tableBody.insertRow();
                    row.insertCell(0).innerHTML = `Employee ID: ${leave.employeeId}`;
                    row.insertCell(1).innerHTML = new Date(leave.startDate).toLocaleDateString();
                    row.insertCell(2).innerHTML = new Date(leave.endDate).toLocaleDateString();
                    row.insertCell(3).innerHTML = leave.reason;
                    row.insertCell(4).innerHTML = leave.status;
                    row.insertCell(5).innerHTML = `
                        <button onclick="updateLeaveStatus(${leave.leaveId}, 'APPROVED')">Approve</button>
                        <button onclick="updateLeaveStatus(${leave.leaveId}, 'REJECTED')">Reject</button>
                    `;
                });
            } else {
                console.error('Expected array but received:', data);
            }
        })
        .catch(error => {
            console.error('Error loading leave requests:', error);
            const tableBody = document.getElementById('leavesTable').getElementsByTagName('tbody')[0];
            tableBody.innerHTML = '<tr><td colspan="6">Error loading leave requests. Please try again.</td></tr>';
        });
}

function updateLeaveStatus(leaveId, status) {
    fetch(`/api/leaves/update/${leaveId}?status=${status}`, { method: 'PUT' })
        .then(() => {
            alert(`Leave ${status.toLowerCase()} successfully!`);
            loadAllLeaveRequests();
        });
}