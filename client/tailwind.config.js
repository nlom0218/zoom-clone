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
      city: "url('https://images.unsplash.com/photo-1519501025264-65ba15a82390?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2864&q=80')",
    },
  },
  darkMode: "class",
  // plugins: [require("@tailwindcss/forms")],
};
