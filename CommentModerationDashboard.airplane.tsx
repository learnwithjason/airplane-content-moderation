import {
	type CheckboxState,
	Heading,
	Stack,
	Table,
	Checkbox,
	useComponentState,
	useTaskQuery,
} from '@airplane/views';
import airplane from 'airplane';

const CommentModerationDashboard = () => {
	const { id, checked } = useComponentState<CheckboxState>();
	const flagged = useTaskQuery('comments_list_flagged');
	const approved = useTaskQuery('comments_list_approved');

	return (
		<Stack>
			<Heading>Comment Moderation Dashboard</Heading>

			<Table
				title="Approved Comments"
				task="comments_list_approved"
				defaultPageSize={20}
				hiddenColumns={['flagged']}
				rowActions={{
					slug: 'comment_flag',
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
					task="comments_list_flagged"
					defaultPageSize={20}
					hiddenColumns={['flagged']}
					rowActions={[
						{
							slug: 'comment_approve',
							label: 'approve',
							onSuccess: () => approved.refetch(),
						},
						{
							slug: 'comment_delete',
							label: 'delete',
							onSuccess: () => approved.refetch(),
						},
					]}
				/>
			) : null}
		</Stack>
	);
};

export default airplane.view(
	{
		slug: 'comment_moderation_dashboard',
		name: 'Comment Moderation Dashboard',
		description:
			"Allows admins to see all approved comments, and optionally see flagged comments. They're also able to change the approved/flagged state of a comment and delete comments permanently.",
	},
	CommentModerationDashboard,
);
