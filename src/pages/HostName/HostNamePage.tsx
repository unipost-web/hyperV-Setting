import HeaderTitle from '@/components/common/HeaderTitle.tsx';
import { useEffect, useState } from 'react';

export default function HostNamePage() {
  const [hostname, setHostname] = useState('');
  const [message, setMessage] = useState('');
  const { ipcRenderer } = window.require('electron');
  const handleHostnameChange = () => {
    ipcRenderer.send('change-hostname', hostname);
  };

  useEffect(() => {
    // IPC 이벤트 리스너 등록
    ipcRenderer.on('channel', (event: any, data: string) => {
      setMessage(data);
    });
  }, [ipcRenderer]);

  const handleClick = () => {
    ipcRenderer.send('channel', 'aaa');
  };

  return (
    <>
      <HeaderTitle title={'HostName'} description={'PC 의 호스트네임을 변경하는 페이지.'} />
      <div className="container">
        <h1>Recive: {message}</h1>
        <button onClick={handleClick}>Click me</button>
        <h2 className="text-2xl font-bold tracking-tight">HyperV-Settings</h2>
        <p className="text-muted-foreground">{`Configure your virtual machines' hostname, network, and more.`}</p>
        <input
          type="text"
          value={hostname}
          onChange={(e) => setHostname(e.target.value)}
          placeholder="Enter new hostname"
          className="input-field"
        />
        <button onClick={handleHostnameChange} className="btn-primary">
          Change Hostname
        </button>
      </div>
    </>
  );
}
