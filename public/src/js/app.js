if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js");
}

const apiRoute = "/api/";
const VapidPublicKey =
  "BHM0VeVBZ9AMxseYwz4qCVBggcb07DiwwsfxEpP17efENzyRYabaY6dnaIX8HysyAtkKkbT8U6IXwEkIHQDeTUc";

// DOM operations for TODO
function addTodo(todo) {
  let checkboxId = `cbx-${todo._id}`;
  let checkBoxInput = document.createElement("input");
  checkBoxInput.id = checkboxId;
  checkBoxInput.className = "inp-cbx";
  checkBoxInput.setAttribute("type", "checkbox");
  checkBoxInput.checked = +todo.is_done === 1;
  checkBoxInput.style.display = "none";
  checkBoxInput.addEventListener("change", () => {
    changeStatus(todo._id);
  });
  let svgSpan = document.createElement("span");
  svgSpan.innerHTML = `<svg style="width: 12px; height: 9px;" viewBox="0 0 12 9"> <polyline points="1 5 4 8 11 1"></polyline> </svg>`;
  let titleSpan = document.createElement("span");
  titleSpan.innerText = todo.title;
  let checkBoxLabel = document.createElement("label");
  checkBoxLabel.className = "cbx";
  checkBoxLabel.htmlFor = checkboxId;
  checkBoxLabel.appendChild(svgSpan);
  checkBoxLabel.appendChild(titleSpan);
  let accordionId = `accordionCollapse${todo._id}`;
  let accordionButton = document.createElement("button");
  accordionButton.className = "accordion-button collapsed";
  accordionButton.style.width = "60px";
  accordionButton.setAttribute("type", "button");
  accordionButton.setAttribute("data-bs-toggle", "collapse");
  accordionButton.setAttribute("data-bs-target", `#${accordionId}`);
  accordionButton.setAttribute("aria-expanded", "true");
  accordionButton.setAttribute("aria-controls", accordionId);
  let checkBoxContainer = document.createElement("div");
  checkBoxContainer.appendChild(checkBoxInput);
  checkBoxContainer.appendChild(checkBoxLabel);
  let accordionHeader = document.createElement("h3");
  accordionHeader.className =
    "accordion-header d-flex justify-content-between align-items-center ps-3";
  accordionHeader.id = `accordionHeader${todo._id}`;
  accordionHeader.appendChild(checkBoxContainer);
  accordionHeader.appendChild(accordionButton);
  let descriptionP = document.createElement("p");
  descriptionP.className = "mb-2";
  descriptionP.innerHTML = createText("Description", todo.description);
  let categoryP = document.createElement("p");
  categoryP.className = "mb-2";
  categoryP.innerHTML = createText("Category", todo.category_id.title);
  let timeP = document.createElement("p");
  timeP.innerHTML = createText(
    "Time",
    new Date(todo.time).toLocaleDateString("en-us", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  );
  let editButton = document.createElement("button");
  editButton.className = "btn btn-info me-4";
  editButton.setAttribute("data-bs-toggle", "modal");
  editButton.setAttribute("data-bs-target", "#addModal");
  editButton.innerHTML = `<svg stroke="#FFFFFF" fill="#FFFFFF" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="m7 17.013 4.413-.015 9.632-9.54c.378-.378.586-.88.586-1.414s-.208-1.036-.586-1.414l-1.586-1.586c-.756-.756-2.075-.752-2.825-.003L7 12.583v4.43zM18.045 4.458l1.589 1.583-1.597 1.582-1.586-1.585 1.594-1.58zM9 13.417l6.03-5.973 1.586 1.586-6.029 5.971L9 15.006v-1.589z"></path><path d="M5 21h14c1.103 0 2-.897 2-2v-8.668l-2 2V19H8.158c-.026 0-.053.01-.079.01-.033 0-.066-.009-.1-.01H5V5h6.847l2-2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2z"></path></svg>`;
  editButton.addEventListener("click", () => loadTodo(todo._id));
  let deleteButton = document.createElement("button");
  deleteButton.classList = "btn btn-danger me-4";
  deleteButton.innerHTML = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M5 20a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8h2V6h-4V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H3v2h2zM9 4h6v2H9zM8 8h9v12H7V8z"></path><path d="M9 10h2v8H9zm4 0h2v8h-2z"></path></svg>`;
  deleteButton.addEventListener("click", () => deleteTodo(todo._id));
  let buttonContainer = document.createElement("div");
  buttonContainer.className =
    "w-100 d-flex justify-content-end align-items-center";
  buttonContainer.appendChild(editButton);
  buttonContainer.appendChild(deleteButton);
  let accordionBody = document.createElement("div");
  accordionBody.className = "accordion-body";
  accordionBody.appendChild(descriptionP);
  accordionBody.appendChild(categoryP);
  accordionBody.appendChild(timeP);
  accordionBody.appendChild(buttonContainer);
  let accordionCollapse = document.createElement("div");
  accordionCollapse.id = accordionId;
  accordionCollapse.className = "accordion-collapse collapse";
  accordionCollapse.appendChild(accordionBody);
  let accordionItem = document.createElement("div");
  accordionItem.className = "accordion-item";
  accordionItem.appendChild(accordionHeader);
  accordionItem.appendChild(accordionCollapse);
  let accordion = document.querySelector("#todoAccordion");
  accordion.appendChild(accordionItem);
}

function loadModal(data) {
  let todo_id = document.querySelector("#todo-id"),
    todo_title = document.querySelector("#todo-title"),
    todo_description = document.querySelector("#todo-description"),
    todo_category = document.querySelector("#todo-category"),
    todo_time = document.querySelector("#todo-time");

  if (typeof data !== "undefined") {
    const { _id, title, description, category_id, time } = data;

    todo_id.value = _id;
    todo_title.value = title;
    todo_description.value = description;
    todo_time.valueAsDate = new Date(time);

    for (let i = 0; i < todo_category.options.length; i++) {
      if (todo_category.options[i].value == category_id._id) {
        todo_category.selectedIndex = i;
        break;
      }
    }
  } else {
    todo_id.value = 0;
    todo_title.value = "";
    todo_description.value = "";
    todo_time.value = "";
    todo_category.selectedIndex = 0;
  }
}

function loadTodo(id) {
  Todo.getDetail(id).then((data) => {
    loadModal(data);
  });
}

function createText(key, value) {
  return `<b style="font-size: 18ps;">${key}: </b> ${value}`;
}

async function changeStatus(id) {
  let checkBox = document.querySelector(`#cbx-${id}`);

  Todo.edit(id, {
    is_done: !!checkBox.checked,
  })
    .catch((err) => console.log(err))
    .finally(() => syncTodo(false));
}

async function customSubmit(event) {
  event.preventDefault();
  let id = document.querySelector("#todo-id")?.value,
    title = document.querySelector("#todo-title")?.value,
    description = document.querySelector("#todo-description")?.value,
    category = document.querySelector("#todo-category"),
    time = document.querySelector("#todo-time")?.value;

  if (id == 0 || id == "") {
    Todo.add({
      title,
      description,
      category_id: {
        _id: category.value,
        title: category.selectedOptions[0].innerText,
      },
      time,
    })
      .catch((err) => console.log(err))
      .finally(() => syncTodo(false));
  } else {
    Todo.edit(id, {
      title,
      description,
      category_id: {
        _id: category.value,
        title: category.selectedOptions[0].innerText,
      },
      time,
    })
      .catch((err) => console.log(err))
      .finally(() => syncTodo(false));
  }
}

async function deleteTodo(id) {
  Todo.delete(id)
    .then((res) => console.log(res))
    .catch((err) => console.log(err))
    .finally(() => syncTodo(false));
}

function syncTodo(online = true) {
  Todo.get(
    (data) => {
      let accordion = document.querySelector("#todoAccordion");
      accordion.innerHTML = "";
      data.forEach((todo) => addTodo(todo));
    },
    { online }
  ).catch((err) => {
    console.log(err);
  });
}

// DOM operations for Category
function syncCategories() {
  Category.get((data) => {
    let select = document.querySelector("#todo-category");
    select.innerHTML = "";
    data?.forEach((cats) => {
      let option = document.createElement("option");
      option.value = cats._id;
      option.innerText = cats.title;

      select.appendChild(option);
    });
  }).catch((err) => {
    console.log(err);
  });
}

function displayNotification() {
  let options = {
    body: "ایول، انجامش دادی!",
    icon: "/src/images/icons/app-icon-96x96.png",
    image: "/src/images/photo_2023-05-26_18-40-44.jpg",
    dir: "rtl",
    lang: "fa",
    vibrate: [100, 50, 200],
    badge: "/src/images/icons/app-icon-96x96.png",
    tag: "confirm-notification",
    renotify: true,
    actions: [
      {
        action: "confirm",
        title: "Okay",
        icon: "/src/images/icons/app-icon-96x96.png",
      },
      {
        action: "cancel",
        title: "Cancel",
        icon: "/src/images/icons/app-icon-96x96.png",
      },
    ],
  };
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready.then((swreg) => {
      swreg.showNotification("Successfully access granted! (from SW)", options);
    });
  }
}

function configurePushSub() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  let reg;
  navigator.serviceWorker.ready
    .then((swreg) => {
      reg = swreg;
      return swreg.pushManager.getSubscription();
    })
    .then((sub) => {
      if (sub === null) {
        let convertedVapidPublicKe = urlBase64ToUint8Array(VapidPublicKey);
        return reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidPublicKe,
        });
      } else {
      }
    })
    .then((newSub) =>
      fetch(apiRoute + "subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(newSub),
      })
    )
    .then((res) => res.json())
    .then((res) => {
      if (!!res.status) {
        displayNotification();
      }
    })
    .catch((err) => console.log(err));
}

function enableNotifications() {
  if ("Notification" in window && "serviceWorker" in navigator) {
    Notification.requestPermission((result) => {
      console.log(result);
      if (result !== "granted") {
      } else {
        // displayNotification();
        configurePushSub();
      }
    });
  }
}

// Load Page
function loadData() {
  syncTodo();
  syncCategories();
}

window.addEventListener("load", loadData);
