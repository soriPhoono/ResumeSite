mod pages;
mod widgets;

use leptos::prelude::*;
use leptos_router::{components::*, path};

use pages::{about::About, home::Home, projects::Projects};

fn main() {
    console_error_panic_hook::set_once();
    mount_to_body(App);
}

#[component]
fn App() -> impl IntoView {
    view! {
        <Router>
            <nav>
                <div class="navbar fg-primary text-primary-content">
                    <div class="navbar-start">
                        <a href="/" class="btn btn-ghost text-xl">
                            "David Cohen"
                        </a>
                    </div>
                    <div class="navbar-end">
                        <a href="/" class="btn btn-ghost">
                            "Home"
                        </a>
                        <a href="/projects" class="btn btn-ghost">
                            "Projects"
                        </a>
                        <a href="/about" class="btn btn-ghost">
                            "About"
                        </a>
                    </div>
                </div>
            </nav>
            <main>
                <Routes fallback=|| "Not found.">
                    <Route path=path!("/") view=Home />
                    <Route path=path!("/projects") view=Projects />
                    <Route path=path!("/about") view=About />
                </Routes>
            </main>
        </Router>
    }
}
