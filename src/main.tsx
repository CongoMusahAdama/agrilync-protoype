import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import App from './App'
import './index.css'

registerSW({
  onOfflineReady() {
    console.info('[AgriLync PWA] App shell cached — ready for offline field use.')
  },
})

createRoot(document.getElementById("root")!).render(<App />);
