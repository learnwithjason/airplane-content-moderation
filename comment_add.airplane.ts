import airplane from 'airplane';

export default airplane.task(
	{
		slug: 'comment_add',
		name: 'Add a comment',
		description:
			'Save a new comment in the database. Includes a step to check for abusive comments and flag them to limit problematic content from becoming visible.',
		parameters: {
			comment: {
				name: 'comment',
				type: 'shorttext',
			},
		},
		resources: ['demo_db'],
		envVars: {
			OPENAI_API_KEY: {
				config: 'OPENAI_API_KEY',
			},
		},
	},
	async (params) => {
		const { comment } = params;

		const getSentiment = airplane.ai.func(
			'Identify abusive and vulgar comments. Negative opinions are allowed but personal attacks are not.',
			[
				{
					input: 'This is the shit!',
					output: { flagged: false, sentiment: 'positive' },
				},
				{
					input: 'You are stupid!',
					output: { flagged: true, sentiment: 'negative' },
				},
				{
					input: 'Burgers are gross',
					output: { flagged: false, sentiment: 'negative' },
				},
			],
		);

		const { output, confidence } = await getSentiment(comment);

		if (typeof output === 'string') {
			return { message: 'unparseable input' };
		}

		const res = await airplane.sql.query(
			'demo_db',
			'INSERT INTO comments (comment, flagged) VALUES (:comment, :flagged);',
			{ args: { comment, flagged: output.flagged } },
		);

		console.log(res);

		let message = `Your comment was saved. The sentiment was read as ${output.sentiment}.`;
		if (output.flagged === true && confidence >= 0.75) {
			message = 'Wow, you kiss your mother with that mouth?';
		}

		return { message, flagged: output.flagged };
	},
);
