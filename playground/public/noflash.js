(function () {
  var storageKey = "theme";

  function setClassOnDocumentBody(isDark) {
    document.body.dataset.theme = isDark ? "dark" : "light";
    console.log("set to", document.body.dataset.theme);
  }

  var preferDarkQuery = "(prefers-color-scheme: dark)";
  var mql = window.matchMedia(preferDarkQuery);
  var supportsColorSchemeQuery = mql.media === preferDarkQuery;
  var localStorageTheme = null;
  try {
    localStorageTheme = localStorage.getItem(storageKey);
  } catch (err) {}
  var localStorageExists = localStorageTheme !== null;
  if (localStorageExists) {
    console.log("localStorage exists");
    localStorageTheme = JSON.parse(localStorageTheme);
    console.log("retrieved from ls: ", localStorageTheme);
  }

  // Determine the source of truth
  if (localStorageExists) {
    // source of truth from localStorage
    setClassOnDocumentBody(localStorageTheme);
  } else if (supportsColorSchemeQuery) {
    // source of truth from system
    console.log("No ls, but supports color scheme", mql.matches);
    setClassOnDocumentBody(mql.matches);
    localStorage.setItem(storageKey, mql.matches);
  } else {
    // source of truth from document.body
    console.log("last resort", document.body.dataset.theme);
    var isDarkMode = document.body.dataset.theme;
    localStorage.setItem(storageKey, JSON.stringify(isDarkMode));
  }
})();
