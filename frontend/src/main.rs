use leptos::prelude::*;

fn main() {
    console_error_panic_hook::set_once();
    mount_to_body(App);
}

#[component]
fn App() -> impl IntoView {
    view! {
        <div class="navbar bg-primary text-primary-content">
            <div class="navbar-start">
                <a href="/" class="btn btn-ghost text-xl">
                    daisyUI
                </a>
            </div>

            <div class="navbar-end">
                <a href="/" class="btn btn-ghost">
                    Home
                </a>
                <a href="/about" class="btn btn-ghost">
                    About
                </a>
            </div>
        </div>
    }
}
