import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add custom styles for font families used in the design
const customStyles = document.createElement('style');
customStyles.textContent = `
  :root {
    --joy: #FFD166;
    --sadness: #118AB2;
    --anger: #EF476F;
    --neutral: #073B4C;
    --secondary: #FF6584;
  }
  
  .font-poppins {
    font-family: 'Poppins', sans-serif;
  }
  
  .font-inter {
    font-family: 'Inter', sans-serif;
  }
`;
document.head.appendChild(customStyles);

createRoot(document.getElementById("root")!).render(<App />);
