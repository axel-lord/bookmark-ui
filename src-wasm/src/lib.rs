use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn run_on_load() {
    let _ = write_response();
}

fn write_response() -> Option<()> {
    web_sys::window()?
        .document()?
        .get_element_by_id("response")?
        .set_inner_html("Written by WASM");

    Some(())
}
