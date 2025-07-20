# Infrastructure management script for Oh Yeah That Place (PowerShell version)

param(
    [Parameter(Position=0)]
    [ValidateSet("start", "stop", "restart", "logs", "status", "clean", "test", "help")]
    [string]$Command = "help"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

function Show-Help {
    Write-Host "Usage: .\manage.ps1 [COMMAND]"
    Write-Host ""
    Write-Host "Commands:"
    Write-Host "  start       Start all services"
    Write-Host "  stop        Stop all services"  
    Write-Host "  restart     Restart all services"
    Write-Host "  logs        Show logs for all services"
    Write-Host "  status      Show status of all services"
    Write-Host "  clean       Stop and remove all containers and volumes"
    Write-Host "  test        Test Nominatim service"
    Write-Host "  help        Show this help message"
}

function Start-Services {
    Write-Host "Starting services..."
    docker compose up -d
    Write-Host "Services started. Nominatim will be available at http://localhost:8080"
    Write-Host "Note: Initial setup may take a few minutes to download and import data."
}

function Stop-Services {
    Write-Host "Stopping services..."
    docker compose down
    Write-Host "Services stopped."
}

function Restart-Services {
    Write-Host "Restarting services..."
    docker compose restart
    Write-Host "Services restarted."
}

function Show-Logs {
    docker compose logs -f
}

function Show-Status {
    docker compose ps
}

function Clean-All {
    Write-Host "Stopping and removing all containers and volumes..."
    $response = Read-Host "This will delete all data. Are you sure? (y/N)"
    if ($response -eq "y" -or $response -eq "Y") {
        docker compose down -v
        Write-Host "All containers and volumes removed."
    } else {
        Write-Host "Operation cancelled."
    }
}

function Test-Nominatim {
    Write-Host "Testing Nominatim service..."
    
    # Wait for service to be ready
    Write-Host "Waiting for Nominatim to be ready..."
    $timeout = 300
    $elapsed = 0
    
    do {
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:8080/status" -TimeoutSec 5 -ErrorAction SilentlyContinue
            if ($response.StatusCode -eq 200) {
                break
            }
        } catch {
            # Service not ready yet
        }
        
        Start-Sleep -Seconds 5
        $elapsed += 5
        
        if ($elapsed -ge $timeout) {
            Write-Host "✗ Nominatim failed to start or is not responding"
            exit 1
        }
    } while ($true)
    
    Write-Host "✓ Nominatim is ready!"
    
    try {
        Write-Host "Testing search..."
        $searchResponse = Invoke-RestMethod -Uri "http://localhost:8080/search?q=Monte Carlo&format=json&limit=1"
        if ($searchResponse.Count -gt 0) {
            Write-Host "Search result: $($searchResponse[0].display_name)"
        }
        
        Write-Host "Testing reverse geocoding..."
        $reverseResponse = Invoke-RestMethod -Uri "http://localhost:8080/reverse?lat=43.7384&lon=7.4246&format=json"
        Write-Host "Reverse geocoding result: $($reverseResponse.display_name)"
        
        Write-Host "✓ Nominatim tests passed!"
    } catch {
        Write-Host "✗ Nominatim tests failed: $($_.Exception.Message)"
        exit 1
    }
}

switch ($Command) {
    "start" { Start-Services }
    "stop" { Stop-Services }
    "restart" { Restart-Services }
    "logs" { Show-Logs }
    "status" { Show-Status }
    "clean" { Clean-All }
    "test" { Test-Nominatim }
    default { Show-Help }
}
