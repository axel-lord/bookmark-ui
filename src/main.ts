import init, {run_on_load} from "src-wasm";
import {invoke} from "@tauri-apps/api/tauri"

const BODY = <HTMLBodyElement>document.querySelector("body");

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
	category: Array<Category>
	tag: Array<string>
}

init().then(() => {
	run_on_load()
})

const createListSection = (title: string): [HTMLElement, HTMLUListElement] => {
	const section = document.createElement("section")
	section.classList.add("list-section")

	const checkbox = document.createElement("input")
	checkbox.type = "checkbox"

	const heading = document.createElement("h1")
	heading.textContent = title

	const list = document.createElement("ul")

	section.append(checkbox, heading, list)

	return [section, list]
}

const createBookmarkSection = (bookmarks: Array<Bookmark>): HTMLElement => {
	const [section, list] = createListSection("Bookmarks")
	section.classList.add("bookmark-list")

	// Add bookmarks
	for (let bookmark of bookmarks) {
		const link = document.createElement("p")
		link.textContent = bookmark.url;
		link.classList.add("bookmark-url")

		const info = document.createElement("p")
		info.textContent = bookmark.info;
		info.classList.add("bookmark-info")

		const collapse = document.createElement("button")
		collapse.textContent = "Collapse"
		collapse.classList.add("item-collapse")

		const openUrl = document.createElement("button")
		openUrl.textContent = "Open"
		openUrl.classList.add("open-url")

		const row = document.createElement("li")
		row.append(info, link, collapse, openUrl)

		openUrl.addEventListener("click", () => {
			invoke("open_in_browser", {link: bookmark.url})
				.then(() => {
					console.log(`opened ${bookmark.info}`)
				}).catch(e => {
					console.log(e)
				})
		})

		collapse.addEventListener("click", () => {
			row.classList.remove("extended")
		})

		row.addEventListener("contextmenu", event => {
			if (!row.classList.contains("extended")) {
				event.preventDefault()
				row.classList.toggle("extended")
			}
		})

		list.append(row)
	}

	return section
}

const createCategoryListItem = (catogry: Category): HTMLLIElement => {
	const listItem = document.createElement("li")

	const name = document.createElement("p")
	name.textContent = catogry.name

	listItem.append(name)

	return listItem
}

const createCategorySection = (categories: Array<Category>): HTMLElement => {
	const [section, list] = createListSection("Categories")
	section.classList.add("category-list")

	// Add Categories
	for (let category of categories) {
		list.append(createCategoryListItem(category))
	}

	return section
}

document.querySelector("#open-btn")?.addEventListener("click", () => {
	invoke("open_bookmark_file").then(loaded => {
		const content = <LoadedData>loaded

		// log the content
		console.log(content)

		// create sections
		const categorySection = createCategorySection(content.category)
		const bookmarkSection = createBookmarkSection(content.bookmark)

		// Append section to body
		BODY.append(categorySection, bookmarkSection)
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
	BODY.scrollTo({
		top: 0,
		left: 0,
		behavior: "smooth",
	})
})

document.querySelector("#discard-bookmarks")?.addEventListener("click", () => {
	document.querySelector("#bookmark-list ul")?.replaceChildren()
})
