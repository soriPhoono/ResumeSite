use leptos::prelude::*;

#[component]
pub fn ButtonBorder(link: String, label: String) -> impl IntoView {
    view! {
        <a
            href=link
            class="border border-tertiary text-white font-semibold py-2 px-4 rounded-lg hover:bg-tertiary/10 text-center"
        >
            {label}
        </a>
    }
}
