import {
	Stack,
	Table,
	Heading,
	useComponentState,
	Checkbox,
	CheckboxState,
	useTaskQuery,
} from '@airplane/views';
import airplane from 'airplane';

// Views documentation: https://docs.airplane.dev/views/getting-started
const CommentDashboard = () => {
	const { id, checked } = useComponentState<CheckboxState>();
	const unflagged = useTaskQuery({ slug: 'list_unflagged_comments' });
	const flagged = useTaskQuery({ slug: 'list_flagged_comments' });

	return (
		<Stack>
			<Heading>Comment Moderation</Heading>
			<Table
				title="Approved Comments"
				task={'list_unflagged_comments'}
				defaultPageSize={20}
				hiddenColumns={['id', 'flagged']}
				rowActions={{
					slug: 'flag_comment',
					label: 'flag',
					onSuccess: () => flagged.refetch(),
				}}
			/>
			<Checkbox
				id={id}
				label="Show flagged comments (view at your own risk!)"
			/>
			{checked ? (
				<Table
					title="Flagged Comments"
					task="list_flagged_comments"
					hiddenColumns={['id']}
					rowActions={[
						{
							slug: 'unflag_comment',
							label: 'unflag',
							onSuccess: () => unflagged.refetch(),
						},
						{
							slug: 'delete_comment',
							label: 'delete',
							confirm: true,
							onSuccess: () => unflagged.refetch(),
						},
					]}
				/>
			) : null}
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
