
import './App.css'
import LayOut from "@/layouts"
import '@geoscene/core/assets/geoscene/themes/light/main.css';
import LoginPage from './pages/LoginPage';
import { MapProvider } from './store/mapStore';

function App() {

  return (
    <MapProvider>
      <LayOut></LayOut>
    </MapProvider>

    // <LoginPage></LoginPage>
  )
}

export default App
