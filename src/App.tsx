import { routeConfig } from '@presentation/shared/configs/routeConfig';
import { tanstackQueryClient } from '@presentation/shared/configs/tanstackQueryConfig';
import { QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider, theme } from 'antd';
import { useEffect } from 'react';
import { BrowserRouter, useLocation, useRoutes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

function AppRoutes() {
  return useRoutes(Object.values(routeConfig));
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [pathname]);

  return null;
}

const AntdTheme = {
  algorithm: theme.darkAlgorithm,
};

function App() {
  return (
    <>
      <ConfigProvider theme={AntdTheme}>
        <QueryClientProvider client={tanstackQueryClient}>
          <BrowserRouter>
            <ScrollToTop />
            <AppRoutes />
            <ToastContainer />
          </BrowserRouter>
        </QueryClientProvider>
      </ConfigProvider>
    </>
  );
}

export default App;
