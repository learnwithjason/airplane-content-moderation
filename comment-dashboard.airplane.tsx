import {
	Stack,
	Table,
	Heading,
	useComponentState,
	Checkbox,
	CheckboxState,
	Button,
	useTaskQuery,
} from '@airplane/views';
import airplane from 'airplane';

// Views documentation: https://docs.airplane.dev/views/getting-started
const CommentDashboard = () => {
	const { id, checked } = useComponentState<CheckboxState>();
	const { refetch } = useTaskQuery({ slug: 'list_comments' });

	return (
		<Stack>
			<Heading>Comment Moderation</Heading>
			<Checkbox
				id={id}
				label="Show flagged comments (view at your own risk!)"
			/>
			<Table
				title="All Comments"
				task="list_comments"
				defaultPageSize={30}
				hiddenColumns={['id']}
				outputTransform={(data) =>
					data.filter((row) => checked || !row.flagged)
				}
				rowActions={({ row }) => {
					const action = row.flagged ? 'unflag' : 'flag';

					return (
						<Button
							variant="subtle"
							task={{
								slug: `${action}_comment`,
								params: { id: row.id },
								onSuccess: () => refetch(),
							}}
						>
							{action}
						</Button>
					);
				}}
			/>
		</Stack>
	);
};

export default airplane.view(
	{
		slug: 'comment_dashboard',
		name: 'Comment Dashboard',
	},
	CommentDashboard,
);
