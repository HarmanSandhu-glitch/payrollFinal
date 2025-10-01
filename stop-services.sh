#!/bin/bash

# Stop all APC services
echo "Stopping APC Payroll Management System Services..."

# Set base directory
BASE_DIR="/home/harmn/Pictures/apc"

# Function to stop a service
stop_service() {
    local service_name=$1
    local service_dir=$2
    
    if [ -f "$service_dir/logs/$service_name.pid" ]; then
        local pid=$(cat "$service_dir/logs/$service_name.pid")
        echo "Stopping $service_name (PID: $pid)..."
        
        if ps -p $pid > /dev/null; then
            kill $pid
            sleep 3
            
            # Force kill if still running
            if ps -p $pid > /dev/null; then
                echo "Force killing $service_name..."
                kill -9 $pid
            fi
        fi
        
        rm -f "$service_dir/logs/$service_name.pid"
        echo "$service_name stopped"
    else
        echo "$service_name PID file not found"
    fi
}

# Stop services in reverse order
stop_service "api-gateway" "$BASE_DIR/api-gateway"
stop_service "leave-service" "$BASE_DIR/services/leave-service"
stop_service "attendance-service" "$BASE_DIR/services/attendance-service"
stop_service "payroll-service" "$BASE_DIR/services/payroll-service"
stop_service "department-service" "$BASE_DIR/services/department-service"
stop_service "employee-service" "$BASE_DIR/services/employee-service"
stop_service "discovery-service" "$BASE_DIR/discovery-service"

echo ""
echo "All services stopped successfully!"