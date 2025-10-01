#!/bin/bash

# Start all APC services in the correct order
echo "Starting APC Payroll Management System Services..."

# Set base directory
BASE_DIR="/home/harmn/Pictures/apc"

# Function to start a service
start_service() {
    local service_name=$1
    local service_dir=$2
    local port=$3
    
    echo "Starting $service_name on port $port..."
    cd "$service_dir"
    nohup java -jar target/*.jar > logs/$service_name.log 2>&1 &
    echo $! > logs/$service_name.pid
    sleep 5
    echo "$service_name started with PID $(cat logs/$service_name.pid)"
}

# Create logs directory
mkdir -p "$BASE_DIR/logs"
mkdir -p "$BASE_DIR/discovery-service/logs"
mkdir -p "$BASE_DIR/services/employee-service/logs"
mkdir -p "$BASE_DIR/services/department-service/logs"
mkdir -p "$BASE_DIR/services/payroll-service/logs"
mkdir -p "$BASE_DIR/services/attendance-service/logs"
mkdir -p "$BASE_DIR/services/leave-service/logs"
mkdir -p "$BASE_DIR/api-gateway/logs"

# Step 1: Start Discovery Service first (Eureka Server)
start_service "discovery-service" "$BASE_DIR/discovery-service" "8761"

echo "Waiting for Eureka Server to be ready..."
sleep 10

# Step 2: Start individual microservices
start_service "employee-service" "$BASE_DIR/services/employee-service" "8081"
start_service "department-service" "$BASE_DIR/services/department-service" "8082"
start_service "payroll-service" "$BASE_DIR/services/payroll-service" "8083"
start_service "attendance-service" "$BASE_DIR/services/attendance-service" "8084"
start_service "leave-service" "$BASE_DIR/services/leave-service" "8085"

echo "Waiting for services to register with Eureka..."
sleep 15

# Step 3: Start API Gateway last
start_service "api-gateway" "$BASE_DIR/api-gateway" "8080"

echo ""
echo "============================================="
echo "All services started successfully!"
echo "============================================="
echo "Discovery Service (Eureka): http://localhost:8761"
echo "API Gateway: http://localhost:8080"
echo "Employee Service: http://localhost:8081"
echo "Department Service: http://localhost:8082"
echo "Payroll Service: http://localhost:8083"
echo "Attendance Service: http://localhost:8084"
echo "Leave Service: http://localhost:8085"
echo ""
echo "Access the application at: http://localhost:8080"
echo ""
echo "To stop services, run: ./stop-services.sh"