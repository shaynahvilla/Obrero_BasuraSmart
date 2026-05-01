# BasuraSmart Login Page

A modern, responsive login page for the BasuraSmart waste management system, built with React and Tailwind CSS.

## Features

- **Modern UI/UX**: Clean, eco-friendly design with glassmorphism effects
- **Form Validation**: Real-time validation using React Hook Form and Zod
- **Responsive Design**: Works perfectly on mobile and desktop
- **Accessibility**: Semantic HTML and ARIA labels
- **Animations**: Smooth transitions and micro-interactions
- **Password Toggle**: Show/hide password functionality
- **Loading States**: Visual feedback during form submission
- **Error Handling**: User-friendly error messages

## Tech Stack

- **React 18** - Modern React with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form management and validation
- **Zod** - Schema validation
- **Lucide React** - Beautiful icons
- **Vite** - Fast development server

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open in browser:**
   ```
   http://localhost:3001
   ```

### Build for Production

```bash
npm run build
```

## Design Features

### Visual Design
- **Color Scheme**: Green primary (eco-friendly) with yellow accents
- **Typography**: Inter font family for modern readability
- **Glassmorphism**: Frosted glass effect for depth
- **Gradients**: Subtle background gradients for visual interest
- **Icons**: Lucide React icons for consistency

### Interactions
- **Hover Effects**: Button lift and shadow changes
- **Focus States**: Clear focus indicators for accessibility
- **Loading States**: Spinner animation during form submission
- **Transitions**: Smooth color and transform transitions
- **Micro-animations**: Fade-in and slide-up animations

### Form Features
- **Real-time Validation**: Immediate feedback on input
- **Error Messages**: Clear, contextual error text
- **Success Messages**: Positive feedback for successful actions
- **Password Toggle**: Eye icon to show/hide password
- **Disabled States**: Proper handling during loading

## Demo Credentials

For testing purposes:
- **Email**: admin@basurasmart.com
- **Password**: admin123

## File Structure

```
login-page/
├── public/
├── src/
│   ├── components/
│   │   └── LoginPage.jsx     # Main login component
│   ├── App.jsx               # Root component
│   ├── main.jsx              # Entry point
│   └── index.css             # Global styles
├── index.html                # HTML template
├── package.json              # Dependencies
├── tailwind.config.js        # Tailwind configuration
├── vite.config.js            # Vite configuration
└── README.md                 # This file
```

## Customization

### Colors
Edit `tailwind.config.js` to modify the color scheme:

```javascript
theme: {
  extend: {
    colors: {
      primary: { /* your colors */ },
      secondary: { /* your colors */ },
      accent: { /* your colors */ }
    }
  }
}
```

### Fonts
Update the Google Fonts link in `index.html` and the font family in `tailwind.config.js`.

### Validation
Modify the schema in `LoginPage.jsx` to change validation rules:

```javascript
const loginSchema = z.object({
  email: z.string().email('Your custom message'),
  password: z.string().min(8, 'Your custom message'),
});
```

## Accessibility

- Semantic HTML5 elements
- Proper form labels and descriptions
- ARIA labels where needed
- Keyboard navigation support
- High contrast colors
- Focus indicators

## Performance

- Optimized bundle size with Vite
- Lazy loading of icons
- Efficient CSS with Tailwind
- Minimal re-renders with React Hook Form
- Smooth animations with CSS transforms

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
