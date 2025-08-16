import React, { useEffect } from 'react';
import {
  Routes,
  Route,
  useLocation
} from 'react-router-dom';

import './css/style.css';

import './charts/ChartjsConfig.jsx';

// Import pages
import Dashboard from './pages/Dashboard.jsx';
import BatchPredictionPage from "./components/BatchPredictionPage.jsx";
import ManualPrediction from "./components/manualPrediction.jsx";
import Client from "./components/Client.jsx";
import PredictionsHistory from "./components/PredictionsHistory.jsx";

function App() {

  const location = useLocation();

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto'
    window.scroll({ top: 0 })
    document.querySelector('html').style.scrollBehavior = ''
  }, [location.pathname]); // triggered on route change

  return (
    <>
      <Routes>

        <Route exact path="/" element={<Dashboard />} />
        <Route path="/batch-prediction" element={<BatchPredictionPage />} />
        <Route path="/manual-prediction" element={<ManualPrediction />} />
        <Route path="/clients" element={<Client />} />
        <Route path="/history" element={<PredictionsHistory />} />



      </Routes>
    </>
  );
}

export default App;
