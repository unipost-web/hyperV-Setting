import { Route, Routes } from 'react-router-dom';

import MainLayout from '@/pages/MainLayout.tsx';
import MainPage from '@/pages/Main/MainPage.tsx';
import HostNamePage from '@/pages/HostName/HostNamePage.tsx';
import NetWorkPage from '@/pages/Network/NetWorkPage.tsx';
import PortProxyPage from '@/pages/PortProxy/PortProxyPage.tsx';
import UtilPage from '@/pages/Util/UtilPage.tsx';

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path={'/'} element={<MainPage />}></Route>
        <Route path={'/hostName'} element={<HostNamePage />}></Route>
        <Route path={'/netWork'} element={<NetWorkPage />}></Route>
        <Route path={'/portProxy'} element={<PortProxyPage />}></Route>
        <Route path={'/util'} element={<UtilPage />}></Route>
      </Routes>
    </MainLayout>
  );
}

export default App;
