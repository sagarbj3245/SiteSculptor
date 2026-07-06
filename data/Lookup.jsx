export default {
  DEVELOPER: {
    name: "Sagar B J",
    role: "Full-Stack Developer",
    email: "sagarbj001@gmail.com",
    github: "https://github.com/sagarbj3245",
    linkedin: "https://www.linkedin.com/in/sagar-b-j-2855b3319/",
    twitter: "https://x.com/sagar_bj01",
    instagram: "https://www.instagram.com/sagardrops/",
  },

  SUGGESTIONS: [
    "Develop a Real-Time Weather App",
    "Create an E-commerce Platform",
    "Build a Social Media Dashboard",
    "Develop a Recipe Recommendation App",
    "Create a Movie Booking System",
    "Build a Personal Portfolio Website",
    "Develop a Task Automation Tool",
    "Create a Meditation and Mindfulness App",
    "Build a Travel Planner App",
    "Develop an Online Quiz Platform",
    "Create a Health & Fitness Tracker",
    "Build a Collaborative Note-Taking App"
  ],

  DEFAULT_FILE: {
    '/public/index.html': {
      code: `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>
        <div id="root"></div>
      </body>
      </html>`
    },
    '/App.css': {
      code: `@tailwind base;
@tailwind components;
@tailwind utilities;`
    },
    '/tailwind.config.js': {
      code: `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`
    },
    '/postcss.config.js': {
      code: `/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
  },
};

export default config;
`
    }
  },

  DEPENDENCY: {
    "autoprefixer": "^10.0.0",
    "framer-motion": "^10.0.0",
    "lucide-react": "latest",
    "postcss": "^8",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-icons": "^5.0.0",
    "react-router-dom": "latest",
    "react-toastify": "^10.0.0",
    "tailwind-merge": "^2.4.0",
    "tailwindcss": "^3.4.1",
    "tailwindcss-animate": "^1.0.7"
  }
};
