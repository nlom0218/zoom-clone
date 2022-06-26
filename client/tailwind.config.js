// npm install -D tailwindcss postcss autoprefixer
// npx tailwindcss init -p

module.exports = {
  content: [
    // 아래의 경로에서 Tailwind를 사용할 것이라고 알림
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js.jsx,tx,tsx}",
  ],
  theme: {
    backgroundImage: {
      city: "url('../img/city1.jpg')",
    },
  },
  darkMode: "class",
  // plugins: [require("@tailwindcss/forms")],
};
