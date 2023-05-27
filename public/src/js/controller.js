class Connection {
  static apiRoute = "/api";

  static get(apiName, query = {}) {
    return new Promise((resolve, reject) => {
      fetch(
        `${this.apiRoute}/${apiName}${
          Object.keys(query).length !== 0
            ? "?" + new URLSearchParams(query).toString()
            : ""
        }`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      )
        .then((res) => res.json())
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  }

  static add(body, apiName) {
    return new Promise((resolve, reject) => {
      fetch(`${this.apiRoute}/${apiName}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
      })
        .then((res) => res.json())
        .then((res) => {
          if (!!res.status) {
            // console.log("Record was added");
            resolve(res);
          } else {
            // console.log("Error in inserting Record!");
            resolve("Error in inserting Record!");
          }
        })
        .catch((err) => {
          // console.log(err);
          reject(err);
        });
    });
  }

  static update(id, body, apiName) {
    return new Promise((resolve, reject) => {
      fetch(`${this.apiRoute}/${apiName}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
      })
        .then((res) => res.json())
        .then((res) => {
          if (!!res.status) {
            // console.log("Record was updated!");
            resolve(res);
          } else {
            // console.log("Error in updating Record!");
            reject();
          }
        })
        .catch((err) => {
          // console.log(err);
          reject(err);
        });
    });
  }

  static delete(id, apiName) {
    return new Promise((resolve, reject) => {
      fetch(`${this.apiRoute}/${apiName}/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
      })
        .then((res) => res.json())
        .then((res) => {
          if (!!res.status) {
            // console.log("Record was deleted!");
            resolve(res);
          } else {
            // console.log("Error in deleting Record!");
            reject("Error in deleting Record!");
          }
        })
        .catch((err) => {
          // console.log(err);
          reject(err);
        });
    });
  }
}

class Todo extends Connection {
  static tableName = "todo-list";

  static get(callback, { online = true }) {
    return new Promise((resolve, reject) => {
      let networkResponseReceived = false;

      if (online) {
        super
          .get("todo")
          .then(async (res) => {
            await clearAllData(this.tableName)
              .then(() => navigator.serviceWorker.ready)
              .then((sw) =>
                Promise.all(
                  res.data.map(async (val) =>
                    writeData(this.tableName, { ...val, status: [] })
                  )
                )
              )
              .then(() => {
                callback(res.data);
                return resolve();
              });
          })
          .catch((err) => reject(err));
      }
      readAllData(this.tableName).then((data) => {
        if (!networkResponseReceived && typeof data !== "undefined") {
          callback(data.filter((val) => +val.status !== 3));
        }
      });
    });
  }

  static getDetail(id) {
    return new Promise((resolve, reject) => {
      return readData(this.tableName, id)
        .then((data) => resolve(data))
        .catch((err) => reject(err));
    });
  }

  static add(body) {
    return new Promise((resolve, reject) => {
      if ("serviceWorker" in navigator && "SyncManager" in window) {
        navigator.serviceWorker.ready
          .then(
            async (sw) =>
              await writeData(this.tableName, {
                ...body,
                is_done: false,
                _id: Date.now().toString(),
                status: 1,
              }).then(() => sw.sync.register("sync-todo"))
          )
          .then(() => resolve("Your Todo was added to indexedDB"))
          .catch((err) => reject(err));
      } else {
        super
          .add(body, "todo")
          .then((res) => resolve(res))
          .catch((err) => reject(err));
      }
    });
  }

  static edit(id, body) {
    return new Promise((resolve, reject) => {
      if ("serviceWorker" in navigator && "SyncManager" in window) {
        navigator.serviceWorker.ready
          .then(
            async (sw) =>
              await readData(this.tableName, id)
                .then((data) =>
                  updateData(this.tableName, id, {
                    ...data,
                    ...body,
                    status: +data.status === 1 ? 1 : 2,
                  })
                )
                .then(() => sw.sync.register("sync-todo"))
          )
          .then(() => resolve("Your Todo was saved to indexedDB!"))
          .catch((err) => reject(err));
      } else {
        super
          .update(id, body, "todo")
          .then((res) => resolve(res))
          .catch((err) => reject(err));
      }
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      if ("serviceWorker" in navigator && "SyncManager" in window) {
        navigator.serviceWorker.ready
          .then(
            async (sw) =>
              await readData(this.tableName, id).then((data) => {
                if (+data.status === 1) {
                  return deleteItemFormData(data._id);
                } else {
                  return updateData(this.tableName, id, {
                    ...data,
                    status: 3,
                  }).then(() => sw.sync.register("sync-todo"));
                }
              })
          )
          .then(() => resolve("Your Todo was saved to indexedDB!"))
          .catch((err) => reject(err));
      } else {
        super
          .delete(id, "todo")
          .then((res) => resolve(res))
          .catch((err) => reject(err));
      }
    });
  }

  static sync() {
    return new Promise((resolve, reject) => {
      return readAllData(this.tableName).then((todoList) => {
        return Promise.all(
          todoList.map(async (val) => {
            switch (+val.status) {
              case 1:
                return await super.add(val, "todo").then((res) => {
                  if (res) {
                    updateData(this.tableName, val._id, {
                      ...res.data,
                      _id: val._id,
                      main_id: res.data._id,
                      status: [],
                    });
                    return true;
                  }
                  return false;
                });
              case 2:
                let data = { ...val };
                if (typeof data.main_id !== "undefined") {
                  data._id = data.main_id;
                }
                return await super.update(val._id, data, "todo").then((res) => {
                  if (res) {
                    updateData(this.tableName, val._id, {
                      ...val,
                      status: [],
                    });
                    return true;
                  }
                  return false;
                });
              case 3:
                let the_id = val._id;
                if (typeof val.main_id !== "undefined") {
                  the_id = val.main_id;
                }
                return await super.delete(the_id, "todo").then((res) => {
                  if (res) {
                    deleteItemFormData(this.tableName, val._id);
                    return true;
                  }
                  return false;
                });
            }
          })
        )
          .then((list) => {
            if (list.length === 0 || list.every((val) => !!val)) {
              return resolve("List is synced.");
            }
            reject("All of list not synced!");
          })
          .catch((err) => reject(err));
      });
    });
  }
}

class Category extends Connection {
  static tableName = "category-list";

  static get(callback) {
    return new Promise((resolve, reject) => {
      let networkResponseReceived = false;

      super
        .get("category")
        .then(async (res) => {
          await clearAllData(this.tableName)
            .then(() => navigator.serviceWorker.ready)
            .then((sw) =>
              Promise.all(
                res.data.map(async (val) =>
                  writeData(this.tableName, { ...val, status: 0 })
                )
              )
            )
            .then(() => {
              callback(res.data);
              return resolve();
            });
        })
        .catch((err) => reject(err));

      readAllData(this.tableName).then((data) => {
        if (!networkResponseReceived && typeof data !== "undefined") {
          callback(data.filter((val) => +val.status !== 3));
        }
      });
    });
  }

  static add(body) {
    return new Promise((resolve, reject) => {
      if ("serviceWorker" in navigator && "SyncManager" in window) {
        navigator.serviceWorker.ready
          .then(
            async (sw) =>
              await writeData(this.tableName, {
                ...body,
                _id: Date.now().toString(),
                status: 1,
              }).then(() => sw.sync.register("sync-category"))
          )
          .then(() => resolve("Your Category was added to indexedDB"))
          .catch((err) => reject(err));
      } else {
        super
          .add(body, "category")
          .then((res) => resolve(res))
          .catch((err) => reject(err));
      }
    });
  }

  static edit(id, body) {
    return new Promise((resolve, reject) => {
      if ("serviceWorker" in navigator && "SyncManager" in window) {
        navigator.serviceWorker.ready
          .then(
            async (sw) =>
              await readData(this.tableName, id)
                .then((data) =>
                  updateData(this.tableName, id, {
                    ...data,
                    ...body,
                    status: +data.status === 1 ? 1 : 2,
                  })
                )
                .then(() => sw.sync.register("sync-category"))
          )
          .then(() => resolve("Your Category was saved to indexedDB!"))
          .catch((err) => reject(err));
      } else {
        super
          .update(id, body, "category")
          .then((res) => resolve(res))
          .catch((err) => reject(err));
      }
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      if ("serviceWorker" in navigator && "SyncManager" in window) {
        navigator.serviceWorker.ready
          .then(
            async (sw) =>
              await readData(this.tableName, id).then((data) => {
                if (+data.status === 1) {
                  return deleteItemFormData(data._id);
                } else {
                  return updateData(this.tableName, id, {
                    ...data,
                    status: 3,
                  }).then(() => {
                    return sw.sync.register("sync-category");
                  });
                }
              })
          )
          .then(() => resolve("Your Category was saved to indexedDB!"))
          .catch((err) => reject(err));
      } else {
        super
          .delete(id, "category")
          .then((res) => resolve(res))
          .catch((err) => reject(err));
      }
    });
  }

  static async sync() {
    return new Promise((resolve, reject) => {
      let categoryList = readAllData(this.tableName);
      Promise.all(
        categoryList.map(async (val) => {
          switch (+val.status) {
            case 1:
              return await super.add(val, "category").then((res) => {
                if (res) {
                  return true;
                }
                return false;
              });
            case 2:
              return await super
                .update(val._id, val, "category")
                .then((res) => {
                  if (res) {
                    return true;
                  }
                  return false;
                });
            case 3:
              return await super.delete(val._id, "category").then((res) => {
                if (res) {
                  return true;
                }
                return false;
              });
          }
        })
      ).then((list) => {
        if (list.length === 0 || list.some((val) => !val)) {
          return resolve("List is synced.");
        }
        reject("All of list not synced!");
      });
    });
  }
}
