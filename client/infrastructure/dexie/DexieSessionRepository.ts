import type { ISessionRepository } from '@/client/application/repositories/ISessionRepository';
import type { Session } from '@/domain/entities/Session';
import type { TenseMasterDb } from './db';

export class DexieSessionRepository implements ISessionRepository {
	constructor(private readonly db: TenseMasterDb) {}

	async create(session: Session): Promise<void> {
		await this.db.sessions.put(session);
	}

	async updateStatus(id: string, status: Session['status'], completedAt?: string): Promise<void> {
		await this.db.sessions.update(id, { status, ...(completedAt ? { completedAt } : {}) });
	}

	async findAll(): Promise<Session[]> {
		return this.db.sessions.orderBy('createdAt').reverse().toArray();
	}

	async findById(id: string): Promise<Session | undefined> {
		return this.db.sessions.get(id);
	}
}
