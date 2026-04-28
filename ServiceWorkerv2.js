const cacheVersion = "v0d1"
const corsAllowedURLs = [
	"https://fonts.gstatic.com/s/quantico/v19/rax-HiSdp9cPL3KIF7xrJD0.woff2",
	"https://fonts.cdnfonts.com/s/25041/1_MinecraftRegular1.woff",
	"https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbX2o-flEEny0FZhsfKu5WU4xD-Cw6nSGjW7BDEAQ.woff2",
	"https://fonts.gstatic.com/s/nunito/v32/XRXI3I6Li01BKofiOc5wtlZ2di8HDFwmdTQ3jw.woff2",
	"https://fonts.gstatic.com/s/tangerine/v18/Iurd6Y5j_oScZZow4VO5srNZi5FN.woff2",
]

const PopulateCache = async (fileList) => {
  const cache = await caches.open(cacheVersion)
	await cache.addAll(fileList)
}

const updateCache = async (eventReq) => {
	const cache = await caches.open(cacheVersion)
	try {
		let fetchResp;
		console.log(eventReq)
		if(corsAllowedURLs.includes(eventReq.url) || eventReq.destination === "font" ) {
			fetchResp = await fetch(eventReq)
		} else {
			fetchResp = await fetch(eventReq, { mode: 'no-cors'})
		}
		if(fetchResp && (fetchResp.ok || fetchResp.type === "opaque")) { //check if response is good
			await cache.put(eventReq, fetchResp.clone())
			return fetchResp.clone();
		} else {
			console.log("the fetch wasnt good :(", fetchResp,  eventReq.url)
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
				if(corsAllowedURLs.includes(eventReq.url)) {
					return await fetch(event.request)
				} else {
					return await fetch(event.request, { mode: 'no-cors'})
				}
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
