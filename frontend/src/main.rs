use leptos::prelude::*;

fn main() {
    console_error_panic_hook::set_once();
    mount_to_body(App);
}

#[component]
fn App() -> impl IntoView {
    let (count, set_count) = signal(0);
    let double_count = move || count.get() * 2;
    
    view! {
        <button
            on:click=move |_| {
                *set_count.write() += 1;
            }
        >
            "Click me:"
            {count}
        </button>
        <p>
            "Double count:"
            {double_count}
        </p>
        <progress
            max="50"
            value=count
        />
        <progress
            max="50"
            value=double_count
        />
    }
}
