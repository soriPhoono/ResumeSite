use rocket::{fs::FileServer, launch};

#[launch]
fn rocket() -> _ {
    rocket::build().mount("/", FileServer::from("backend/dist"))
}
