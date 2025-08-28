# Color Picker Chrome Extension

A simple and intuitive color picker Chrome extension with eyedropper functionality.

## Features

- **Color Picker**: Interactive color picker with live preview
- **Eyedropper Tool**: Pick colors directly from any webpage
- **Multiple Formats**: Support for HEX, RGB, and HSL color formats
- **Color History**: Keeps track of recently picked colors
- **Copy to Clipboard**: Easy one-click copying of color values

## Installation

### Install as Developer Extension

1. **Download the Extension**
   - Clone or download this repository
   - Or download as ZIP and extract

2. **Open Chrome Extensions Page**
   - Open Google Chrome
   - Navigate to `chrome://extensions/`
   - Or go to Chrome Menu → More Tools → Extensions

3. **Enable Developer Mode**
   - Toggle "Developer mode" switch in the top right corner

4. **Load the Extension**
   - Click "Load unpacked" button
   - Select the folder containing the extension files
   - The extension should now appear in your extensions list

5. **Pin the Extension** (Optional)
   - Click the puzzle piece icon in the Chrome toolbar
   - Find "Color Picker" and click the pin icon to keep it visible

## Usage

### Color Picking
1. Click the Color Picker extension icon in your Chrome toolbar
2. Your cursor will immediately turn into a loupe/magnifying glass
3. Move your cursor over any element on the webpage to preview the color
4. Click on the desired color to pick it - the color is automatically copied to your clipboard
5. Press `Escape` to cancel the eyedropper mode

### Color History
- Recently picked colors are automatically saved to extension storage
- History persists between browser sessions
- Access history through Chrome's extension storage (up to 12 recent colors)

## Files Structure

```
colorPicker/
├── manifest.json          # Extension configuration
├── background.js          # Service worker for handling toolbar clicks
├── icon.png               # Extension icon
└── README.md              # This file
```

## Permissions

The extension requires the following permissions:
- `activeTab`: To access the current webpage for eyedropper functionality
- `storage`: To save color history

## Browser Compatibility

- Chrome (Manifest V3)
- Edge (Chromium-based)
- Other Chromium-based browsers

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the [MIT License](LICENSE).