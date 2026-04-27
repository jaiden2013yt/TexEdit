const cacheVersion = "v0d1"

const PopulateCache = async (fileList) => {
  const cache = await caches.open(cacheVersion)
	await cache.addAll(fileList)
}

const updateCache = async (eventReq) => {
	return new Promise((resolve, Rejecct) => {
	const cache = await caches.open(cacheVersion)
	try {
		const fetchResp = await fetch(eventReq)
		if(fetchResp && fetchResp.ok) { //check if response is good
		await cache.put(eventReq, fetchResp.clone())
		 resolve(fetchResp.clone());
	}
	} catch(eggies) {
		console.log("a error occorder while saving a file into cache (updateCache function): ", eventReq.url, " | ", eggies)
		 resolve(new Response("Network error happened", {
      status: 408,
      headers: { "Content-Type": "text/plain" },
    })); //we should actually be returning a 404 not found i think
	}
	})
}

const reGetCache = async (request) => {
	return new Promise((resolve, reject) => {
		
	try {
	const cache = await caches.open(cacheVersion)
	const fish = await caches.match(request)
	if (fish === undefined) {
		resolve();
	}
	const fetchResp = await fetch(request)
	if(fetchResp && fetchResp.ok) { //check if response is good
	await cache.put(request, fetchResp)
	resolve()
	} catch(een) {
		console.log(een)
		resolve()
	}
	})
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
			return await updateCache(event.request)
		}
		//isCache = true
		return cachedAsset
	})())
	
	event.waitUntil(
		updateCache(event.request)
	)
	return; //not needed
	
});
