import InstallBanner from '@/presentation/web/components/InstallBanner/InstallBanner';
import Header from '@/presentation/web/components/Header/Header';
import { SyncProvider } from '@/presentation/web/components/SyncProvider/SyncProvider';

export default function WebLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className='flex min-h-screen flex-col'>
			<SyncProvider />
			<Header />
			<div className='flex flex-1 flex-col'>{children}</div>
			<InstallBanner />
		</div>
	);
}
