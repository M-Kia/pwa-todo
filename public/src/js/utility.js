var dbPromise = idb.open("todo-store", 1, (db) => {
  if (!db.objectStoreNames.contains("todo-list")) {
    db.createObjectStore("todo-list", { keyPath: "_id" });
  }
  if (!db.objectStoreNames.contains("category-list")) {
    db.createObjectStore("category-list", { keyPath: "_id" });
  }
});

function writeData(st, data) {
  return dbPromise
    .then((db) => {
      let tx = db.transaction(st, "readwrite");
      let store = tx.objectStore(st);
      store.put(data);
      return tx.complete;
    })
    .catch((err) => console.log(err));
}

function updateData(st, key, newValue) {
  return dbPromise
    .then((db) => {
      let tx = db.transaction(st, "readwrite");
      let store = tx.objectStore(st);
      store.delete(key);
      store.put(newValue);
      return tx.complete;
    })
    .catch((err) => console.log(err));
}

function readAllData(st) {
  return dbPromise
    .then((db) => {
      let tx = db.transaction(st, "readonly");
      let store = tx.objectStore(st);
      return store.getAll();
    })
    .catch((err) => console.log(err));
}

function readData(st, id) {
  return dbPromise
    .then((db) => {
      let tx = db.transaction(st, "readonly");
      let store = tx.objectStore(st);
      return store.get(id);
    })
    .catch((err) => console.log(err));
}

function clearAllData(st) {
  return dbPromise
    .then((db) => {
      let tx = db.transaction(st, "readwrite");
      let store = tx.objectStore(st);
      store.clear();
      return tx.complete;
    })
    .catch((err) => console.log(err));
}

function deleteItemFormData(st, id) {
  dbPromise
    .then((db) => {
      let tx = db.transaction(st, "readwrite");
      let store = tx.objectStore(st);
      store.delete(id);
      return tx.complete;
    })
    .then(() => console.log("Item deleted"))
    .catch((err) => console.log(err));
}

function makeFormData(data) {
  let fd = new FormData(),
    keys = Object.keys(data);

  if (keys.length !== 0) {
    keys.forEach((key) => fd.append(key, data[key]));
  }

  return fd;
}
