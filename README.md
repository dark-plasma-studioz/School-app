# Northern Secondary School App

A comprehensive school management application for students at Northern Secondary School, featuring AI-powered learning support, assignment tracking, and calendar management.

## Features

### 📚 Subject Management
- Grade-based subject selection (Grades 9-12)
- Color-coded subjects for easy identification
- Subject-specific chatbots powered by OpenAI

### 📝 Assignment Tracking
- Create and manage assignments with due dates
- Priority levels (Low, Medium, High)
- Status tracking (Pending, In Progress, Completed)
- Overdue assignment alerts

### 🎓 Learning Support
- **Camera/Upload Lessons**: Take photos of lesson content or upload images
- **AI-Powered Analysis**: OpenAI Vision API analyzes uploaded content
- **Text Descriptions**: Manually describe lesson content
- **Practice Questions**: AI-generated study questions based on lesson materials
- **Subject Chatbots**: Get help with specific subjects using AI tutors

### 📅 Calendar & Events
- Create academic and extracurricular events
- Set start and end dates/times
- **Recurring Events**: Daily, Weekly, Biweekly, Monthly, or custom (e.g., Every Friday)
- **Notifications**: Get alerts before events (5 min to 1 day advance notice)
- Event type categorization (Academic, Extracurricular, Sports, Club, Personal)

### 💬 AI Chatbots
- **Subject-Specific Chatbots**: Ask questions about specific subjects with context from uploaded lessons
- **Global Assistant**: Help with managing assignments, deadlines, and study planning

## Setup Instructions

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager
- OpenAI API key

### Installation

1. **Clone or download the project files**

2. **Install dependencies**
   ```bash
   npm install react react-dom lucide-react
   # or
   yarn add react react-dom lucide-react
   ```

3. **Configure Environment Variables**
   
   The `.env` file has already been created with your API key. **IMPORTANT**: Never commit this file to version control!
   
   The `.env` file contains:
   ```
   VITE_OPENAI_API_KEY=your_api_key_here
   ```

4. **Set up your build tool**
   
   If using Vite (recommended):
   ```bash
   npm create vite@latest
   # Select React as the framework
   # Select JavaScript or TypeScript
   ```

5. **Add Tailwind CSS**
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

   Configure `tailwind.config.js`:
   ```javascript
   export default {
     content: [
       "./index.html",
       "./src/**/*.{js,ts,jsx,tsx}",
     ],
     theme: {
       extend: {},
     },
     plugins: [],
   }
   ```

6. **Import the app component**
   
   In your `src/main.jsx` or `src/App.jsx`:
   ```javascript
   import NorthernSchoolApp from './northern-school-app-complete'
   ```

7. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Security Notes

### Environment Variables
- **Never commit `.env` files** to version control
- The `.gitignore` file is already configured to exclude sensitive files
- If you need to share the project, create a `.env.example` file with placeholder values

### API Key Safety
- Your OpenAI API key is stored in the `.env` file
- The app uses `import.meta.env.VITE_OPENAI_API_KEY` to access it
- In production, use environment variables from your hosting platform

## Data Storage

All app data is stored locally in the browser's `localStorage`:
- Selected grade and subjects
- Assignments
- Study questions
- Lesson uploads
- Calendar events
- Chat messages

**Note**: Clearing browser data will delete all saved information.

## OpenAI API Usage

This app uses the following OpenAI models:
- **GPT-4**: For chatbot conversations and question generation
- **GPT-4 Vision**: For analyzing uploaded lesson images

Make sure you have sufficient credits in your OpenAI account.

## Project Structure

```
.
├── .env                                    # Environment variables (DO NOT COMMIT)
├── .gitignore                              # Git ignore rules
├── northern-school-app-complete.jsx        # Main app component
└── README.md                               # This file
```

## Usage Guide

### Getting Started
1. Select your grade level (9, 10, 11, or 12)
2. Choose your subjects for the semester
3. Navigate to the dashboard

### Managing Assignments
1. Click on a subject
2. Go to the "Assignments" tab
3. Click "Add Assignment"
4. Fill in details and set a due date

### Using Learning Support
1. Click on a subject
2. Go to the "Learning Support" tab
3. Upload lesson content via camera or describe it
4. Generate practice questions based on lessons
5. Use the subject chatbot for questions

### Creating Calendar Events
1. Go to the Calendar tab
2. Click the "+" button
3. Fill in event details
4. Set recurring pattern if needed
5. Enable notifications

### Using AI Chatbots
- **Subject Chatbot**: Click the chat icon on any subject page
- **Global Assistant**: Click the chat icon on the dashboard

## Troubleshooting

### API Key Issues
- Ensure your `.env` file exists and contains the correct API key
- Restart the development server after changing `.env`
- Check that the key starts with `sk-`

### Build Issues
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check that all dependencies are installed
- Ensure you're using a compatible Node.js version (16+)

### Data Not Saving
- Check browser console for localStorage errors
- Ensure you're not in private/incognito mode
- Clear browser cache and try again

## License

This is a student project for Northern Secondary School.

## Support

For issues or questions, please contact the developer.
