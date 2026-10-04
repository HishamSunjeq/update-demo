const updateButton = document.querySelector("#check-update");
const updateStatus = document.querySelector("#update-status");

window.desktop.getVersion().then((version) => {
  document.querySelectorAll(".app-version").forEach((element) => {
    element.textContent = version;
  });
});

window.desktop.onUpdateStatus((message) => {
  updateStatus.textContent = message;
});

updateButton.addEventListener("click", async () => {
  updateButton.disabled = true;

  try {
    await window.desktop.checkForUpdates();
  } catch (error) {
    updateStatus.textContent = `Could not check: ${error.message}`;
  } finally {
    updateButton.disabled = false;
  }
});

const navigation = document.querySelectorAll(".nav");
const pages = document.querySelectorAll("main section");

navigation.forEach((button) => {
  button.addEventListener("click", () => {
    navigation.forEach((item) => {
      item.classList.toggle("active", item === button);
    });

    pages.forEach((page) => {
      page.hidden = page.id !== button.dataset.page;
    });
  });
});
