import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Label } from '@/components/ui/label.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { toast } from '@/components/ui/use-toast.ts';
import { useConfirmStore } from '@/store/confirmStore.ts';
import { useConfigStore } from '@/store/configStore.ts';

export default function HostNamePage() {
  const { configData } = useConfigStore();
  const { setConfirm } = useConfirmStore();
  const [changeHostName, setChangeHostname] = useState('local-');
  const currentHostName = configData.data?.currentHostName || '로딩 중...';

  const handleChange = (e: any) => {
    setChangeHostname(e.target.value);
  };

  const handleChangeHostName = async () => {
    const regex = /^[a-zA-Z0-9-]*$/;
    if (!regex.test(changeHostName)) {
      toast({
        variant: 'destructive',
        title: '호스트 네임을 정상적으로 입력해주세요.',
        description: '호스트네임은 영문, 숫자, "-" 만 가능합니다.',
      });
      return;
    }

    const response = await window.electron.changeHostName({ currentHostName, changeHostName });
    if (!response.success) {
      toast({ variant: 'destructive', title: response.message });
    } else {
      setConfirm({
        title: response.message,
        description: '컴퓨터를 지금 다시 시작 하시겠습니까??',
        handleProceed: await window.electron.reboot,
      });
    }
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
