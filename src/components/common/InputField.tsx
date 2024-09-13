import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';

interface InputFieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (e: any) => void;
  type?: string;
  placeholder?: string;
}

const InputField = ({ label, id, value, onChange, placeholder, type = 'text' }: InputFieldProps) => {
  return (
    <div className="grid gap-3 mt-4">
      <Label>{label}</Label>
      <Input id={id} type={type} className="w-full" value={value} onChange={onChange} placeholder={placeholder} />
    </div>
  );
};

export default InputField;
