# Vorici Calculator

A web-based calculator for Path of Exile's Vorici chromatic orb calculations. This tool helps players determine the optimal strategy for obtaining desired socket colors on their equipment.

## Features

- **Socket Color Calculation**: Calculate the probability and cost of obtaining specific socket colors
- **Chromatic Orb Optimization**: Find the most efficient method to achieve your desired socket setup
- **Responsive Design**: Works on desktop and mobile devices
- **No Dependencies**: Pure HTML, CSS, and JavaScript implementation
- **Docker Support**: Easy deployment with Docker and Docker Compose

## Quick Start

### Option 1: Direct Browser Access
Simply open `index.html` in your web browser to use the calculator locally.

### Option 2: Local Web Server
```bash
# Using Python 3
python3 -m http.server 8000

# Using Node.js
npx http-server

# Then visit http://localhost:8000
```

### Option 3: Docker Deployment
```bash
# Basic deployment
docker-compose up -d

# Production deployment with reverse proxy
docker-compose --profile production up -d

# With monitoring (Prometheus + Grafana)
docker-compose --profile monitoring up -d

# With Redis caching
docker-compose --profile with-redis up -d
```

## Usage

1. **Select Item Base**: Choose the item type you want to calculate for
2. **Input Requirements**: Enter the desired socket colors and links
3. **View Results**: See the probability and estimated cost in chromatic orbs
4. **Compare Methods**: Evaluate different approaches to achieve your goal

## Docker Services

The Docker Compose setup includes several optional services:

- **vorici-calculator**: Main web application (nginx)
- **nginx-proxy**: Reverse proxy for production (optional)
- **redis**: Caching layer (optional)
- **prometheus**: Metrics collection (optional)
- **grafana**: Monitoring dashboard (optional)

## File Structure

```
vorici-calculator/
├── index.html          # Main application page
├── calculator.js       # Core calculation logic
├── style.css          # Styling and responsive design
├── about.html         # About page
├── disclaimer.html    # Legal disclaimer
├── nginx.conf         # Nginx configuration
├── Dockerfile         # Docker image configuration
├── docker-compose.yml # Docker Compose services
└── README.md          # This file
```

## Development

### Prerequisites
- Web browser (Chrome, Firefox, Safari, Edge)
- Docker (optional, for containerized deployment)
- Docker Compose (optional, for multi-service deployment)

### Local Development
1. Clone the repository
2. Open `index.html` in your browser
3. Make changes to HTML, CSS, or JavaScript files
4. Refresh the browser to see changes

### Docker Development
```bash
# Build and run
docker-compose up --build

# Run in development mode with file watching
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

## Deployment

### GitHub Pages
1. Enable GitHub Pages in repository settings
2. Select source branch (main)
3. Access via: `https://yourusername.github.io/VoriciCalculator`

### Docker Production
```bash
# Production deployment
docker-compose --profile production up -d

# With SSL/TLS (configure certificates first)
docker-compose --profile production --profile ssl up -d
```

### Manual Deployment
Upload all files to any web server that serves static files.

## Configuration

### Nginx Configuration
Edit `nginx.conf` to customize:
- Server settings
- Caching policies
- Security headers
- Compression settings

### Docker Configuration
Edit `docker-compose.yml` to customize:
- Port mappings
- Environment variables
- Volume mounts
- Network settings

## Monitoring

When using the monitoring profile:
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3000 (admin/admin)

## Security

The Docker setup includes security best practices:
- Non-root user execution
- Read-only root filesystem
- Security options enabled
- Minimal attack surface

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Disclaimer

This tool is for educational and convenience purposes. Path of Exile is a trademark of Grinding Gear Games. This calculator is not affiliated with or endorsed by Grinding Gear Games.

## Support

For issues, feature requests, or questions:
- Open an issue on GitHub
- Check the about page for additional information
- Review the disclaimer for terms of use

## Version History

- **v1.0.0**: Initial release with basic calculation functionality
- **v1.1.0**: Added Docker support and responsive design
- **v1.2.0**: Enhanced Docker Compose with monitoring and security features