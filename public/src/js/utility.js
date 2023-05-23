var dbPromise = idb.open("todo-store", 1, (db) => {
  if (!db.objectStoreNames.contains("todo-list")) {
    db.createObjectStore("todo-list", { keyPath: "id" });
  }
  if (!db.objectStoreNames.contains("sync-todo")) {
    db.createObjectStore("sync-todo", { keyPath: "id" });
  }
});

function writeData(st, data) {
  return dbPromise.then((db) => {
    let tx = db.transaction(st, "readwrite");
    let store = tx.objectStore(st);
    store.put(data);
    return tx.complete;
  });
}

function updateData(st, key, newValue) {
  return dbPromise.then((db) => {
    let tx = db.transaction(st, "readwrite");
    let store = tx.objectStore(st);
    store.delete(key);
    store.put(newValue);
    return tx.complete;
  });
}

function readAllData(st) {
  return dbPromise.then((db) => {
    let tx = db.transaction(st, "readonly");
    let store = tx.objectStore(st);
    return store.getAll();
  });
}

function readData(st, id) {
  return dbPromise.then((db) => {
    let tx = db.transaction(st, "readonly");
    let store = tx.objectStore(st);
    return store.get(id);
  });
}

function clearAllData(st) {
  return dbPromise.then((db) => {
    let tx = db.transaction(st, "readwrite");
    let store = tx.objectStore(st);
    store.clear();
    return tx.complete;
  });
}

function deleteItemFormData(st, id) {
  dbPromise
    .then((db) => {
      let tx = db.transaction(st, "readwrite");
      let store = tx.objectStore(st);
      store.delete(id);
      return tx.complete;
    })
    .then(() => console.log("Item deleted"));
}

function makeFormData(data) {
  let fd = new FormData(),
    keys = Object.keys(data);

  if (keys.length !== 0) {
    keys.forEach((key) => fd.append(key, data[key]));
  }

  return fd;
}
