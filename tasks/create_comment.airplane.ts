import airplane from 'airplane';

export default airplane.task(
	{
		slug: 'create_comment',
		envVars: { OPENAI_API_KEY: { config: 'OPENAI_API_KEY' } },
		resources: ['demo_db'],
		parameters: { comment: 'longtext' },
	},
	async (params) => {
		const { comment } = params;

		const getSentiment = airplane.ai.func(
			'Identify abusive and vulgar comments. Negative opinions are allowed but personal attacks are not.',
			[
				{
					input: 'This is fucking great!',
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
