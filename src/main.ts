import init, {run_on_load} from "src-wasm";
import {invoke} from "@tauri-apps/api/tauri"

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
		const list = <HTMLUListElement>document.querySelector(".bookmark-list ul")

		console.log(content)
		for (let bookmark of content.bookmark) {
			const link = document.createElement("p")
			link.textContent = bookmark.url;
			//link.href = bookmark.url

			const info = document.createElement("p")
			info.textContent = bookmark.info;

			const row = document.createElement("li")
			row.append(info, link)

			row.addEventListener("mouseup", event => {
				if (event.button == 0) {
					invoke("open_in_browser", {link: bookmark.url})
						.then(() => {
							console.log(`opened ${bookmark.info}`)
						}).catch(e => {
							console.log(e)
						})
				}
			})

			row.addEventListener("contextmenu", event => {
				event.preventDefault()
				row.classList.toggle("extended")
			})

			list.append(row)
		}
	}).catch(e => {
		console.log(e)
	})
})

document.querySelector("button#collapse-all")?.addEventListener("click", () => {
	document.querySelectorAll(".extended").forEach(element => {
		element.classList.remove("extended")
	})
})

document.querySelector("#reset-scroll")?.addEventListener("click", () => {
	document.querySelector("body")?.scrollTo({
		top: 0,
		left: 0,
		behavior: "smooth",
	})
})

document.querySelector("#discard-bookmarks")?.addEventListener("click", () => {
	document.querySelector("#bookmark-list ul")?.replaceChildren()
})
