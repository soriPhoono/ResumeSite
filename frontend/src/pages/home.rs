use leptos::prelude::*;

use crate::widgets::footer::Footer;

#[component]
fn Header() -> impl IntoView {
    view! {
        <div class="relative bg-gradient-to-r from-purple-600 to-blue-600 h-screen text-white overflow-hidden">
            <div class="absolute inset-0">
                <img
                    src="https://images.unsplash.com/photo-1522252234503-e356532cafd5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHw2fHxjb2RlfGVufDB8MHx8fDE2OTQwOTg0MTZ8MA&ixlib=rb-4.0.3&q=80&w=1080"
                    alt="Background Image"
                    class="object-cover object-center w-full h-full"
                />
                <div class="absolute inset-0 bg-black opacity-50"></div>
            </div>

            <div class="relative z-10 flex flex-col justify-center items-center h-full text-center">
                <h1 class="text-5xl font-bold leading-tight mb-4">David Cohen</h1>
                <p class="text-lg text-gray-300 mb-8">
                    "Software developer - System administrator"
                </p>
                <a
                    href="/projects"
                    class="bg-yellow-400 text-gray-900 hover:bg-yellow-300 py-2 px-6 rounded-full text-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
                >
                    "Working summary"
                </a>
            </div>
        </div>
    }
}

#[component]
fn ProjectSnapshot(
    gh_url: String,
    logo: String,
    name: String,
    desc: impl IntoView,
) -> impl IntoView {
    view! {
        <a
            href=gh_url
            class="group relative bg-gray-800 transition hover:z-[1] hover:shadow-2xl  hover:shadow-gray-600/10"
        >
            <div class="relative space-y-8 py-12 p-8">
                <img
                    src=logo
                    loading="lazy"
                    width="200"
                    height="200"
                    class="w-12 h-12 rounded-full"
                    style="color:transparent"
                />
                <div class="space-y-2">
                    <h5 class="text-xl font-semibold text-white transition group-hover:text-secondary">
                        {name}
                    </h5>
                    <p class="text-gray-300">{desc}</p>
                </div>
            </div>
        </a>
    }
}

#[component]
fn ProjectsSnapshot() -> impl IntoView {
    view! {
        <div class="bg-gray-700 p-4 min-h-screen">
            <div
                aria-hidden="true"
                class="absolute inset-0 h-max w-full m-auto grid grid-cols-2 -space-x-52 opacity-20"
            >
                <div class="blur-[106px] h-56 bg-gradient-to-br  to-purple-400 from-blue-700"></div>
                <div class="blur-[106px] h-32 bg-gradient-to-r from-cyan-400  to-indigo-600"></div>
            </div>
            <div class="max-w-7xl mx-auto px-6 md:px-12 xl:px-6">
                <div class="md:w-2/3 lg:w-1/2 mt-12 text-gray-100">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        class="w-6 h-6 text-secondary"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z"
                            clip-rule="evenodd"
                        ></path>
                    </svg>
                    <h2 class="my-8 text-2xl font-bold text-white md:text-4xl">"My Work"</h2>
                    <p class="text-gray-300">
                        "I have built many projects and some of them are below"
                    </p>
                </div>
                <div class="mt-16 grid divide-x divide-y  divide-gray-700 overflow-hidden  rounded-3xl border text-gray-600 border-gray-700 sm:grid-cols-2 lg:grid-cols-4  lg:divide-y-0 xl:grid-cols-4">
                    <ProjectSnapshot
                        gh_url="https://github.com/soriPhoono/dotfiles".to_string()
                        logo="https://www.svgrepo.com/show/164986/logo.svg".to_string()
                        name="Homelab".to_string()
                        desc=view! {
                            <p>
                                <a class="underline" href="https://nixos.org">
                                    "NixOS"
                                </a>
                                " based custom Linux distribution complete with desktop platform, custom installer ISO, and home server capabilities to serve media content over a network, among other features."
                            </p>
                        }
                    />
                    <ProjectSnapshot
                        gh_url="https://github.com/soriPhoono/tailscale-gnome-qs".to_string()
                        logo="https://www.svgrepo.com/show/120852/logo.svg".to_string()
                        name="Gnome Tailscale support".to_string()
                        desc=view! {
                            <p>
                                "A quick-settings widget for the Gnome quick actions tray, providing support for "
                                <a class="underline" href="https://tailscale.com">
                                    "Tailscale"
                                </a>
                            </p>
                        }
                    />
                    <ProjectSnapshot
                        gh_url="https://github.com/soriPhoono/zmk-firmware".to_string()
                        logo="https://www.svgrepo.com/show/120850/logo.svg".to_string()
                        name="ZMK firmware".to_string()
                        desc=view! {
                            <p>
                                "A personal exploration of the "
                                <a class="underline" href="https://zmk.dev/">
                                    "ZMK firmware framework"
                                </a>
                                ", and handmade computer hardware. Currently supports a custom made Lilly58 keyboard from "
                                <a class="underline" href="https://typeractive.xyz">
                                    "Typeractive"
                                </a>
                            </p>
                        }
                    />
                    <ProjectSnapshot
                        gh_url="https://github.com/soriPhoono/ResumeSite".to_string()
                        logo="https://www.svgrepo.com/show/120853/logo.svg".to_string()
                        name="Resume".to_string()
                        desc="This website! Intended to convey my personal works".to_string()
                    />
                </div>
            </div>
        </div>
    }
}

#[component]
pub fn Home() -> impl IntoView {
    view! {
        <Header />
        <ProjectsSnapshot />
        <Footer />
    }
}
