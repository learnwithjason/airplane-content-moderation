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
	const { refetch: refetchUnflaggedComments } = useTaskQuery({
		slug: 'list_unflagged_comments',
	});
	const { refetch: refetchFlaggedComments } = useTaskQuery({
		slug: 'list_flagged_comments',
	});

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
					onSuccess: () => refetchFlaggedComments(),
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
							onSuccess: () => refetchUnflaggedComments(),
						},
						{
							slug: 'delete_comment',
							label: 'delete',
							confirm: true,
							onSuccess: () => refetchUnflaggedComments(),
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
