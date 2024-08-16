import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { Label } from '@/components/ui/label.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Button } from '@/components/ui/button.tsx';
import { useAlertStore } from '@/store/alertStore.ts';

export default function HostNamePage() {
  const [hostname, setHostname] = useState('local-');
  const { setAlert } = useAlertStore();

  const handleChange = (e: any) => {
    setHostname(e.target.value);
  };

  const handleChangeHostName = () => {
    const regex = /^[a-zA-Z0-9-]*$/;
    if (!regex.test(hostname)) {
      const description = `호스트네임은 영문, 숫자, "-" 를 추천 드립니다.\n그래도 변경하시겠습니까??`;
      setAlert('HostName Change', description);
    }
  };

  return (
    <>
      <div className="grid gap-4">
        <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
          <Card x-chunk="dashboard-07-chunk-0">
            <CardHeader>
              <CardTitle>HostName Change</CardTitle>
              <CardDescription>호스트 네임 변경 시 재부팅을 해야 적용이 됩니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="hostName">HostName</Label>
                  <Input
                    id="hostName"
                    type="text"
                    className="w-72"
                    value={hostname}
                    onChange={handleChange}
                    maxLength={25}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-center">
              <Button variant="outline" onClick={handleChangeHostName}>
                HostName Change
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
