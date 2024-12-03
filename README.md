# Alachua Kirtan Website

Source code for [alachuakirtan.com](https://alachuakirtan.com) - Festival of the Holy Name website.

## Project Overview

This website serves as the online presence for the Festival of the Holy Name, providing information about kirtan events, schedules, and ways to get involved in the community.

## Technology Stack

- HTML5
- CSS3
- Modern JavaScript (ES6+)
- Bootstrap 5 Framework
- Font Awesome for icons
- Google Fonts
- Mobile-first responsive design
- Modern browser compatibility

## Recent Updates

- Upgraded from Bootstrap 3 to Bootstrap 5 for improved performance and modern components
- Modernized JavaScript codebase with ES6+ features
- Enhanced mobile responsiveness and browser compatibility
- Improved overall performance and user experience

## Project Structure

```curl
alachuakirtan/
├── audio.html          # Audio content page
├── bootstrap/          # Bootstrap framework files
├── config/             # Configuration files
├── css/               # Stylesheet files
├── fonts/             # Font files including Font Awesome
├── images/            # Image assets
├── js/                # JavaScript files
├── plugins/           # jQuery and other plugin files
├── index.html         # Main landing page
├── singers.xhtml      # Singers information page
└── style.css          # Custom styles
```

## Setup for Local Development

1. Clone the repository:

   ```bash
   git clone https://github.com/[username]/alachuakirtan.git
   ```

2. No build process is required as this is a static website.

3. Start a local development server:

   Using Python (recommended):

   ```bash
   # If you have Python 3:
   python -m http.server 8000
   ```

   Alternative methods:
   - Using Visual Studio Code: Install the "Live Server" extension and click "Go Live"
   - Using Node.js: Install `http-server` globally via npm:

     ```bash
     npm install -g http-server
     http-server
     ```

4. View the website:
   - Open your browser and navigate to `http://localhost:8000`
   - The website should now be running locally
   - Any changes you make to the files will be reflected when you refresh the browser

5. Testing changes:
   - Edit HTML, CSS, or JavaScript files using your preferred code editor
   - Save the files
   - Refresh your browser to see the changes
   - Use browser developer tools (F12) to debug and inspect elements

## Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create a new branch for your feature
3. Make your changes
4. Submit a pull request

### Development Guidelines

- Maintain responsive design principles
- Test across different browsers and devices
- Follow existing code style and structure
- Update documentation for significant changes

## File Structure Details

- `index.html`: Main landing page with event information
- `audio.html`: Houses audio content and recordings
- `singers.xhtml`: Information about kirtan singers
- `css/`: Contains all styling files
  - `animations.css`: Custom animations
  - `style.css`: Main stylesheet
  - `custom.css`: Custom overrides
- `js/`: JavaScript files
  - `custom.js`: Site-specific functionality
- `config/`: Configuration files for the website

## License

This project uses the Creative Commons Attribution 3.0 License.

## Credits

- Bootstrap Template: Worthy by HtmlCoder
- Fonts: Google Fonts, Font Awesome
- Various jQuery plugins (see WORTHY.md for full credits)

## Contact

For questions or suggestions, please use GitHub Issues or contact the maintainers.
