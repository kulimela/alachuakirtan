# Festival of the Holy Name Website

[![License: CC BY 3.0](https://img.shields.io/badge/License-CC_BY_3.0-lightgrey.svg)](https://creativecommons.org/licenses/by/3.0/)

This is the official website for the Festival of the Holy Name event held in Alachua, Florida. The website provides information about the festival, schedule, travel details, and ways to get involved.

## Features

- Event information and about section
- Festival schedule display (when available)
- Travel and accommodation information
- Contact form for inquiries
- Donation capabilities through PayPal
- Social media integration (Facebook and YouTube)

## Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local development server (optional, for development)
- Basic understanding of HTML/CSS/JavaScript (for development)

## Technical Stack

- HTML5
- CSS3
- JavaScript
- Bootstrap for responsive design
- Font Awesome for icons
- Google Fonts integration
- jQuery for animations and interactions

## Project Structure

```curl
alachuakirtan/
├── index.html          # Main entry point
├── audio.html          # Audio content page
├── css/               # Stylesheet files
│   ├── animations.css  # Animation styles
│   ├── style.css      # Main styles
│   └── custom.css     # Custom overrides
├── js/                # JavaScript files
│   ├── custom.js      # Custom functionality
│   └── template.js    # Template scripts
├── config/            # Configuration
│   └── config.js      # Site configuration
├── images/            # Image assets
└── fonts/             # Font files
```

## Configuration

The website uses a configuration file (`config/config.js`) to manage dynamic content such as:

- Schedule visibility
- Live stream status
- Event dates
- YouTube video integration

## Installation & Local Development

1. Clone the repository:

```bash
git clone [repository-url]
cd alachuakirtan
```

1. Local development options:
   - Using Python: `python -m http.server 8000`
   - Using VS Code: Install "Live Server" extension
   - Using Node.js: `npx http-server`

1. Open `http://localhost:8000` in your browser

## Usage

### Configuration File

Edit `config/config.js` to modify site behavior:

```javascript
const config = {
    IS_LIVE: false,        // Toggle live stream
    HAS_SCHEDULE: true,    // Toggle schedule display
    HAS_SUNDAY: false      // Toggle Sunday schedule
};
```

### Custom Styling

Add custom styles in `css/custom.css` to override default styling.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/YourFeature`
3. Commit changes: `git commit -am 'Add YourFeature'`
4. Push to branch: `git push origin feature/YourFeature`
5. Submit a Pull Request

### Code Style Guidelines

- Follow existing HTML/CSS/JS formatting
- Comment complex functionality
- Test responsive design
- Validate HTML/CSS

## Testing

- Test in multiple browsers
- Verify responsive design using dev tools
- Check all forms and interactive elements
- Validate links and resources

## Deployment

1. Ensure all configuration is set correctly
2. Test all functionality in a staging environment
3. Optimize images and assets
4. Update meta tags and SEO information
5. Deploy to production server

## License

This project is licensed under the Creative Commons Attribution 3.0 License - see [LICENSE](https://creativecommons.org/licenses/by/3.0/) for details.

## Acknowledgments

- Template: Worthy by HtmlCoder
- Icons: Font Awesome
- Fonts: Google Fonts
- Framework: Bootstrap
- Community contributors and volunteers

## Support

For support, please:

1. Check existing [documentation](docs/)
2. Contact the maintainers
3. Submit an issue

---
Last updated: 2024/12/02
