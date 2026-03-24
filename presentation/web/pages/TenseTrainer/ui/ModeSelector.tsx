'use client';

import { FIXED_LIMITS, FixedLimit, MODE_LABELS, SessionMode } from '../logic/types';

type Props = {
	mode: SessionMode;
	fixedLimit: FixedLimit;
	onModeChange: (mode: SessionMode) => void;
	onLimitChange: (limit: FixedLimit) => void;
};

const ModeSelector = ({ mode, fixedLimit, onModeChange, onLimitChange }: Props) => (
	<div className='border-border bg-card flex flex-col gap-3 rounded-xl border p-5'>
		<p className='text-foreground text-sm font-semibold'>Режим</p>
		<div className='flex gap-2'>
			{(['fixed', 'infinite'] as SessionMode[]).map(m => (
				<button
					key={m}
					onClick={() => onModeChange(m)}
					className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
						mode === m
							? 'border-primary bg-primary text-primary-foreground'
							: 'border-border bg-background text-muted-foreground hover:bg-muted'
					}`}
				>
					{MODE_LABELS[m]}
				</button>
			))}
		</div>
		<div
			className={`grid transition-all duration-200 ease-in-out ${
				mode === 'fixed' ? 'grid-rows-[1fr]' : '-mt-3 grid-rows-[0fr]'
			}`}
		>
			<div className='overflow-hidden'>
				<div className='flex gap-2'>
					{FIXED_LIMITS.map(limit => (
						<button
							key={limit}
							onClick={() => onLimitChange(limit as FixedLimit)}
							className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
								fixedLimit === limit
									? 'border-primary bg-primary text-primary-foreground'
									: 'border-border bg-background text-muted-foreground hover:bg-muted'
							}`}
						>
							{limit}
						</button>
					))}
				</div>
			</div>
		</div>
	</div>
);

export default ModeSelector;
