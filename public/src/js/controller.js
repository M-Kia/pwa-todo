// const apiRoute = "http://kia.tatdmo.ir/api/";

class Controller {
  static get(){
    fetch(apiRoute + "get")
  }

  static add(body) {
    if ("serviceWorker" in navigator && "SyncManager" in window) {
      navigator.serviceWorker.ready.then((sw) => {
        writeData('todo-list', {
            id: new Date().toISOString(),
            ...body,
            status: 0
          }).then(() => console.log('Your Todo was added to indexedDB')).catch( err => console.log(err));
      });
    } else {
      fetch(apiRoute + "todo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
      })
        .then((res) => res.json())
        .then((res) => console.log("Todo was added"))
        .catch((err) => console.log(err));
    }
  }

  static edit(id, body) {
    if ("serviceWorker" in navigator && "SyncManager" in window) {
      navigator.serviceWorker.ready.then((sw) => {
        // writeData("sync-todo", {
        //   id: new Date().toISOString(),
        //   url: apiRoute + "Update_Todo",
        //   method: "POST",
        //   body,
        //   tryCount: 0,
        // })
          // .then(() => sw.sync.register(`sync-todo`))
          .then(() => console.log("Your Todo was saved to indexedDB!"))
          .catch((err) => console.log(err));
      });
    } else {
      let fd = new FormData();

      Object.keys(body).forEach((key) => fd.set(key, body[key]));

      fetch(apiRoute + "Update_Todo", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: fd,
      })
        .then((res) => res.json())
        .then((res) => console.log("Todo was updated"))
        .catch((err) => console.log(err));
    }
  }

  static async sync() {
    let todoList = readAllData('todo-list');
    return await Promise.all(todoList.map(async val => {
      if (isNaN(val.id)){

      }
    }))
  }
}
