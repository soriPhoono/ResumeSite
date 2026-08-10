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
<html lang="en" class="scroll-smooth">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>sphoono — Software Engineer & Systems Architect</title>
		<meta name="description" content="Personal portfolio and resume of sphoono — Systems engineering, NixOS infrastructure, agentic AI development, and educational tech content." />
		<link rel="stylesheet" href="/styles.css" />
	</head>
	<body class="bg-sky-400 text-slate-800 font-sans selection:bg-emerald-500 selection:text-white antialiased overflow-x-hidden">
		<!-- Full-screen Background Canvas for Three.js 3D Garden -->
		<canvas id="bg" class="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"></canvas>

		<!-- Main Content Container -->
		<main class="relative z-10 max-w-4xl mx-auto px-6 space-y-[55vh] py-28">

			<!-- Hero Section with attached Ambient Sound Toggle -->
			<section class="relative min-h-[70vh] flex flex-col justify-center items-start space-y-6 bg-white/80 backdrop-blur-md border border-white/90 p-8 md:p-12 rounded-3xl shadow-2xl shadow-sky-900/15">
				<!-- Header Sound Control Button -->
				<div class="absolute top-6 right-6 z-20">
					<button id="audio-toggle" type="button" aria-label="Toggle Ambient Sound" class="px-3.5 py-1.5 bg-slate-100/90 hover:bg-white text-slate-800 border border-slate-200/90 rounded-full shadow-sm text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95">
						<span id="audio-icon" class="text-xs">🔊</span>
						<span id="audio-label">Sound On</span>
					</button>
				</div>
				<div class="flex flex-col md:flex-row items-center md:items-start gap-6 w-full">
					<img src="/pfp.jpg" alt="sphoono profile picture" class="w-32 h-32 md:w-36 md:h-36 rounded-2xl border-4 border-white shadow-lg object-cover ring-2 ring-emerald-500/40" />
					<div class="flex-1 text-center md:text-left space-y-3">
						<div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-600/30 text-emerald-800 text-xs font-semibold uppercase tracking-wider">
							✨ Systems Engineering & Agentic AI
						</div>
						<h1 class="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
							Hi, I'm <span class="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 bg-clip-text text-transparent">sphoono</span>
						</h1>
						<p class="text-slate-600 text-base md:text-lg max-w-xl leading-relaxed">
							Software engineer building declarative NixOS infrastructure, custom Terraform providers, autonomous agent systems, and educational tech tutorials.
						</p>
					</div>
				</div>
				<div class="pt-4 flex flex-wrap gap-4 w-full justify-center md:justify-start">
					<a href="#projects" class="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl transition-all duration-200 shadow-md shadow-emerald-700/20">
						View Projects &darr;
					</a>
					<a href="#about" class="px-6 py-3 bg-white/90 hover:bg-white text-slate-800 border border-slate-200/80 font-medium rounded-xl transition-all duration-200 shadow-sm">
						About Me
					</a>
				</div>
			</section>

			<!-- Projects Section -->
			<section id="projects" class="scroll-mt-[15vh] bg-white/80 backdrop-blur-md border border-white/90 p-8 md:p-12 rounded-3xl shadow-2xl shadow-sky-900/15 space-y-8">
				<div class="space-y-2">
					<div class="inline-flex items-center gap-2 text-emerald-700 font-semibold text-sm uppercase tracking-wider">
						🚀 Featured Repositories
					</div>
					<h2 class="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Open Source Projects</h2>
					<p class="text-slate-600">Selected work spanning custom infrastructure tooling, home server platforms, and declarative homelab environments.</p>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">

					<!-- Project 1 -->
					<div class="flex flex-col justify-between bg-slate-50/90 border border-slate-200/80 p-6 rounded-2xl hover:shadow-lg transition-shadow">
						<div class="space-y-3">
							<div class="flex items-center justify-between">
								<span class="text-xs font-mono font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md">Terraform / Go</span>
								<a href="https://github.com/soriPhoono/terraform-provider-k0s" target="_blank" rel="noopener noreferrer" class="text-slate-400 hover:text-slate-700 transition-colors" title="View Source on GitHub">
									<svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
								</a>
							</div>
							<h3 class="font-bold text-slate-900 text-lg">terraform-provider-k0s</h3>
							<p class="text-slate-600 text-sm leading-relaxed">
								Custom Terraform provider for provisioning k0s Docker-based Kubernetes clusters for testing the Guenivir platform.
							</p>
						</div>
						<a href="https://github.com/soriPhoono/terraform-provider-k0s" target="_blank" rel="noopener noreferrer" class="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 hover:text-emerald-800">
							View Repository &rarr;
						</a>
					</div>

					<!-- Project 2 -->
					<div class="flex flex-col justify-between bg-slate-50/90 border border-slate-200/80 p-6 rounded-2xl hover:shadow-lg transition-shadow">
						<div class="space-y-3">
							<div class="flex items-center justify-between">
								<span class="text-xs font-mono font-semibold text-teal-700 bg-teal-100 px-2.5 py-1 rounded-md">Server / Containers</span>
								<a href="https://github.com/soriPhoono/guenivir" target="_blank" rel="noopener noreferrer" class="text-slate-400 hover:text-slate-700 transition-colors" title="View Source on GitHub">
									<svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
								</a>
							</div>
							<h3 class="font-bold text-slate-900 text-lg">guenivir</h3>
							<p class="text-slate-600 text-sm leading-relaxed">
								Home server platform and automated infrastructure suite powering local cloud services.
							</p>
						</div>
						<a href="https://github.com/soriPhoono/guenivir" target="_blank" rel="noopener noreferrer" class="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-teal-700 hover:text-teal-800">
							View Repository &rarr;
						</a>
					</div>

					<!-- Project 3 -->
					<div class="flex flex-col justify-between bg-slate-50/90 border border-slate-200/80 p-6 rounded-2xl hover:shadow-lg transition-shadow">
						<div class="space-y-3">
							<div class="flex items-center justify-between">
								<span class="text-xs font-mono font-semibold text-sky-700 bg-sky-100 px-2.5 py-1 rounded-md">NixOS / IaC</span>
								<a href="https://github.com/soriPhoono/homelab" target="_blank" rel="noopener noreferrer" class="text-slate-400 hover:text-slate-700 transition-colors" title="View Source on GitHub">
									<svg class="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
								</a>
							</div>
							<h3 class="font-bold text-slate-900 text-lg">homelab</h3>
							<p class="text-slate-600 text-sm leading-relaxed">
								Declarative NixOS homelab managing 4 machines across 2 users with flakes, home-manager, and sops-nix secrets.
							</p>
						</div>
						<a href="https://github.com/soriPhoono/homelab" target="_blank" rel="noopener noreferrer" class="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-sky-700 hover:text-sky-800">
							View Repository &rarr;
						</a>
					</div>

				</div>
			</section>

			<!-- About Me Section -->
			<section id="about" class="scroll-mt-[15vh] bg-white/80 backdrop-blur-md border border-white/90 p-8 md:p-12 rounded-3xl shadow-2xl shadow-sky-900/15 space-y-8">
				<div class="space-y-2">
					<div class="inline-flex items-center gap-2 text-sky-700 font-semibold text-sm uppercase tracking-wider">
						💡 Background & Focus
					</div>
					<h2 class="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">About Me</h2>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-3 gap-6">

					<!-- Pillar 1: YouTube -->
					<div class="bg-slate-50/90 border border-slate-200/80 p-6 rounded-2xl space-y-3">
						<div class="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold text-xl">
							🎥
						</div>
						<h3 class="font-bold text-slate-900 text-lg">Tech YouTube Tutorials</h3>
						<p class="text-slate-600 text-sm leading-relaxed">
							Creating educational tech videos and hands-on tutorials on YouTube (<a href="https://youtube.com/@soriphoono" target="_blank" rel="noopener noreferrer" class="text-red-600 hover:underline font-medium">@soriphoono</a>), demystifying systems architecture, Nix, and developer tooling.
						</p>
					</div>

					<!-- Pillar 2: Agentic Dev & Software Engineering -->
					<div class="bg-slate-50/90 border border-slate-200/80 p-6 rounded-2xl space-y-3">
						<div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xl">
							🤖
						</div>
						<h3 class="font-bold text-slate-900 text-lg">Agentic AI & Engineering</h3>
						<p class="text-slate-600 text-sm leading-relaxed">
							Architecting autonomous agentic workflows, building scalable software in Hermetic Nix devshells, and crafting high-performance Cloudflare Edge applications.
						</p>
					</div>

					<!-- Pillar 3: Tutoring & Community Service -->
					<div class="bg-slate-50/90 border border-slate-200/80 p-6 rounded-2xl space-y-3">
						<div class="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xl">
							📚
						</div>
						<h3 class="font-bold text-slate-900 text-lg">Math & Science Tutoring</h3>
						<p class="text-slate-600 text-sm leading-relaxed">
							Dedicated to community service work as a Math and Science tutor, helping students build strong analytical foundations and master STEM subjects.
						</p>
					</div>

				</div>
			</section>

			<!-- Footer Section at Fountain Foot -->
			<footer id="socials" class="scroll-mt-[15vh] bg-white/90 backdrop-blur-md border border-white/90 p-8 md:p-10 rounded-3xl shadow-2xl shadow-sky-900/15 flex flex-col md:flex-row items-center justify-between gap-6">
				<div class="space-y-1 text-center md:text-left">
					<div class="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 uppercase tracking-wider mb-1">
						⛲ The Garden Fountain
					</div>
					<h3 class="font-bold text-slate-900 text-lg">sphoono</h3>
					<p class="text-slate-500 text-xs">Systems Engineer • Cloudflare Workers SSR • Three.js 3D Garden</p>
				</div>

				<div class="flex items-center gap-5">

					<!-- GitHub Link -->
					<a href="https://github.com/soriphoono/" target="_blank" rel="noopener noreferrer" class="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition-all shadow-sm" title="GitHub">
						<svg class="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
							<path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
						</svg>
					</a>

					<!-- YouTube Link -->
					<a href="https://youtube.com/@soriphoono" target="_blank" rel="noopener noreferrer" class="p-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all shadow-sm" title="YouTube">
						<svg class="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
							<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
						</svg>
					</a>

					<!-- Twitter Bird Logo Link (Classic Twitter Bird SVG) -->
					<a href="https://twitter.com/SPhoono" target="_blank" rel="noopener noreferrer" class="p-2.5 bg-sky-50 hover:bg-sky-100 text-sky-500 rounded-xl transition-all shadow-sm" title="Twitter">
						<svg class="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
							<path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
						</svg>
					</a>

				</div>
			</footer>

		</main>

		<!-- Client Bundle Script -->
		<script src="/main.js"></script>
		<script>
			// Smooth center scroll for internal anchor links
			document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
				anchor.addEventListener('click', function (e) {
					const targetId = this.getAttribute('href');
					if (targetId && targetId !== '#') {
						const targetEl = document.querySelector(targetId);
						if (targetEl) {
							e.preventDefault();
							targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
						}
					}
				});
			});

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
