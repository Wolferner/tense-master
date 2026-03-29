'use client';

import { FIXED_LIMITS, type FixedLimit, MODE_LABELS, type TrainingMode } from '../../logic/types';

type Props = {
	mode: TrainingMode;
	fixedLimit: FixedLimit;
	onUpdate: (patch: { mode?: TrainingMode; limit?: FixedLimit }) => void;
};

const ModeSelector = ({ mode, fixedLimit, onUpdate }: Props) => (
	<div className='border-border bg-card flex flex-col gap-3 rounded-xl border p-5'>
		<p className='text-foreground text-sm font-semibold'>Режим</p>
		<div className='flex gap-2'>
			{(['fixed', 'infinite'] as TrainingMode[]).map(m => (
				<button
					key={m}
					onClick={() => onUpdate({ mode: m })}
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
							onClick={() => onUpdate({ limit: limit })}
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
