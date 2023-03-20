import init, { run_on_load } from "src-wasm";
import { invoke } from "@tauri-apps/api/tauri"

interface Bookmark {
	info: string
	url: string
	uuid: string
	tag: Array<string>
}

interface Category {
	info: string
	name: string
	subcategory: Array<Category>
}

interface LoadedData {
	bookmark: Array<Bookmark>
	Category: Array<Category>
	tag: Array<string>
}

init().then(() => {
	run_on_load()
})

document.querySelector("#open-btn")?.addEventListener("click", () => {
	invoke("open_bookmark_file").then(loaded => {
		const content = <LoadedData>loaded
		const list = <HTMLUListElement>document.querySelector("ul#bookmark-list")

		console.log(content)
		for (let bookmark of content.bookmark) {
			const link = document.createElement("a")
			link.textContent = bookmark.url;
			link.href = bookmark.url

			const info = document.createElement("p")
			info.textContent = bookmark.info;

			const row = document.createElement("li")
			row.append(info, link)

			list.append(row)
		}
	}).catch(e => {
		console.log(e)
	})
})
