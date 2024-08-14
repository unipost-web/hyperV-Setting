import { MainForm } from '@/pages/Main/components/MainForm.tsx';
import { Separator } from '@radix-ui/react-dropdown-menu';

export default function MainPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">This is how others will see you on the site.</p>
      </div>
      <Separator />
      <MainForm />
    </div>
  );
}
