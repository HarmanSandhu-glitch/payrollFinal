# APC Payroll Management System

A comprehensive Spring Cloud microservices-based payroll management system with Netflix Eureka service discovery, Spring Cloud Gateway, and a web frontend.

## Architecture Overview

- **Spring Boot 3.1.5** with **Java 17**
- **Netflix Eureka** service discovery (port 8761)
- **Spring Cloud Gateway** API gateway with load balancing (port 8080)
- **5 Microservices**: employee, department, payroll, attendance, leave (ports 8081-8085)
- **MariaDB** databases per service
- **Vanilla HTML/CSS/JS** frontend served from gateway

## Prerequisites

- **Java 17+** installed
- **Maven 3.6+** installed
- **MariaDB** server running on localhost:3306
- Database user: `root`, password: `harman`

## Database Setup

Create the following databases in MariaDB:
```sql
CREATE DATABASE employee_db;
CREATE DATABASE department_db;
CREATE DATABASE payroll_db;
CREATE DATABASE attendance_db;
CREATE DATABASE leave_db;
```

## Quick Start

### 1. Build the Project
```bash
mvn clean package -DskipTests
```

### 2. Start Services
```bash
./start-services.sh
```

### 3. Access the Application
- **Frontend**: http://localhost:8080
- **Eureka Dashboard**: http://localhost:8761

### 4. Stop Services
```bash
./stop-services.sh
```

## Manual Service Startup (Alternative)

If you prefer to start services manually:

1. **Start Discovery Service first:**
   ```bash
   cd discovery-service
   java -jar target/discovery-service-0.0.1-SNAPSHOT.jar
   ```

2. **Start individual microservices:**
   ```bash
   # Employee Service (Port 8081)
   cd services/employee-service
   java -jar target/employee-service-0.0.1-SNAPSHOT.jar

   # Department Service (Port 8082)
   cd services/department-service
   java -jar target/department-service-0.0.1-SNAPSHOT.jar

   # Payroll Service (Port 8083)
   cd services/payroll-service
   java -jar target/payroll-service-0.0.1-SNAPSHOT.jar

   # Attendance Service (Port 8084)
   cd services/attendance-service
   java -jar target/attendance-service-0.0.1-SNAPSHOT.jar

   # Leave Service (Port 8085)
   cd services/leave-service
   java -jar target/leave-service-0.0.1-SNAPSHOT.jar
   ```

3. **Start API Gateway last:**
   ```bash
   cd api-gateway
   java -jar target/api-gateway-0.0.1-SNAPSHOT.jar
   ```

## Service Endpoints

- **Discovery Service**: http://localhost:8761
- **API Gateway**: http://localhost:8080
- **Employee Service**: http://localhost:8081/api/employees
- **Department Service**: http://localhost:8082/api/departments, /api/positions
- **Payroll Service**: http://localhost:8083/api/payroll
- **Attendance Service**: http://localhost:8084/api/attendance
- **Leave Service**: http://localhost:8085/api/leaves

## Frontend Features

The web interface provides full CRUD operations for:
- **Employee Management**: Add, edit, delete employees
- **Department Management**: Manage departments and positions
- **Payroll Processing**: Generate payroll for employees
- **Attendance Tracking**: Check-in/check-out functionality
- **Leave Management**: Submit and manage leave requests

## API Examples

### Employee Operations
```bash
# Get all employees
curl http://localhost:8080/api/employees

# Create employee
curl -X POST http://localhost:8080/api/employees \
  -H "Content-Type: application/json" \
  -d '{"employeeName":"John Doe","employeeEmail":"john@example.com","employeeJoinDate":"2023-01-01","departmentId":1,"positionId":1}'
```

### Department Operations
```bash
# Get all departments
curl http://localhost:8080/api/departments

# Get all positions
curl http://localhost:8080/api/positions
```

### Payroll Operations
```bash
# Generate payroll for employee
curl -X POST http://localhost:8080/api/payroll/generate/1
```

### Attendance Operations
```bash
# Check-in
curl -X POST http://localhost:8080/api/attendance/checkin/1

# Check-out
curl -X POST http://localhost:8080/api/attendance/checkout/1
```

## Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 8080, 8761, 8081-8085 are available
2. **Database connection**: Verify MariaDB is running and databases exist
3. **Service discovery**: Wait for services to register with Eureka (may take 30-60 seconds)

### Logs
Service logs are stored in respective `logs/` directories when using startup scripts.

### Health Checks
- Check Eureka dashboard at http://localhost:8761 to verify service registration
- Individual service health: http://localhost:808X/actuator/health (if actuator enabled)

## Development

### Project Structure
```
apc/
├── api-gateway/              # Spring Cloud Gateway
├── discovery-service/        # Netflix Eureka Server
├── services/
│   ├── employee-service/     # Employee management
│   ├── department-service/   # Department & Position management
│   ├── payroll-service/      # Payroll processing
│   ├── attendance-service/   # Attendance tracking
│   └── leave-service/        # Leave management
├── start-services.sh         # Service startup script
├── stop-services.sh          # Service stop script
└── pom.xml                   # Root POM
```

### Building Individual Services
```bash
cd services/employee-service
mvn clean package
```

### Adding New Features
1. Follow the existing service patterns
2. Register new services with Eureka using `@EnableEurekaClient`
3. Add routes to `api-gateway/application.properties`
4. Update frontend navigation in HTML files

## Technologies Used

- **Spring Boot 3.1.5**
- **Spring Cloud 2022.0.4**
- **Netflix Eureka** - Service Discovery
- **Spring Cloud Gateway** - API Gateway
- **Spring Data JPA** - Data Access
- **MariaDB** - Database
- **Lombok** - Code Generation
- **Jakarta Validation** - Bean Validation
- **Maven** - Build Tool

## License

This project is for educational purposes.