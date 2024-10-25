import { Route, Routes } from 'react-router-dom';

import RootLayout from '@/pages/RootLayout.tsx';
import HostNamePage from '@/pages/HostName/HostNamePage.tsx';
import NetWorkPage from '@/pages/Network/NetWorkPage.tsx';
import PortProxyPage from '@/pages/PortProxy/PortProxyPage.tsx';
import UniConfirm from '@/components/common/UniConfirm.tsx';

import { ThemeProvider } from '@/components/theme-provider.tsx';
import { Toaster } from '@/components/ui/toaster.tsx';
import { useConfigStore } from '@/store/configStore.ts';
import { useEffect, useState } from 'react';
import UniAlert from '@/components/common/UniAlert.tsx';
import LoadingModal from '@/components/common/LoadingModal.tsx';
import { useLoadingStore } from '@/store/loadingStore.ts';
import SapPage from '@/pages/SAP/SapPage.tsx';

function App() {
  const { setConfigData } = useConfigStore();
  const { startLoading, stopLoading } = useLoadingStore();
  const [isUpdate, setIsUpdate] = useState(false);

  useEffect(() => {
    const checkElectron = async () => {
      console.log(window.ipcRenderer);
      if (window.electron && window.ipcRenderer) {
        startLoading();

        const { data } = await window.electron.getConfig();
        setConfigData(data);
        document.documentElement.style.setProperty('--font-family', 'SUITE');

        window.ipcRenderer.on('update-available', (_event, response) => {
          console.log(response);
          setIsUpdate(response.isUpdate);
        });
        stopLoading();
      } else {
        setTimeout(checkElectron, 100); // 100ms 후에 다시 확인
      }
    };
    checkElectron();
  }, []);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RootLayout isUpdate={isUpdate}>
        <Toaster />
        <UniConfirm />
        <UniAlert />
        <LoadingModal />
        <Routes>
          <Route path={'/'} element={<HostNamePage />}></Route>
          <Route path={'/netWork'} element={<NetWorkPage />}></Route>
          <Route path={'/portProxy'} element={<PortProxyPage />}></Route>
          <Route path={'/sap'} element={<SapPage />}></Route>
        </Routes>
      </RootLayout>
    </ThemeProvider>
  );
}

export default App;
