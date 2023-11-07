window.addEventListener("DOMContentLoaded", () => {
  const { ipcRenderer } = require("electron");

  const floatingButton = document.querySelector(".floating-button");
  const badge = document.querySelector(".badge");

  floatingButton.addEventListener("contextmenu", handleShowContextMenu);

  function handleShowContextMenu(event) {
    event.preventDefault(); // Prevent default context menu
    ipcRenderer.send("show-context-menu");
  }

  let timer;
  let drag = false;
  let dragTemp = false;

  function initEventListener() {
    floatingButton.addEventListener("mouseup", mouseUpHandler);
    floatingButton.addEventListener("mousedown", mouseDownHandler);
  }

  //   function removeEventListener() {
  //     floatingButton.removeEventListener("mouseup", mouseUpHandler);
  //     floatingButton.removeEventListener("mousedown", mouseDownHandler);
  //   }
  initEventListener();
  function mouseDownHandler() {
    timer = setTimeout(function () {
      // Do something when the press and hold event occurs
      toggleDrag();
    }, 2000);
  }

  function mouseUpHandler() {
    clearTimeout(timer);
    if (!drag && !dragTemp) {
      ipcRenderer.send("toggleMainWindow");
    }
    if (dragTemp) {
      dragTemp = false;
    }
  }
  function toggleDrag() {
    if (drag) {
      badge.classList.remove("show");

      drag = false;
      dragTemp = true;
    } else {
      badge.classList.add("show");

      drag = true;
    }
  }

  floatingButton.addEventListener("mouseup", () => {
    console.log("Drag ended");
  });
});
