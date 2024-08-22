import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import InputField from '@/components/common/InputField.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Fragment, useState } from 'react';
import { useHandleAsyncTask } from '@/utils/handleAsyncTask.ts';

interface ProxyData {
  id: string;
  value: string;
  listenPort: number[];
  connectPort: number[];
  connectAddress: string;
}

export default function PortProxyPage() {
  const handleAsyncTask = useHandleAsyncTask();
  const INIT_PROXY_DATA: ProxyData[] = [
    { id: 'WAS DEV', value: '', listenPort: [80, 443, 8082], connectPort: [80, 443, 8082], connectAddress: '' },
    { id: 'SAP DEV', value: '', listenPort: [3200, 3300], connectPort: [3200, 3300], connectAddress: '' },
    { id: 'SAP QAS', value: '', listenPort: [3201, 3301], connectPort: [3201, 3301], connectAddress: '' },
  ];
  const [proxyData, setProxyData] = useState(INIT_PROXY_DATA);

  const handleProxyDataChange = (e: any) => {
    const { id, value } = e.target;
    setProxyData((prevData) =>
      prevData.map((item) => (item.id === id ? { ...item, connectAddress: value, value } : item)),
    );
  };

  const handleSavePortProxy = async () => {
    const regex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    await handleAsyncTask({
      validationFunc: () => {
        return regex.test(changeIp);
      },
      validationMessage: 'IP 주소는 192.168.10-12.X 형식이어야 합니다. X는 0에서 255 사이의 숫자여야 합니다.',
      apiFunc: () => window.electron.changeIp({ interfaceName: currentNetworkConfig.interfaceName, changeIp }),
      alertOptions: {
        closeCallBack: async () => {
          window.location.reload();
        },
      },
    });
    window.electron.savePortProxy(defaultProxyData);
  };
  const handleSearchPortProxy = () => {};
  const handleInitPortProxy = () => {};
  return (
    <>
      <Tabs defaultValue="default" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="default">Default</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
          <TabsTrigger value="paste">Paste</TabsTrigger>
        </TabsList>
        <TabsContent value="default">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>connect Address 입력!!</CardTitle>
              <CardDescription>운영은 Custom, Paste 에서 등록!!</CardDescription>
            </CardHeader>
            <CardContent>
              {proxyData.map((proxyItem: any, rowIndex: number) => (
                <Fragment key={rowIndex}>
                  <InputField
                    label={proxyItem.id}
                    id={proxyItem.id}
                    value={proxyItem.value}
                    onChange={handleProxyDataChange}
                  />
                </Fragment>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="custom">
          <Card className="w-full"></Card>
        </TabsContent>
        <TabsContent value="paste">
          <Card className="w-full"></Card>
        </TabsContent>
      </Tabs>
      <div className="flex justify-between items-center gap-4 mt-5">
        <Button className="flex-1 text-center py-2 px-4" onClick={handleSavePortProxy}>
          추가
        </Button>
        <Button className="flex-1 text-center py-2 px-4" onClick={handleSearchPortProxy}>
          조회
        </Button>
        <Button className="flex-1 text-center py-2 px-4" onClick={handleInitPortProxy}>
          초기화
        </Button>
      </div>
    </>
  );
}
