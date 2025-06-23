use leptos::prelude::*;

use crate::footer::Footer;

#[component]
fn AboutMe() -> impl IntoView {
    view! {
        <section class="min-h-screen bg-gray-700 text-white py-16 px-6 flex flex-col md:flex-row items-center justify-between gap-8">
            // <!-- Left Side: Image -->
            <div class="w-full md:w-5/12 flex justify-center h-full md:justify-end">
                <img
                    src="https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"
                    alt="About Me"
                    class="w-72 h-96 md:w-80 lg:w-96 object-cover rounded-lg shadow-lg"
                />
            </div>

            // <!-- Right Side: Text Content -->
            <div class="w-full md:w-7/12 text-center md:text-left relative">
                // <!-- Vertical Text -->
                <div class="absolute left-[40%] -top-6 md:-left-16  lg:top-0 md:top-6 rotate-0 md:rotate-[-90deg] text-sm tracking-widest">
                    <div class="flex items-center justify-center gap-2">
                        <div class="w-16 h-[2px] bg-white"></div>
                        <p>MORE ABOUT</p>
                    </div>
                </div>

                // <!-- Main Heading -->
                <h2 class="text-3xl md:text-5xl font-bold leading-tight mb-4 pl-10">
                    "A Passionate <br> Software Developer"
                </h2>

                // <!-- Description -->
                <p class="text-gray-300 mb-6 text-sm md:text-base leading-relaxed max-w-2xl mx-auto md:mx-0">
                    // Make time since began coding reactively update with time
                    "My name is David Cohen, I am a proficient IT and System Administration professional, additionally with extensive software development experience over 11+ years.
                    I have a large set of proficiencies with specialities including Linux system administration, software development with python, rust, c#, et al., and devops using the nix programming language.
                    I look forward to assisting you on your next project!"
                </p>

                // <!-- Buttons -->
                <div class="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                    <a
                        href="/projects"
                        class="border border-tertiary text-white font-semibold py-2 px-4 rounded-lg hover:bg-tertiary/10 text-center"
                    >
                        "See Projects"
                    </a>
                </div>
            </div>
        </section>
    }
}

#[component]
pub fn About() -> impl IntoView {
    view! {
        <AboutMe />
        <Footer />
    }
}
