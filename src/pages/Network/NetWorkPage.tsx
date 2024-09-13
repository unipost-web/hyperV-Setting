import { useConfigStore } from '@/store/configStore.ts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx';
import { Label } from '@/components/ui/label.tsx';
import { useState } from 'react';
import { useHandleAsyncTask } from '@/utils/handleAsyncTask.ts';
import HeaderTitle from '@/components/common/HeaderTitle.tsx';

export default function NetWorkPage() {
  const handleAsyncTask = useHandleAsyncTask();
  const { configData } = useConfigStore();
  const [changeIp, setChangeIp] = useState('192.168.12.');

  const ipconfig = configData.ipconfig;
  const currentNetworkConfig = ipconfig.find((configItem: any) => {
    const ipv4 = configItem.ipv4;
    const regex = /^192\.168\.(10|11|12)\./;
    return regex.test(ipv4);
  });

  const handleChange = (e: any) => {
    setChangeIp(e.target.value);
  };

  const handleChangeIp = async () => {
    const regex = /^192\.168\.(10|11|12)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    await handleAsyncTask({
      validationFunc: () => regex.test(changeIp),
      validationMessage: 'IP 주소는 192.168.10-12.X 형식이어야 합니다. X는 0에서 255 사이의 숫자여야 합니다.',
      apiFunc: () => window.electron.changeIp({ interfaceName: currentNetworkConfig.interfaceName, changeIp }),
      alertOptions: {
        closeCallBack: async () => {
          window.location.reload();
        },
      },
    });
  };

  return (
    <>
      <HeaderTitle
        title={'IP 정보 조회 및 변경'}
        description={'VPN이 켜져 있다면 끄고 F5(새로고침) 후 확인 해주세요.'}
      ></HeaderTitle>
      <Tabs defaultValue="infomation" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="infomation">정보 조회</TabsTrigger>
          <TabsTrigger value="IpChange">IP 변경</TabsTrigger>
        </TabsList>
        <TabsContent value="infomation">
          <Card className="w-full">
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">인터페이스 이름 </TableHead>
                    <TableHead>Ipv4주소</TableHead>
                    <TableHead className="w-[200px]">Mac 주소</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ipconfig.map((ipconfigItem: any, rowIndex: number) => (
                    <TableRow key={rowIndex}>
                      <TableCell className="font-semibold">{ipconfigItem.interfaceName}</TableCell>
                      <TableCell className="font-semibold">{ipconfigItem.ipv4}</TableCell>
                      <TableCell className="font-semibold">{ipconfigItem.mac}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="IpChange">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>IP 는 회사 대역으로 사용중인 IP 만 변경가능</CardTitle>
              <CardDescription>192.168.10~12.XXX 대역만 변경 ( Hyper-V ) </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label>현재 IP</Label>
                  <Input id="currentIp" disabled value={currentNetworkConfig?.ipv4} />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label>변경할 IP</Label>
                  <Input id="changeIp" onChange={handleChange} value={changeIp} />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleChangeIp}>IP 주소 변경</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
