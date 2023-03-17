use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn run_on_load(name: &str) {
    let _ = write_response(name);
}

fn write_response(name: &str) -> Option<()> {
    web_sys::window()?
        .document()?
        .get_element_by_id("response")?
        .set_inner_html(name);

    Some(())
}
