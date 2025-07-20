# Infrastructure Setup

This directory contains Docker configurations for running the required services for the "Oh Yeah That Place" application.

## Nominatim Setup

Nominatim is an open-source geocoding service that powers the search functionality of the application.

### Quick Start

To start the Nominatim service using Docker Compose:

```bash
# Navigate to the infra directory
cd infra

# Start the Nominatim container
docker compose up -d nominatim

# Check the logs
docker compose logs -f nominatim
```

### Alternative: Using Docker Run Command

If you prefer to use the original docker run command:

```bash
docker run -it \
  -e PBF_URL=https://download.geofabrik.de/europe/monaco-latest.osm.pbf \
  -e REPLICATION_URL=https://download.geofabrik.de/europe/monaco-updates/ \
  -p 8080:8080 \
  --name nominatim \
  mediagis/nominatim:5.1
```

### Configuration

The Docker Compose setup includes:

- **Container Name**: `nominatim`
- **Port Mapping**: `8080:8080` (accessible at http://localhost:8080)
- **Environment Variables**:
  - `PBF_URL`: Monaco OSM data file URL
  - `REPLICATION_URL`: Monaco updates URL
- **Volumes**: Named volumes for data persistence
- **Restart Policy**: `unless-stopped`

### Data Persistence

The current setup uses named Docker volumes for data persistence. If you prefer to use bind mounts for easier access to data files, uncomment the volume mappings in the docker-compose.yml file and create the corresponding directories:

```bash
mkdir -p data/postgres data/flatnode
```

### Service Management

```bash
# Start services
docker compose up -d

# Stop services
docker compose down

# View logs
docker compose logs -f nominatim

# Restart services
docker compose restart nominatim

# Remove everything (including volumes)
docker compose down -v
```

### Testing the Service

Once the container is running, you can test the Nominatim API:

```bash
# Search for a place
curl "http://localhost:8080/search?q=Monte Carlo&format=json&limit=1"

# Reverse geocoding
curl "http://localhost:8080/reverse?lat=43.7384&lon=7.4246&format=json"
```

### Notes

- The initial setup may take some time as it downloads and imports the Monaco OSM data
- Monaco is used as it's a small dataset perfect for development and testing
- For production use, you may want to use a larger dataset or different region
- The service will be available at http://localhost:8080 once fully loaded
