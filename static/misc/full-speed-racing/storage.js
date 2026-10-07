class SimpleStorage {
  getItem(key) {
    return localStorage.getItem(key);
  }

  setItem(key, value) {
    localStorage.setItem(key, value);
  }

  removeItem(key) {
    localStorage.removeItem(key);
  }

  clear() {
    localStorage.clear();
  }

  key(index) {
    return localStorage.key(index);
  }

  get length() {
    return localStorage.length;
  }
}

// Ð—Ð°Ð¼ÐµÐ½ÑÐµÐ¼ GameSnacks.storage
window.GameSnacks = window.GameSnacks || {};
window.GameSnacks.storage = new SimpleStorage();