import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import InputField from '@/components/common/InputField.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Fragment, useState } from 'react';
import { useHandleAsyncTask } from '@/utils/handleAsyncTask.ts';
import { useConfirmStore } from '@/store/confirmStore.ts';
import { Textarea } from '@/components/ui/textarea.tsx';

interface ProxyData {
  id: string;
  value?: string;
  listenPort: string;
  listenAddress: string;
  connectPort: string;
  connectAddress: string;
}

interface PortInfo {
  id: string;
  listenAddress: string;
  listenPort: string;
  connectAddress: string;
  connectPort: string;
}

const INIT_DEFAULT_PROXY_DATA: ProxyData[] = [
  {
    id: 'WAS DEV',
    value: '',
    listenPort: '80,443,8082',
    connectPort: '80,443,8082',
    connectAddress: '',
    listenAddress: '*',
  },
  {
    id: 'SAP DEV',
    value: '',
    listenPort: '3200,3300',
    connectPort: '3200,3300',
    connectAddress: '',
    listenAddress: '*',
  },
  {
    id: 'SAP QAS',
    value: '',
    listenPort: '3201,3301',
    connectPort: '3201,3301',
    connectAddress: '',
    listenAddress: '*',
  },
];

const INIT_CUSTOM_PROXY_DATA: ProxyData[] = [
  { id: 'CUSTOM', listenAddress: '*', listenPort: '', connectPort: '', connectAddress: '' },
];

export default function PortProxyPage() {
  const handleAsyncTask = useHandleAsyncTask();
  const { setConfirm } = useConfirmStore();
  const [proxyData, setProxyData] = useState<ProxyData[]>(INIT_DEFAULT_PROXY_DATA);
  const [textAreaData, setTextAreaData] = useState<string>('');

  const extractPortInfo = (input: string): PortInfo[] => {
    const lines = input.trim().split('\n');

    // "주소 포트 주소 포트" 데이터가 시작되는 위치를 찾기 위한 정규 표현식
    const dataStartIndex = lines.findIndex((line) => line.startsWith('주소'));

    // 헤더 라인 이후 데이터 라인 추출
    const dataLines = lines.slice(dataStartIndex + 1);
    const filterLines = dataLines.filter((dataItem) => !dataItem.includes('----'));

    return filterLines
      .map((line, rowIndex) => {
        const parts = line.split(/\s+/).filter(Boolean);
        if (parts.length >= 4) {
          return {
            id: rowIndex.toString(),
            listenAddress: parts[0],
            listenPort: parts[1],
            connectAddress: parts[2],
            connectPort: parts[3],
          };
        }
        return null;
      })
      .filter((item): item is PortInfo => item !== null);
  };

  const handleTextAreaChange = (e: any) => {
    setTextAreaData(e.target.value);

    const filterData = extractPortInfo(e.target.value);
    setProxyData(filterData);
  };

  const handleProxyDataChange = (e: any, type?: string) => {
    const { id, value } = e.target;

    if (type === 'custom') {
      setProxyData((prevData) => prevData.map((item) => ({ ...item, [id]: value })));
    } else if (type === 'default') {
      setProxyData((prevData) =>
        prevData.map((item) => (item.id === id ? { ...item, connectAddress: value, value } : item)),
      );
    }
  };

  const handleSavePortProxy = async () => {
    const updateData = proxyData.filter((proxyItem: ProxyData) => !!proxyItem.connectAddress);

    await handleAsyncTask({
      validationFunc: () => updateData.length !== 0,
      validationMessage: '입력값이 존재하지 않습니다.',
      apiFunc: () => window.electron.savePortProxy(updateData),
      alertOptions: {},
    });
  };

  const handleSearchPortProxy = async () => {
    await window.electron.getPortProxy();
  };

  const handleDeletePortProxy = async () => {
    setConfirm({
      title: '삭제 하시겠습니까??',
      handleProceed: async () => {
        await handleAsyncTask({
          validationFunc: () => proxyData[0].listenPort !== '',
          validationMessage: '입력값이 존재하지 않습니다.',
          apiFunc: () => window.electron.deletePortProxy(Number(proxyData[0].listenPort)),
          alertOptions: {},
        });
      },
    });
  };

  const handleInitPortProxy = async () => {
    await handleAsyncTask({
      apiFunc: () => window.electron.initPortProxy(),
      alertOptions: {},
    });
  };

  return (
    <>
      <Tabs
        defaultValue="default"
        className="w-full"
        onValueChange={(tabValue) => {
          if (tabValue === 'default') setProxyData(INIT_DEFAULT_PROXY_DATA);
          else if (tabValue === 'custom') setProxyData(INIT_CUSTOM_PROXY_DATA);
          else if (tabValue === 'paste') setTextAreaData('');
          else setProxyData([]);
        }}
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="default">Default</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
          <TabsTrigger value="paste">Paste</TabsTrigger>
        </TabsList>
        <TabsContent value="default">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Connect Address 입력</CardTitle>
              <CardDescription>PRD는 Custom, Paste 에서 등록</CardDescription>
            </CardHeader>
            <CardContent>
              {proxyData.map((proxyItem: ProxyData, rowIndex: number) => (
                <Fragment key={rowIndex}>
                  <InputField
                    label={proxyItem.id}
                    id={proxyItem.id}
                    value={proxyItem.value || ''}
                    onChange={(e) => {
                      handleProxyDataChange(e, 'default');
                    }}
                  />
                </Fragment>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="custom">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>단 건 등록</CardTitle>
            </CardHeader>
            <CardContent>
              <InputField
                label="LISTEN_PORT"
                type="number"
                id="listenPort"
                value={proxyData[0]?.listenPort}
                onChange={(e) => {
                  handleProxyDataChange(e, 'custom');
                }}
              />
              <InputField
                label="CONNECT_PORT"
                type="number"
                id="connectPort"
                value={proxyData[0]?.connectPort}
                onChange={(e) => {
                  handleProxyDataChange(e, 'custom');
                }}
              />
              <InputField
                label="CONNECT_ADDRESS"
                id="connectAddress"
                value={proxyData[0]?.connectAddress}
                onChange={(e) => {
                  handleProxyDataChange(e, 'custom');
                }}
              />
            </CardContent>
            <CardFooter>
              <Button variant="destructive" className="flex-1" onClick={handleDeletePortProxy}>
                삭제
              </Button>
              <h3 className="text-red-600 text-lg font-medium m-4">* 삭제 시에는 LISTEN_PORT만 적어도 됩니다.</h3>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="paste">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>사용할 PortProxy 를 복사하여 붙여넣기!!</CardTitle>
              <CardDescription>
                cmd 에서 netsh int portproxy show all 해서 나온 값을 전체 복사하면 됩니다.
              </CardDescription>
              <div className="w-full">
                <Textarea
                  className="w-full h-64 p-2 border border-gray-300 rounded"
                  placeholder="Type your message here."
                  id="message"
                  value={textAreaData}
                  onChange={handleTextAreaChange}
                />
              </div>
            </CardHeader>
          </Card>
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
