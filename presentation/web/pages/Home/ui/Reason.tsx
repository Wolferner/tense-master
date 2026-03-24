import type { IReason } from '../logic/reason';

interface IProps {
	reason: IReason;
}

const Reason = ({ reason }: IProps) => {
	return (
		<div key={reason.title} className='border-border bg-card rounded-xl border p-6'>
			<h3 className='text-primary mb-2 font-semibold'>{reason.title}</h3>
			<p className='text-muted-foreground text-sm leading-relaxed'>{reason.description}</p>
		</div>
	);
};

export default Reason;
