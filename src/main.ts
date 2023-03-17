import init, { run_on_load } from "src-wasm";

init().then(() => {
	run_on_load();
});
