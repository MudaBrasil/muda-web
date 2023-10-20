// Sentry.init({
// 	app,
// 	enabled: import.meta.env.MODE === 'production',
// 	environment: import.meta.env.MODE,
// 	dsn: 'https://e56e2192fb1ed5c1156526bf674cc6f4@o4505745942708224.ingest.sentry.io/4505745945460736',
// 	integrations: [
// 		new Sentry.BrowserTracing({
// 			// Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
// 			tracePropagationTargets: ['localhost', 'https://muda.education/'],
// 			routingInstrumentation: Sentry.vueRouterInstrumentation(router)
// 		}),
// 		new Sentry.Replay()
// 	],
// 	// Performance Monitoring
// 	tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
// 	// Session Replay
// 	replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
// 	replaysOnErrorSampleRate: 1.0 // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
// })
