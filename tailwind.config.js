const { fontFamily, spacing } = require("tailwindcss/defaultTheme");
module.exports = {
   purge: {
    // Uncomment for faster build time
    // enabled:true,
    enabled:
      process.env.NODE_ENV === "production",
    content: [
      "./src/**/*.pcss",
      "./src/**/*.css",
      "./src/**/*.sass",
      "./src/**/*.html",
      "./src/**/*.js",
      "./src/**/*.ts"
    ],
  },
  darkMode: 'class', // or 'media' or false
  theme: {
    extend: {
      colors: {
         orange: {
          100: "#FEECDC",
          200: "#FCD9BD",
          300: "#FDBA8C",
          400: "#FF8A4C",
          500: "#FF5A1F",
          600: "#D03801",
          700: "#B43403",
          800: "#8A2C0D",
          900: "#771D1D"
        },
      },
      maxHeight: {
        ...spacing
      },
      fontFamily: {
        sans: ["Open Sans", "Source Sans Pro", ...fontFamily.sans]
      },
      borderRadius: {
        '5xl':'5rem'
      },
      skew: {
        '4':'4deg'
      },
      rotate: {
        '4':'4deg'
      }
    },
  },
  variants: {
    extend: {
      boxShadow: ["responsive", "hover", "focus", "group-hover"],
      backgroundAttachment: ['responsive'],
      backgroundColor: ['responsive', 'dark', 'group-hover', 'focus-within', 'hover', 'focus'],
      borderColor: ['responsive', 'dark', 'group-hover', 'focus-within', 'hover', 'focus'],
    },
  },
  plugins: [],
}
