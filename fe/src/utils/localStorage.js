const userProfileKey = "user";

export function getCurrentUserState() {
  if (typeof localStorage !== "undefined") {
    const data = localStorage.getItem(userProfileKey);
    return JSON.parse(data);
  }
}
export function getUserProfile() {
  if (typeof localStorage !== "undefined") {
    const data = localStorage.getItem(userProfileKey);
    return JSON.parse(data);
  }
}
