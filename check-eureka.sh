#!/bin/bash

echo "Checking Eureka Server Status..."
echo "================================"

# Check if port 8761 is listening
if netstat -tuln 2>/dev/null | grep -q ":8761 "; then
    echo "✅ Port 8761 is listening"
    
    # Try to connect to Eureka
    if curl -s --connect-timeout 5 http://localhost:8761 >/dev/null; then
        echo "✅ Eureka server is accessible"
        echo "🌐 Dashboard: http://localhost:8761"
        
        # Count registered services
        service_count=$(curl -s http://localhost:8761/eureka/apps 2>/dev/null | grep -o '<application>' | wc -l)
        echo "📊 Registered services: $service_count"
        
    else
        echo "❌ Eureka server not responding"
    fi
else
    echo "❌ Port 8761 is not listening"
    echo "💡 Start Eureka with: cd discovery-service && java -jar target/discovery-service-0.0.1-SNAPSHOT.jar"
fi

echo ""
echo "Service Status:"
echo "---------------"

services=("discovery-service:8761" "employee-service:8081" "department-service:8082" "payroll-service:8083" "attendance-service:8084" "leave-service:8085" "api-gateway:8080")

for service in "${services[@]}"; do
    name=$(echo $service | cut -d: -f1)
    port=$(echo $service | cut -d: -f2)
    
    if netstat -tuln 2>/dev/null | grep -q ":$port "; then
        echo "✅ $name (port $port)"
    else
        echo "❌ $name (port $port)"
    fi
done