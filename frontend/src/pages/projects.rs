use leptos::prelude::*;

use crate::widgets::footer::Footer;

#[component]
fn ProjectDisplay(
    img_pos: String,
    img_url: String,
    img_alt: String,
    project_url: String,
    title: impl IntoView,
    about: impl IntoView,
) -> impl IntoView {
    if img_pos == "left" {
        view! {
            <div class="flex flex-wrap items-center mt-20 text-left text-center">
                <div class="w-full md:w-3/5 lg:w-1/2 px-4">
                    <a href=project_url>
                        <img
                            src=img_url
                            alt=img_alt
                            class="inline-block rounded shadow-lg border border-merino-400"
                        />
                    </a>
                </div>
                <div class="w-full md:w-2/5 lg:w-1/2 px-4 text-center md:text-left lg:pl-12">
                    <h3 class="font-bold mt-8 text-xl md:mt-0 sm:text-2xl">{title}</h3>
                    <p class="sm:text-lg mt-6">{about}</p>
                </div>
            </div>
        }
    } else {
        view! {
            <div class="flex flex-wrap items-center mt-20 text-left text-center">
                <div class="w-full md:w-3/5 lg:w-1/2 px-4">
                    <a href=project_url>
                        <img
                            src=img_url
                            alt=img_alt
                            class="inline-block rounded shadow-lg border border-merino-400"
                        />
                    </a>
                </div>
                <div class="w-full md:w-2/5 lg:w-1/2 px-4 md:order-first text-center md:text-left lg:pr-12">
                    <h3 class="font-bold mt-8 text-xl md:mt-0 sm:text-2xl">{title}</h3>
                    <p class="sm:text-lg mt-6">{about}</p>
                </div>
            </div>
        }
    }
}

#[component]
fn ProjectDisplays() -> impl IntoView {
    view! {
        <div class="text-center p-8 bg-gray-700">
            <h2 class="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                "Personal portfolio"
            </h2>

            <ProjectDisplay
                img_pos="left".to_string()
                img_url="https://images.unsplash.com/photo-1624705013726-8cb4f9415f40?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    .to_string()
                img_alt="Desktop and gaming computer with RGB lights".to_string()
                project_url="https://github.com/soriphoono/dotfiles".to_string()
                title="HomeLab Dotfiles"
                about=view! {
                    <p>
                        <a class="underline" href="https://nixos.org">
                            "NixOS"
                        </a>
                        " based custom Linux distribution complete with desktop platform, custom installer ISO, and home server capabilities to serve media content over a network, among other features."
                    </p>
                }
            />
            <ProjectDisplay
                img_pos="right".to_string()
                img_url="https://images.unsplash.com/photo-1603985529862-9e12198c9a60?q=80&w=1161&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    .to_string()
                img_alt="Man holding phone running a VPN program".to_string()
                project_url="https://github.com/soriPhoono/tailscale-gnome-qs".to_string()
                title="Gnome tailscale support"
                about=view! {
                    <p>
                        "A quick-settings widget for the Gnome quick actions tray, providing support for "
                        <a class="underline" href="https://tailscale.com">
                            "Tailscale"
                        </a>
                    </p>
                }
            />
            <ProjectDisplay
                img_pos="left".to_string()
                img_url="https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    .to_string()
                img_alt="Keyboard on marble desk".to_string()
                project_url="https://github.com/soriPhoono/zmk-firmware".to_string()
                title="ZMK firmware"
                about=view! {
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
            <ProjectDisplay
                img_pos="right".to_string()
                img_url="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    .to_string()
                img_alt="Code on a laptop screen".to_string()
                project_url="https://github.com/soriPhoono/ResumeSite".to_string()
                title="Resume Page"
                about="This website! Intended to convey my personal works"
            />
        </div>
    }
}

#[component]
pub fn Projects() -> impl IntoView {
    view! {
        <ProjectDisplays />
        <Footer />
    }
}
