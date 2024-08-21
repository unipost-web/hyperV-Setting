import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Label } from '@/components/ui/label.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { useConfigStore } from '@/store/configStore.ts';
import { useHandleAsyncTask } from '@/utils/handleAsyncTask.ts';

export default function HostNamePage() {
  const handleAsyncTask = useHandleAsyncTask();
  const { configData } = useConfigStore();
  const [changeHostName, setChangeHostname] = useState('local-');
  const currentHostName = configData.currentHostName || '';

  const handleChange = (e: any) => {
    setChangeHostname(e.target.value);
  };

  const handleChangeHostName = async () => {
    await handleAsyncTask({
      validationFunc: () => /^[a-zA-Z0-9-]*$/.test(changeHostName),
      validationMessage: '호스트네임은 영문, 숫자, "-" 만 가능합니다.',
      apiFunc: () => window.electron.changeHostName({ currentHostName, changeHostName }),
      confirmOptions: {
        description: '컴퓨터를 지금 다시 시작 하시겠습니까?',
        handleProceed: async () => await window.electron.reboot(),
      },
    });
  };

  return (
    <>
      <div className="grid gap-4">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <Card x-chunk="dashboard-07-chunk-0">
            <CardHeader>
              <CardTitle>PC 이름 바꾸기</CardTitle>
              <CardDescription>문자, 하이픈 및 숫자를 조합해서 사용할 수 있습니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="hostName">현재 PC 이름 : {currentHostName}</Label>
                  <Input
                    id="hostName"
                    type="text"
                    className="w-full"
                    value={changeHostName}
                    onChange={handleChange}
                    maxLength={20}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className={'flex justify-end'}>
              <Button onClick={handleChangeHostName}>HostName 변경</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
