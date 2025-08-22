const getUserName = document.querySelector("#user") as HTMLInputElement;
const formSubmit = document.querySelector("#form") as HTMLFormElement;
const main_container = document.querySelector(".main_container") as HTMLElement;

// Define the contract of an object
interface UserData {
  id: number;
  login: string;
  avatar_url: string; // Fixed typo from 'avtar_url' to 'avatar_url'
  location: string;
  url: string;
}

// Reusable function to fetch data
async function myCustomFetcher<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Network response was not ok-status: ${response.status}`);
  }
  const data = await response.json();
  return data;
}

const showResultUI = (singleUser: UserData) => {
  const { avatar_url, login, url } = singleUser; // Fixed typo from 'avtar_url' to 'avatar_url'
  main_container.insertAdjacentHTML(
    "beforeend",
    `<div class='card'>
      <img src="${avatar_url}" alt="${login}" />
      <hr/>
      <div class="card-footer">
        <img src="${avatar_url}" alt="${login}" />
        <a href="${url}">Github</a>
      </div>
    </div>`
  );
};

function fetchUserData(url: string) {
  myCustomFetcher<UserData[]>(url, {}).then((userInfo) => {
    for (const singleUser of userInfo) {
      showResultUI(singleUser);
      console.log("login: " + singleUser.login);
    }
  });
}
fetchUserData("https://api.github.com/users");

// Perform search operation
formSubmit.addEventListener("submit", async (e) => {
  e.preventDefault();
  const searchTerm = getUserName.value.toLowerCase();
  try {
    const url = `https://api.github.com/search/users?q=${searchTerm}`;
    const allUserData = await myCustomFetcher<{ items: UserData[] }>(url, {});
    const matchingUsers = allUserData.items.filter((user) => {
      return user.login.toLowerCase().includes(searchTerm);
    });
    main_container.innerHTML = "";
    if (matchingUsers.length === 0) {
      main_container.insertAdjacentHTML(
        "beforeend",
        `<p class="empty-msg">No Matching Users Found.</p>`
      );
    } else {
      for (const singleUser of matchingUsers) {
        showResultUI(singleUser);
      }
    }
  } catch (error) {
    console.error(error);
  }
});
