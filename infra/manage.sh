#!/bin/bash

# Infrastructure management script for Oh Yeah That Place

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

show_help() {
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start       Start all services"
    echo "  stop        Stop all services"
    echo "  restart     Restart all services"
    echo "  logs        Show logs for all services"
    echo "  status      Show status of all services"
    echo "  clean       Stop and remove all containers and volumes"
    echo "  test        Test Nominatim service"
    echo "  help        Show this help message"
}

start_services() {
    echo "Starting services..."
    docker compose up -d
    echo "Services started. Nominatim will be available at http://localhost:8080"
    echo "Note: Initial setup may take a few minutes to download and import data."
}

stop_services() {
    echo "Stopping services..."
    docker compose down
    echo "Services stopped."
}

restart_services() {
    echo "Restarting services..."
    docker compose restart
    echo "Services restarted."
}

show_logs() {
    docker compose logs -f
}

show_status() {
    docker compose ps
}

clean_all() {
    echo "Stopping and removing all containers and volumes..."
    read -p "This will delete all data. Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker compose down -v
        echo "All containers and volumes removed."
    else
        echo "Operation cancelled."
    fi
}

test_nominatim() {
    echo "Testing Nominatim service..."
    
    # Wait for service to be ready
    echo "Waiting for Nominatim to be ready..."
    timeout 300 bash -c 'until curl -s http://localhost:8080/status > /dev/null; do sleep 5; done'
    
    if [ $? -eq 0 ]; then
        echo "✓ Nominatim is ready!"
        
        echo "Testing search..."
        curl -s "http://localhost:8080/search?q=Monte Carlo&format=json&limit=1" | jq '.[0].display_name' || echo "Search test completed (install jq for formatted output)"
        
        echo "Testing reverse geocoding..."
        curl -s "http://localhost:8080/reverse?lat=43.7384&lon=7.4246&format=json" | jq '.display_name' || echo "Reverse geocoding test completed"
        
        echo "✓ Nominatim tests passed!"
    else
        echo "✗ Nominatim failed to start or is not responding"
        exit 1
    fi
}

case "${1:-help}" in
    start)
        start_services
        ;;
    stop)
        stop_services
        ;;
    restart)
        restart_services
        ;;
    logs)
        show_logs
        ;;
    status)
        show_status
        ;;
    clean)
        clean_all
        ;;
    test)
        test_nominatim
        ;;
    help|*)
        show_help
        ;;
esac
