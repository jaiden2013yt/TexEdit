cacheVersion = "v0d1"

const PopulateCache = async (fileList) => {
  const cache = await caches.open(cacheVersion)
	await cache.addAll(fileList)
}

const updateCache = async (eventResp) => {
	const cache = await caches.open(cacheVersion)
	try {
		const fetchResp = await fetch(eventResp)
		if(fetchResp && fetchResp.ok) { //check if response is good
		await cache.put(eventResp, fetchResp.clone())
		}
	} catch(eggies) {
		console.log("a error occorder while saving a file into cache (updateCache function): ", eventResp.url, " | ", eggies)
	}
}

self.addEventListener("install", (event) => {
	event.waitUntil(
  	PopulateCache(["index.html",])
	)
})

self.addEventListener("fetch",  (event) => {
	if(event.request.method !== "GET") {
		console.log("non GET resquest made"), event.request.method, event.request.url)
		return; //no value set so we arent overriding anytying.
	}
	
	event.respondWith(async () => {
  	console.log("Handling fetch event for", event.request.url);
		const cachedAsset = await caches.match(event.request)
		if(cachedAsset === undefined) {
			return fetch(event.request)
		}
		return cachedAsset
	}())
	event.waitUntil(
		updateCache(event.request)
	)
	return; //not needed
	
});
