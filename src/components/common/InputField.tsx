import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';

interface InputFieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (e: any) => void;
  type?: string;
}

const InputField = ({ label, id, value, onChange, type = 'text' }: InputFieldProps) => {
  return (
    <div className="grid gap-3 mt-4">
      <Label>{label}</Label>
      <Input id={id} type={type} className="w-full" value={value} onChange={onChange} />
    </div>
  );
};

export default InputField;
