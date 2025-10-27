import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import App from './App.jsx';
import { AppProvider } from './context/AppContext.jsx';
import 'antd/dist/reset.css';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#2563EB',
          borderRadius: 16,
          fontSize: 16,
        },
        components: {
          Button: {
            controlHeight: 44,
            borderRadius: 999,
          },
        },
      }}
    >
      <BrowserRouter>
        <AppProvider>
          <App />
        </AppProvider>
      </BrowserRouter>
    </ConfigProvider>
  </StrictMode>,
);
