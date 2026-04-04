import type { Session } from '@/domain/entities/Session';

export interface ISessionRepository {
	create(session: Session): Promise<void>;
	updateStatus(id: string, status: Session['status'], completedAt?: string): Promise<void>;
	findAll(): Promise<Session[]>;
	findById(id: string): Promise<Session | undefined>;
}
