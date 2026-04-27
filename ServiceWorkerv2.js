const cacheVersion = "v0d1"

const PopulateCache = async (fileList) => {
  const cache = await caches.open(cacheVersion)
	await cache.addAll(fileList)
}

const updateCache = async (eventReq) => {
	const cache = await caches.open(cacheVersion)
	try {
		const fetchResp = await fetch(eventReq, { mode: 'no-cors'})
		if(fetchResp && fetchResp.ok) { //check if response is good
			await cache.put(eventReq, fetchResp.clone())
			return fetchResp.clone();
		}
	} catch(eggies) {
		console.log("a error occorder while saving a file into cache (updateCache function): ", eventReq.url, " | ", eggies)
		 return new Response("Network error happened", {
      status: 408,
      headers: { "Content-Type": "text/plain" },
    }); //we should actually be returning a 404 not found i think
	}
}



self.addEventListener("install", (event) => {
	event.waitUntil(
  	PopulateCache(["index.html",])
	)
})

self.addEventListener("fetch",  (event) => {
	if(event.request.method !== "GET") {
		console.log("non GET resquest made", event.request.method, event.request.url)
		return; //no value set so we arent overriding anytying.
	}
	//let isCache = false;
	
	event.respondWith((async () => {
  	console.log("Handling fetch event for", event.request.url);
		const cachedAsset = await caches.match(event.request)
		if(cachedAsset === undefined) {
			try {
				return await fetch(event.request, { mode: 'no-cors'})
			} catch(buniiesUwU) {
				console.log("failed to fetch asset: ", buniiesUwU)
			}
		}
		//isCache = true
		return cachedAsset
	})())
	
	event.waitUntil(
		updateCache(event.request)
	)
	return; //not needed
	
});
