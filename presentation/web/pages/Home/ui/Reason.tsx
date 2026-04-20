interface IProps {
	title: string;
	description: React.ReactNode;
}

const Reason = ({ title, description }: IProps) => {
	return (
		<article className='border-border bg-card rounded-xl border p-6'>
			<h3 className='text-primary mb-2 font-semibold'>{title}</h3>
			<p className='text-muted-foreground text-sm leading-relaxed'>{description}</p>
		</article>
	);
};

export default Reason;
