use wasm_bindgen::prelude::*;
use web_sys::console;

#[wasm_bindgen]
pub fn run_on_load() {
    if let Err(e) = write_response() {
        console::log_1(&e);
    }
}

fn write_response() -> Result<(), JsValue> {
    console::log_1(&"WASM loaded".into());
    Ok(())
}
