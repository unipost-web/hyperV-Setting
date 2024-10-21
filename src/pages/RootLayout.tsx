import { Separator } from '@/components/ui/separator.tsx';
import { SidebarNav } from '@/components/common/SidebarNav.tsx';
import ModeToggle from '@/components/common/ModeToggle.tsx';

const sidebarNavItems = [
  {
    title: 'HostName',
    href: '/',
  },
  {
    title: 'NetWork',
    href: '/netWork',
  },
  {
    title: 'PortProxy',
    href: '/portProxy',
  },
  {
    title: 'SAP',
    href: '/sap',
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

const RootLayout = ({ children }: SettingsLayoutProps) => {
  return (
    <div className="hidden space-y-6 p-10 pb-16 md:block">
      <div className="flex justify-between items-center">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">HyperV-Setting</h2>
          <p className="text-muted-foreground">Hyper-V PC를 편하게 세팅해 보아요~</p>
        </div>
        <ModeToggle />
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/6">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex-1 w-full">{children}</div>
      </div>
    </div>
  );
};

export default RootLayout;
