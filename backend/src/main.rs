use std::{env};
use rocket::fs::FileServer;

#[macro_use] extern crate rocket;

#[launch]
async fn rocket() -> _ {
    rocket::build().mount("/", FileServer::from("./backend/dist"))
}
