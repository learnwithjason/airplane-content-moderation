import { setTimeout } from 'timers/promises';

export async function airplane(
	endpoint: string,
	{ body, method = 'POST' }: { body?: {}; method?: 'POST' | 'GET' },
) {
	let url = `https://api.airplane.dev/v0${endpoint}`;
	const config: RequestInit = {
		method,
		headers: {
			'X-Airplane-API-Key': import.meta.env.AIRPLANE_API_KEY,
		},
	};

	if (method === 'POST') {
		config.body = JSON.stringify(body);
	}

	const res = await fetch(url, config);

	if (!res.ok) {
		throw new Error(res.statusText);
	}

	return res.json();
}

export async function isRunCompleted(runID: string): Promise<void> {
	// add a brief wait to allow Airplane to finish the run
	await setTimeout(200, () => {});
	const res = await airplane(`/runs/get?id=${runID}`, {
		method: 'GET',
	});

	if (res.status === 'Failed') {
		throw new Error(`Run ${runID} failed.`);
	} else if (res.status !== 'Succeeded') {
		// if the run isn’t complete yet, run again to wait a bit longer
		console.log(`Run status: ${res.status} — waiting...`);
		await isRunCompleted(runID);
	} else {
		console.log(`Run status: ${res.status}`);
	}
}

export async function checkAndSaveComment(comment: string) {
	try {
		const { runID } = await airplane('/tasks/execute', {
			body: {
				slug: 'create_comment',
				paramValues: { comment },
			},
		});

		await isRunCompleted(runID);

		const { output } = await airplane(`/runs/getOutputs?id=${runID}`, {
			method: 'GET',
		});

		return {
			message: output.message,
			isFlagged: output.flagged,
		};
	} catch (err) {
		return {
			message: 'There was an error saving your comment. Please try again.',
			isFlagged: true,
		};
	}
}

export async function loadApprovedComments() {
	try {
		const { runID } = await airplane('/tasks/execute', {
			body: {
				slug: 'list_unflagged_comments',
				resources: { db: 'demo_db' },
			},
		});

		await isRunCompleted(runID);

		const { output } = await airplane(`/runs/getOutputs?id=${runID}`, {
			method: 'GET',
		});

		return output.Q1 ?? [];
	} catch (err) {
		return [];
	}
}
