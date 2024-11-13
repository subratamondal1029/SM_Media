const resultBox = document.getElementById("result-box");
const urlBox = document.getElementById("url-input");
const submitBtn = document.getElementById("submit-btn");
const loadingDots = document.getElementById("loading-dots");
const errorAlert = document.getElementById("error-alert");

submitBtn.addEventListener("click", fetchMediaData);
urlBox.addEventListener("change", fetchMediaData);

async function fetchMediaData(e) {
  resultBox.innerHTML = "";
  loadingDots.classList.remove("hidden");
  const url = urlBox.value.trim();
  urlBox.disabled = true;
  submitBtn.removeEventListener("click", fetchMediaData);
  urlBox.removeEventListener("change", fetchMediaData);

  fetch(`/api/v1/videoDetails?url=${encodeURIComponent(url)}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        urlBox.disabled = false;
        submitBtn.addEventListener("click", fetchMediaData);
        urlBox.addEventListener("change", fetchMediaData);
        loadingDots.classList.add("hidden");
        errorAlert.classList.add("hidden");
        console.log(data.data);

        printUi(data.data);
      } else throw data;
    })
    .catch((error) => {
      console.error(error);
      if (error.status >= 500) {
        showAlert("Something went wrong on our end! Try again later.");
      } else {
        showAlert(error.message);
      }
    });
}

function printUi(data) {
  const ui = `
                  <div id="videoDetails" class="w-full md:w-1/3">
            <img
              class="w-full max-h-96"
              src="${data?.thumb}"
              alt="${data?.title}"
            />
            <h1 class="text-2xl font-bold text-gray-500 mb-4">
              ${data?.title}
            </h1>
            <p class="text-lg text-gray-600 mb-4">Duration: ${
              data?.duration ? data?.duration : "N/A"
            }</p>
          </div>
          <div id="downloadDetails" class="w-full md:w-2/3">
            <ul
              class="flex flex-col justify-start items-center gap-6 p-2 w-full m-2 mt-4 rounded-md border border-gray-500"
              id="qualities"
            >
              <h2
                class="text-2xl font-bold text-gray-500 mb-2 flex justify-center items-center"
              >
                Video
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#BB271A"
                >
                  <path
                    d="m380-300 280-180-280-180v360ZM160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm0-80h640v-480H160v480Zm0 0v-480 480Z"
                  />
                </svg>
                :
              </h2>
              ${data?.qualities
                ?.filter(
                  (quality) =>
                    !quality?.type?.toLowerCase()?.includes("audio") &&
                    quality?.type?.includes("MP4")
                )
                .map(
                  (download) =>
                    `<li class="flex justify-between items-center w-full">
                <span class="text-gray-600 flex justify-center items-center gap-2"
                  >${download?.quality} (${download?.type})
                  ${
                    download?.mute
                      ? `<svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#666666"
                  >
                    <path
                      d="M792-56 56-792l56-56 736 736-56 56ZM560-514l-80-80v-246h240v160H560v166ZM400-120q-66 0-113-47t-47-113q0-66 47-113t113-47q23 0 42.5 5.5T480-418v-62l80 80v120q0 66-47 113t-113 47Z"
                    /></svg>`
                      : ""
                  }
                    </span
                ><a
                  href="${download?.url}"
                  download="${data?.title}"
                  ><button
                    class="px-6 py-2 bg-blue-500 text-white font-semibold rounded-md flex justify-between items-center hover:bg-blue-600 focus:outline-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#ffffff"
                    >
                      <path
                        d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"
                      />
                    </svg>
                    Download
                  </button></a
                >
              </li>`
                )
                .join("")}
            </ul>
            <ul
              class="flex flex-col justify-start items-center gap-6 p-2 w-full m-2 mt-4 rounded-md border border-gray-500"
              id="qualities"
            >
              <h2
                class="text-2xl font-bold text-gray-500 mb-2 flex justify-center items-center"
              >
                Audio <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#666666"><path d="M360-120H200q-33 0-56.5-23.5T120-200v-280q0-75 28.5-140.5t77-114q48.5-48.5 114-77T480-840q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-480v280q0 33-23.5 56.5T760-120H600v-320h160v-40q0-117-81.5-198.5T480-760q-117 0-198.5 81.5T200-480v40h160v320Zm-80-240h-80v160h80v-160Zm400 0v160h80v-160h-80Zm-400 0h-80 80Zm400 0h80-80Z"/></svg> :
              </h2>
                ${data?.qualities
                  ?.filter(
                    (quality) =>
                      !quality?.type?.includes("MP4") &&
                      quality?.type?.toLowerCase()?.includes("audio")
                  )
                  .map(
                    (download) =>
                      `<li class="flex justify-between items-center w-full">
                <span class="text-gray-600 flex justify-center items-center gap-2"
                  >${download?.quality} (${download?.type}) </span
                ><a
                  href="${download?.url}"
                  download="${data?.title}"
                  ><button
                    class="px-6 py-2 bg-blue-500 text-white font-semibold rounded-md flex justify-between items-center hover:bg-blue-600 focus:outline-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#ffffff"
                    >
                      <path
                        d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"
                      />
                    </svg>
                    Download
                  </button></a
                >
              </li>`
                  )
                  .join("")}
            </ul>
          </div>
          `;

  resultBox.innerHTML = ui;
}

function showAlert(errorMessage) {
  urlBox.disabled = false;
  urlBox.addEventListener("change", fetchMediaData);
  submitBtn.addEventListener("click", fetchMediaData);
  document.getElementById("error-text").textContent = errorMessage;
  errorAlert.classList.remove("hidden");
  loadingDots.classList.add("hidden");

  setTimeout(() => {
    errorAlert.classList.add("hidden");
  }, 5000);
}
