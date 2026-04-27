const PopulateCache = async (fileList) => {
  const cache = await caches.open("v0d1")
	await cache.addAll(fileList)
}

self.addEventListener("install", (event) => {
  PopulateCache(["index.html",])

})

self.addEventListener("fetch", (event) => {
  console.log("Handling fetch event for", event.request.url);
});
