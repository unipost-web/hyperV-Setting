import { useState } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import HeaderTitle from '@/components/common/HeaderTitle.tsx';
import InputField from '@/components/common/InputField.tsx';
import { useHandleAsyncTask } from '@/utils/handleAsyncTask.ts';

interface SAPSystem {
  id: number;
  description: string;
  systemId: string;
  instanceNumber: string;
  applicationServer: string;
}

export default function SapPage() {
  const [workSpace, setWorkSpace] = useState<string>('Local');
  const [systems, setSystems] = useState<SAPSystem[]>([
    { id: 1, description: 'DEV', systemId: '', instanceNumber: '00', applicationServer: '' },
    { id: 2, description: 'QAS', systemId: '', instanceNumber: '00', applicationServer: '' },
    { id: 3, description: 'PRD', systemId: '', instanceNumber: '00', applicationServer: '' },
  ]);
  const [nextId, setNextId] = useState(2);
  const handleAsyncTask = useHandleAsyncTask();

  const addSystem = () => {
    setSystems([
      ...systems,
      { id: nextId, description: '', systemId: '', instanceNumber: '00', applicationServer: '' },
    ]);
    setNextId(nextId + 1);
  };

  const removeSystem = (id: number) => {
    setSystems(systems.filter((system) => system.id !== id));
  };

  const updateSystem = (id: number, field: keyof SAPSystem, value: string) => {
    setSystems(systems.map((system) => (system.id === id ? { ...system, [field]: value } : system)));
  };

  const handleSubmit = async () => {
    const isValid = systems.every(
      (system) => system.description && system.systemId && system.instanceNumber && system.applicationServer,
    );
    await handleAsyncTask({
      validationFunc: () => isValid,
      validationMessage:
        '모든 필드를 채워주세요. 내역, 시스템 ID, 인스턴스 번호, 어플리케이션 서버는 필수 입력 항목입니다.',
      apiFunc: () => window.electron.updateSapGui({ workSpace, param: systems }),
    });
  };

  return (
    <>
      <HeaderTitle title={'SAP System Configuration'} description={'SAP GUI 의 엔트리 정보 추가'}></HeaderTitle>
      <Card className="w-full">
        <CardHeader>
          <InputField
            label={'WorkSpaces 에서 사용할 WorkSpace 를 입력 해주세요.'}
            id={'work-space'}
            value={workSpace}
            onChange={(e) => {
              setWorkSpace(e.target.value);
            }}
          />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>내역</TableHead>
                <TableHead>시스템 ID</TableHead>
                <TableHead>인스턴스 번호</TableHead>
                <TableHead className="w-[300px]">어플리케이션 서버</TableHead>
                <TableHead className="w-[30px]">삭제</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {systems.map((system) => (
                <TableRow key={system.id}>
                  <TableCell>
                    <Input
                      value={system.description}
                      onChange={(e) => updateSystem(system.id, 'description', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={system.systemId}
                      onChange={(e) => updateSystem(system.id, 'systemId', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={system.instanceNumber}
                      type={'number'}
                      onChange={(e) => updateSystem(system.id, 'instanceNumber', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={system.applicationServer}
                      onChange={(e) => updateSystem(system.id, 'applicationServer', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSystem(system.id)}
                      disabled={systems.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-end mt-4">
            <Button onClick={addSystem}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New System
            </Button>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-between items-center gap-4 mt-5">
        <Button className="flex-1 text-center py-2 px-4" onClick={handleSubmit}>
          SAP 정보 추가
        </Button>
      </div>
    </>
  );
}
