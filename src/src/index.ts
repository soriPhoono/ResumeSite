export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);

		if (url.pathname === '/api/random') {
			return new Response(JSON.stringify({ uuid: crypto.randomUUID(), timestamp: new Date().toISOString() }), {
				headers: { 'Content-Type': 'application/json' },
			});
		}

		// Server-Side Rendered (SSR) HTML Page
		const html = `<!doctype html>
<html lang="en" class="dark scroll-smooth">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Enchanted Garden — 3D Three.js Scroll SSR</title>
		<meta name="description" content="A server-side rendered Cloudflare Workers site featuring an interactive 3D Three.js garden scroll animation." />
		<link rel="stylesheet" href="/styles.css" />
	</head>
	<body class="bg-slate-900 text-slate-100 font-sans selection:bg-emerald-500 selection:text-white antialiased overflow-x-hidden">
		<!-- Full-screen Background Canvas for Three.js -->
		<canvas id="bg" class="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"></canvas>

		<!-- Main Content Container with Glassmorphism Overlays -->
		<main class="relative z-10 max-w-4xl mx-auto px-6 space-y-[75vh] py-32">
			
			<!-- Hero Section -->
			<section class="min-h-[70vh] flex flex-col justify-center items-start space-y-6 bg-slate-900/60 backdrop-blur-md border border-slate-700/50 p-8 md:p-12 rounded-3xl shadow-2xl">
				<div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
					⚡ Powered by Cloudflare Workers SSR + Three.js
				</div>
				<h1 class="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
					Journey Through <br /><span class="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">The 3D Garden</span>
				</h1>
				<p class="text-slate-300 text-lg md:text-xl max-w-2xl leading-relaxed">
					Scroll down to travel down the winding garden path. Built with server-side rendering on Cloudflare Edge, Tailwind CSS v4, and real-time WebGL 3D camera controls.
				</p>
				<div class="pt-4 flex flex-wrap gap-4">
					<a href="#about" class="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-emerald-900/30">
						Explore Garden &darr;
					</a>
					<button id="btn-api" type="button" class="px-6 py-3 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-600/50 font-medium rounded-xl transition-all duration-200 backdrop-blur-sm cursor-pointer">
						Test Edge API
					</button>
				</div>
				<output id="api-output" class="hidden text-sm font-mono bg-slate-950/80 border border-emerald-500/30 text-emerald-300 px-4 py-2 rounded-lg w-full break-all"></output>
			</section>

			<!-- About Section -->
			<section id="about" class="bg-slate-900/65 backdrop-blur-md border border-slate-700/50 p-8 md:p-12 rounded-3xl shadow-2xl space-y-6">
				<h2 class="text-3xl md:text-4xl font-bold text-white tracking-tight flex items-center gap-3">
					<span class="text-emerald-400">🌿</span> Garden Lore & Architecture
				</h2>
				<p class="text-slate-300 leading-relaxed">
					As you scroll, the camera moves along a smooth mathematical Catmull-Rom spline curve. Low-poly instanced trees, glowing pollen particles, and warm ambient light create a rich interactive experience.
				</p>
				<div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
					<div class="bg-slate-800/50 border border-slate-700/40 p-5 rounded-2xl">
						<h3 class="font-bold text-emerald-400 text-lg mb-1">SSR at Edge</h3>
						<p class="text-slate-400 text-sm">HTML served instantly from Cloudflare's global edge network.</p>
					</div>
					<div class="bg-slate-800/50 border border-slate-700/40 p-5 rounded-2xl">
						<h3 class="font-bold text-teal-400 text-lg mb-1">3D Scroll Sync</h3>
						<p class="text-slate-400 text-sm">Three.js camera coordinates bound to scroll progress.</p>
					</div>
					<div class="bg-slate-800/50 border border-slate-700/40 p-5 rounded-2xl">
						<h3 class="font-bold text-indigo-400 text-lg mb-1">Tailwind v4</h3>
						<p class="text-slate-400 text-sm">Styled with modern CSS utilities and glassmorphic aesthetics.</p>
					</div>
				</div>
			</section>

			<!-- Features / Showcase Section -->
			<section class="bg-slate-900/65 backdrop-blur-md border border-slate-700/50 p-8 md:p-12 rounded-3xl shadow-2xl space-y-6">
				<h2 class="text-3xl md:text-4xl font-bold text-white tracking-tight flex items-center gap-3">
					<span class="text-indigo-400">✨</span> Flora & Interactive Elements
				</h2>
				<p class="text-slate-300 leading-relaxed">
					Each turn of the garden reveals glowing point lights and subtle mouse parallax interaction. Easily extendable for personal portfolios, interactive stories, or 3D product showcases.
				</p>
			</section>

			<!-- Footer / Contact Section -->
			<section class="bg-slate-900/75 backdrop-blur-md border border-slate-700/50 p-8 md:p-12 rounded-3xl shadow-2xl text-center space-y-4">
				<h2 class="text-2xl md:text-3xl font-bold text-white">Reached the End of the Path</h2>
				<p class="text-slate-400 text-sm">
					Cloudflare Workers + Three.js Scroll Boilerplate. Built with precision.
				</p>
			</section>

		</main>

		<!-- Client Bundle Script -->
		<script src="/main.js"></script>
		<script>
			// Edge API test handler
			const btn = document.getElementById('btn-api');
			const out = document.getElementById('api-output');
			if (btn && out) {
				btn.addEventListener('click', async () => {
					btn.textContent = 'Fetching...';
					const res = await fetch('/api/random');
					const data = await res.json();
					out.textContent = JSON.stringify(data, null, 2);
					out.classList.remove('hidden');
					btn.textContent = 'Test Edge API Again';
				});
			}
		</script>
	</body>
</html>`;

		return new Response(html, {
			headers: {
				'Content-Type': 'text/html; charset=utf-8',
			},
		});
	},
} satisfies ExportedHandler<Env>;

