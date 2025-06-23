use leptos::prelude::*;

#[component]
pub fn Footer() -> impl IntoView {
    view! {
        <div class="flex flex-col">
            <div class="fg-primary text-white py-4">
                <div class="container mx-auto text-center">
                    <p>"© 2025 David Cohen. All rights reserved."</p>
                </div>
            </div>
        </div>
    }
}
