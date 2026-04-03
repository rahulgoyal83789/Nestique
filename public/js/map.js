maptilersdk.config.apiKey = mapTocken; // Your Maptiler key

const map = new maptilersdk.Map({
  container: "map",
  style: maptilersdk.MapStyle.STREETS, // Replaces 'mapbox://styles/mapbox/streets-v12'
  center: listing.geometry.coordinates, // [lng, lat]
  zoom: 9,
});

const marker = new maptilersdk.Marker({ color: "red" })
    .setLngLat(listing.geometry.coordinates)
    .setPopup(
        new maptilersdk.Popup({ offset: 25 }).setHTML(
            `<h4>${listing.title}</h4><p>Exact Location will be provided after booking</p>`
        )
    )
    .addTo(map);