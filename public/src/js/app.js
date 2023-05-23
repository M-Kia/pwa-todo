// if ("serviceWorker" in navigator) {
//   navigator.serviceWorker.register("/sw.js").then(() => {
//     console.log("Service Worker registered!");
//   });
// }

const apiRoute = "/api/";

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
    new Date(todo.time).toLocaleDateString("fa", {
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
  // TODO: Edit Function
  let deleteButton = document.createElement("button");
  deleteButton.classList = "btn btn-danger me-4";
  deleteButton.innerHTML = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M5 20a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8h2V6h-4V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H3v2h2zM9 4h6v2H9zM8 8h9v12H7V8z"></path><path d="M9 10h2v8H9zm4 0h2v8h-2z"></path></svg>`;
  // TODO: Delete Function
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

function createText(key, value) {
  return `<b style="font-size: 18ps;">${key}: </b> ${value}`;
}

async function changeStatus(id) {
  let checkBox = document.querySelector(`#cbx-${id}`);

  let fd = new FormData();
  fd.append("conditions", `id/=/${id}`);
  fd.append("keyvalues", `is_done,${!!checkBox.checked ? 1 : 0}`);

  let res = await fetch(apiRoute + "Update_Todo", {
    method: "POST",
    body: fd,
  })
    .then((res) => res.json())
    .then((res) => {
      if (+res.status !== 1) {
        throw new Error("Error in updating TODO");
      }
    })
    .catch((err) => {
      console.log(err);
      checkBox.checked = !checkBox.checked;
    });
}

async function customSubmit(event) {
  event.preventDefault();
  let title = document.querySelector("#todo-title")?.value;
  let description = document.querySelector("#todo-description")?.value;
  let category = document.querySelector("#todo-category")?.value;
  let time = document.querySelector("#todo-time")?.value;

  if ("serviceWorker" in navigator && "SyncManager" in window) {
    navigator.serviceWorker.ready.then((sw) => {
      writeData("sync-todo", {
        id: new Date().toISOString(),
        url: apiRoute + "Insert_Todo",
        method: "POST",
        body: JSON.stringify({
          title,
          description,
          category_id: category,
          time: new Date(time).getTime().toString().slice(0, -3),
        }),
      })
        .then(() => sw.sync.register(`sync-add-todo`))
        .then(() => console.log("Your Todo was saved for syncing!"))
        .catch((err) => console.log(err));
    });
  }
}

async function loadData() {
  let networkResponseReceived = false;

  fetch(apiRoute + "todo", {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  })
    .then((res) => {
      networkResponseReceived = true;
      return res.json();
    })
    .then((data) => {
      let accordion = document.querySelector("#todoAccordion");
      accordion.innerHTML = "";
      data.data.forEach((todo) => addTodo(todo));
    })
    .catch((err) => {
      console.log(err);
    });

  // if ("indexedDB" in window) {
  //   readData("requests", url).then((data) => {
  //     if (!networkResponseReceived && typeof data !== "undefined") {
  //       return callback(data.data);
  //     }
  //   });
  // }
}

window.addEventListener("load", () => loadData());
