# Payroll Management System (APC) - AI Agent Guide

## Architecture Overview
This is a **Spring Cloud microservices** architecture with:
- **Maven multi-module project** with 3-tier structure: root → services aggregator → individual services
- **Netflix Eureka** service discovery (port 8761)
- **Spring Cloud Gateway** API gateway (port 8080) with load balancing
- **5 microservices**: employee, department, payroll, attendance, leave (ports 8081+)
- **MariaDB** databases per service with `*_db` naming convention
- **Vanilla HTML/CSS/JS frontend** served from gateway's static resources

## Service Structure Pattern
Each microservice follows identical Spring Boot patterns:
```
com.project.pms.{service}service/
├── controller/{Entity}Controller.java - REST endpoints `/api/{entities}`
├── entity/{Entity}.java - JPA entities with validation annotations
├── repository/{Entity}Repository.java - Spring Data JPA interfaces
├── service/{Entity}Service.java - Business logic layer
└── {Service}ServiceApplication.java - Main class with @EnableEurekaClient
```

## Database Configuration
- **Connection**: `jdbc:mariadb://localhost:3306/{service}_db`
- **Credentials**: username=root, password=harman (hardcoded in all services)
- **JPA**: `ddl-auto=update`, `show-sql=true`
- **Entities use**: `@GeneratedValue(strategy = GenerationType.IDENTITY)` for PKs

## API Gateway Routes
Routes configured in `api-gateway/application.properties`:
- `/api/employees/**` → employee-service
- `/api/departments/**`, `/api/positions/**` → department-service  
- `/api/payroll/**` → payroll-service
- `/api/attendance/**` → attendance-service
- `/api/leaves/**` → leave-service

## Frontend Architecture
- **Location**: `api-gateway/target/classes/static/` (compiled resources)
- **Pattern**: Each HTML page manages one entity with shared `script.js`
- **Navigation**: Common header with links to all entity pages
- **API Calls**: Direct fetch to `/api/*` endpoints (proxied by gateway)
- **CRUD Pattern**: Load data → Show forms → Submit via fetch → Refresh tables

## Key Dependencies (Spring Boot 3.1.5, Java 17)
- `spring-cloud-starter-netflix-eureka-server` (discovery service)
- `spring-cloud-starter-netflix-eureka-client` (all other services)
- `spring-cloud-starter-gateway` (api-gateway)
- `spring-boot-starter-data-jpa` + `mariadb-java-client` (data services)
- `lombok` + `jakarta.validation-api` (all services)

## Development Workflow
1. **Start discovery-service** first (port 8761)
2. **Start individual services** (auto-register with Eureka)
3. **Start api-gateway** last (port 8080)
4. **Access frontend** at http://localhost:8080/

## Cross-Service Communication
- Services communicate via **Eureka service names** (e.g., `employee-service`)
- **Employee/Department/Position IDs** are referenced across services as foreign keys
- **Payroll service** fetches employee and position data via RestTemplate/WebClient calls

## Testing & Build
- **Maven**: Use `mvn clean install` from root for full build
- **Individual services**: Navigate to service directory for targeted builds
- **Database setup**: Ensure MariaDB running with appropriate databases created

## Code Conventions
- **Lombok**: Use `@Data` for entities, avoid manual getters/setters
- **Validation**: Use Jakarta validation annotations on entity fields
- **Error Handling**: ResponseEntity pattern with Optional for 404s
- **Service Layer**: Keep controllers thin, business logic in service classes
- **Package Structure**: Consistent `com.project.pms.{service}service` naming