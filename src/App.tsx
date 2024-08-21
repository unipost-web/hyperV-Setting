import { Route, Routes } from 'react-router-dom';

import RootLayout from '@/pages/RootLayout.tsx';
import MainPage from '@/pages/Main/MainPage.tsx';
import HostNamePage from '@/pages/HostName/HostNamePage.tsx';
import NetWorkPage from '@/pages/Network/NetWorkPage.tsx';
import PortProxyPage from '@/pages/PortProxy/PortProxyPage.tsx';
import UtilPage from '@/pages/Util/UtilPage.tsx';
import UniConfirm from '@/components/common/UniConfirm.tsx';

import { ThemeProvider } from '@/components/theme-provider.tsx';
import { Toaster } from '@/components/ui/toaster.tsx';
import { useConfigStore } from '@/store/configStore.ts';
import { useEffect, useState } from 'react';
import UniAlert from '@/components/common/UniAlert.tsx';
import LoadingModal from '@/components/common/LoadingModal.tsx';
import { useLoadingStore } from '@/store/loadingStore.ts';

function App() {
  const { setConfigData } = useConfigStore();
  const { startLoading, stopLoading } = useLoadingStore();
  const [isElectronReady, setIsElectronReady] = useState(false);

  useEffect(() => {
    const checkElectron = () => {
      if (window.electron) {
        setIsElectronReady(true);
      } else {
        setTimeout(checkElectron, 100); // 100ms 후에 다시 확인
      }
    };
    checkElectron();
  }, []);

  useEffect(() => {
    const getConfigData = async () => {
      startLoading();
      if (isElectronReady) {
        const { data } = await window.electron.getConfig();
        setConfigData(data);
      }
      stopLoading();
    };
    getConfigData();
  }, [isElectronReady]);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RootLayout>
        <Toaster />
        <UniConfirm />
        <UniAlert />
        <LoadingModal />
        <Routes>
          <Route path={'/'} element={<MainPage />}></Route>
          <Route path={'/hostName'} element={<HostNamePage />}></Route>
          <Route path={'/netWork'} element={<NetWorkPage />}></Route>
          <Route path={'/portProxy'} element={<PortProxyPage />}></Route>
          <Route path={'/util'} element={<UtilPage />}></Route>
        </Routes>
      </RootLayout>
    </ThemeProvider>
  );
}

export default App;
