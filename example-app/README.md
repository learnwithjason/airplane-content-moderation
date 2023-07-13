# Airplane Content Moderation Example App

This app is an [Astro](https://astro.build) one-pager that loads comments from Airplane's demo DB and allows submitting new comments, which are auto-moderated using Airplane's built-in integration with OpenAI.

## How to run this demo

To run this demo, create an Airplane API key using the following command:

```bash
airplane apikeys create <token name>
```

Create `.env` by copying `.env.EXAMPLE` and replace the API key value with the one you just generated.

With that in place, start the app by running `npm run dev`.
