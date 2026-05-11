# Voting Front-end

A modern, user-friendly web application for creating, managing, and participating in polls and voting events. This project provides a responsive interface for users to interact with polls, view results, and manage tickets.

---

## 🚀 Technologies Used

| Layer      | Technology           |
|------------|----------------------|
| Frontend   | React, TypeScript, Vite |
| Styling    | CSS (custom)         |
| API Calls  | Axios (assumed)      |
| Backend    | _Not included in this repo_ |
| Database   | _Not included in this repo_ |

> **Note:** This repository contains only the front-end. Backend and database are assumed to be provided separately.

---

## 📦 Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

---

## 🛠️ Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-username/voting-front-end.git
   cd voting-front-end/Voitng-fonrt-end
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```

---

## 🏃 Running the Project

### Start the Frontend
```sh
npm run dev
```
- The app will be available at [http://localhost:5173](http://localhost:5173) by default.

### Start the Backend
- _Not included in this repository. Please refer to the backend project for instructions._

---

## ⚙️ Environment Variables (`.env`)

Create a `.env` file in the root directory to configure environment variables. Example:

```env
VITE_API_BASE_URL=https://api.example.com
```

| Variable            | Description                        |
|---------------------|------------------------------------|
| VITE_API_BASE_URL   | Base URL for backend API requests  |

> **Note:** All environment variables for Vite must be prefixed with `VITE_`.

---

## 📁 Project Structure

```
Voitng-fonrt-end/
├── public/                # Static assets
├── src/
│   ├── api/               # API request logic
│   ├── assets/            # CSS and images
│   ├── common/            # Shared constants/utilities
│   ├── components/        # Reusable UI components
│   ├── locale/            # Localization files
│   ├── pages/             # Main app pages
│   ├── App.tsx            # App root
│   ├── main.tsx           # Entry point
│   └── Routes.tsx         # App routes
├── package.json           # Project metadata & scripts
├── vite.config.ts         # Vite configuration
├── tsconfig*.json         # TypeScript configs
└── README.md              # Project documentation
```

---

## 📚 Main API Endpoints

> _Endpoints are defined in `src/api/ticketApi.ts`. Update this section as needed._

| Method | Endpoint           | Description                |
|--------|--------------------|----------------------------|
| GET    | /tickets           | Get list of tickets        |
| POST   | /polls             | Create a new poll          |
| GET    | /polls/:id         | Get poll details           |

---

## 🏗️ Build for Production

```sh
npm run build
```
- Output will be in the `dist/` folder.

---

## 🚀 Deployment

1. Build the project (see above).
2. Deploy the contents of the `dist/` folder to your preferred static hosting (e.g., Vercel, Netlify, GitHub Pages).

---

## 🐞 Common Issues & Troubleshooting

| Issue                        | Solution                                                      |
|------------------------------|---------------------------------------------------------------|
| Port already in use          | Change the port in `vite.config.ts` or stop the other process |
| API requests not working     | Check `VITE_API_BASE_URL` in your `.env` file                 |
| TypeScript errors            | Run `npm install` and check your TypeScript version           |
| Styles not loading           | Ensure `assets/root.css` is imported in your components       |

> **Tip:** For more help, check the [Vite documentation](https://vitejs.dev/), [React docs](https://react.dev/), or open an issue.

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgements

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)

---

> _Happy coding!_