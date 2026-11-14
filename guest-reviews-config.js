/* Guru Status Google Maps reviews connection.
 * Configure a browser-restricted Google Maps JavaScript API key on your published domain.
 * Enable Maps JavaScript API + Places API (New) and billing in Google Cloud.
 * Never use a server-secret/unrestricted key here.
 */
window.GURU_REVIEWS_CONFIG = {
  staticMode: true,
  demoMode: false, // Set false after official Google integration is ready
  googleMapsApiKey: "",
  googleMapsLink: "https://maps.app.goo.gl/315RQGAte3AaY53A8",
  expectedName: "GURU Status by GURU Holding",
  expectedAddress: "Angisa",
  // Optional: Google's official Places API place ID (ChIJ...); recommended to avoid ambiguous search.
  googlePlaceId: ""
};
