export function getDataWithJSON(callback, username, password, requestUrl) {
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  xhr.open("GET", "https://serene-ravine-70062.herokuapp.com/" + requestUrl);
  setAuthorizationHeader(xhr, username, password);
  xhr.setRequestHeader("x-requested-with", "love");
  xhr.send();
  xhr.onload = function(response) {
    if (this.status === 401) {
      callback(this.status);
    } else {
      callback(response);
    }
  };
}
function setAuthorizationHeader(xhr, username, password) {
  var authHeader = "Basic " + btoa(username + ":" + password);
  xhr.setRequestHeader("Authorization", authHeader);
}
