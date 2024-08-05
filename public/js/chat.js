const socket = io();
const createGroupModalInstance = new bootstrap.Modal(document.getElementById("create-group"));
const addToGroupModalInstance = new bootstrap.Modal(document.getElementById("add-user-to-group"));

const chatForm = document.getElementById("chat-form");
const submit_btn = document.getElementById("submit-btn");
const newMessage = document.getElementById("new-message");
const messageBox = document.getElementById("message-box");
const groupList = document.getElementById("group-list");
const selectedGroup = document.getElementById("selected-group");
const addNewGroup = document.getElementById("add-group");
const addToGroup = document.getElementById("add-to-group");
const limit = 20;
let nextPage = 1;
let canSendRequest = true;

const user = JSON.parse(localStorage.user);
let groupId = 0;

window.addEventListener("DOMContentLoaded", () => {
  setGroupList();
});

groupList.addEventListener("click", (e) => {
  const target = e.target;
  if (target.classList.contains("group")) {
    groupId = target.id;
    selectedGroup.innerHTML = target.innerHTML;
    joinToGroup(groupId);
  }
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  sendMessage();
});

submit_btn.addEventListener("click", (e) => {
  e.preventDefault();
  sendMessage();
});

addNewGroup.addEventListener("click", async (e) => {
  const modal = document.getElementById("create-group");
  let groupName = document.getElementById("group-name");
  if (groupName.value === "") {
    return;
  }
  try {
    const { data } = await axios.post("/groups", { name: groupName.value });
    if (data.success) {
      const prevGroups = JSON.parse(localStorage.groups);
      const newGroup = { id: data.body.groupId, name: groupName.value };
      const newGroups = [...prevGroups, newGroup];
      localStorage.groups = JSON.stringify(newGroups);
      location.reload();
    } else {
      iziToast.error({
        title: "Error",
        message: data.message,
        position: "topCenter",
      });
    }
  } catch (err) {
    iziToast.error({
      title: "Error",
      message: err.response.data.message,
      position: "topCenter",
    });
  }
  createGroupModalInstance.hide(modal);
});

addToGroup.addEventListener("click", async (e) => {
  const modal = document.getElementById("add-user-to-group");
  const user = document.getElementById("user-modal");
  const group = document.getElementById("group-modal");
  if (user.value === "" || group.value === "") {
    return;
  }
  try {
    const { data } = await axios.post("/users/add-user-to-group", { userId: user.value, groupId: group.value });
    if (data.success) {
      iziToast.success({
        title: "success",
        message: data.message,
        position: "topCenter",
      });
    } else {
      iziToast.error({
        title: "Error",
        message: data.message,
        position: "topCenter",
      });
    }
  } catch (err) {
    iziToast.error({
      title: "Error",
      message: err.response.data.message,
      position: "topCenter",
    });
  }
  addToGroupModalInstance.hide(modal);
});

socket.on("left the group",(data)=>{
  console.log(data);
})

socket.on("message", (data) => {
  const message = putMessagesIntoElement(user, data);
  messageBox.innerHTML += message;
  messageBox.scrollTop = messageBox.scrollHeight - messageBox.clientHeight;
});

function sendMessage() {
  newMessage.focus();
  if (newMessage.value.length === 0) {
    return;
  }
  if (groupId === 0) {
    alert("please select a group");
    return;
  }
  messageBox.scrollTop = messageBox.scrollHeight - messageBox.clientHeight;
  socket.emit("message", { newMessage: newMessage.value, groupId });
  newMessage.value = "";
}

function setGroupList() {
  const userDiv = document.getElementById("user");
  const user = JSON.parse(localStorage.user);
  const groups = JSON.parse(localStorage.groups);
  userDiv.innerHTML = `<p class="m-3 p-2 bg-dark text-white d-block text-center rounded-5">${user.fullname}</p>`;
  let html = "";
  for (let i = 0; i < groups.length; i++) {
    html += `
    <span id=${groups[i].id} class="m-2 p-1 bg-light d-block rounded-3 group">${groups[i].name}</span>
    `;
  }
  groupList.innerHTML = html;
}

async function fetchMessagesByGroupId(groupId) {
  if (canSendRequest) {
    canSendRequest = false;
    const { data } = await axios.get(`/chat/group-chat/${groupId}?limit=${limit}&page=${nextPage}`);
    const messages = data.body;
    if (messages.length === limit) {
      nextPage++;
      canSendRequest = true;
    }
    return messages;
  } else {
    return [];
  }
}

async function joinToGroup(groupId) {
  try {
    nextPage = 1;
    canSendRequest = true;
    newMessage.focus();
    socket.emit("join to group", { groupId, user });
    const messages = await fetchMessagesByGroupId(groupId);
    const messageDiv = putMessagesIntoElement(user, messages);
    messageBox.innerHTML = messageDiv;
    messageBox.scrollTop = messageBox.scrollHeight - messageBox.clientHeight;
  } catch (err) {
    messageBox.innerHTML = "an error occured";
  }
}

function putMessagesIntoElement(user, message) {
  let allmessages = "";
  if (message instanceof Array) {
    for (let i = 0; i < message.length; i++) {
      if (message[i].senderId === 1) {
        allmessages += `
        <div class="d-flex flex-row justify-content-center mb-4">
        <div class="p-1 ms-3" style="border-radius: 10px; background-color: rgba(50, 100, 200, 0.1);text-align: center;
        width: 80%;">
          <p class="small mb-0">${message[i].text}</p>
        </div>
      </div> `;
      } else if (message[i].senderId === user.id) {
        allmessages += `<div class="d-flex flex-row justify-content-start mb-4">
          <img
            src="/images/${message[i].user.imageName}"
            alt="avatar 1"
            style="width: 45px; height:45px;border-radius: 50%;"
            />
          <div class="p-3 ms-3" style="border-radius: 15px; background-color: #93ec83">
            <p class="small mb-0">${message[i].text}</p>
          </div>
        </div> `;
      } else {
        allmessages += `<div <div class="d-flex flex-row justify-content-end mb-4">
        <div class="p-3 me-3 border" style="border-radius: 15px; background-color: #fbfbfb">
          <p class="small mb-0">${message[i].text}</p>
        </div>
        <img
          src="/images/${message[i].user.imageName}"
          alt="avatar 1"
          style="width: 45px; height: 45px;border-radius: 50%;"
        />
      </div> `;
      }
    }
  } else {
    if (message.senderId === 1) {
      allmessages += `
      <div class="d-flex flex-row justify-content-center mb-4">
      <div class="p-1 ms-3" style="border-radius: 15px; background-color: rgba(57, 192, 237, 0.2);text-align: center;
      width: 80%;">
        <p class="small mb-0">${message.text}</p>
      </div>
    </div> `;
    } else if (message.senderId === user.id) {
      allmessages += `<div class="d-flex flex-row justify-content-start mb-4">
            <img
              src="/images/${user.image}"
              alt="avatar 1"
              style="width: 45px; height:45px;border-radius: 50%;"
              />
            <div class="p-3 ms-3" style="border-radius: 15px; background-color: #93ec83">
              <p class="small mb-0">${message.text}</p>
            </div>
          </div> `;
    } else {
      allmessages += `<div <div class="d-flex flex-row justify-content-end mb-4">
          <div class="p-3 me-3 border" style="border-radius: 15px; background-color: #fbfbfb">
            <p class="small mb-0">${message.text}</p>
          </div>
          <img
            src="/images/${message.image}"
            alt="avatar 1"
            style="width: 45px; height: 45px;border-radius: 50%;"
          />
        </div> `;
    }
  }
  return allmessages;
}

messageBox.addEventListener("scroll", async () => {
  const scrollTop = messageBox.scrollTop;
  if (scrollTop < 10 && scrollTop > 0) {
    if (canSendRequest) {
      try {
        const messages = await fetchMessagesByGroupId(groupId);
        const messageDiv = putMessagesIntoElement(user, messages);
        const existMessages = messageBox.innerHTML;
        messageBox.innerHTML = messageDiv + existMessages;
        messageBox.scrollTop = 1.4 * messageBox.clientHeight;
      } catch (err) {
        console.error(err);
        messageBox.innerHTML = "an error occured";
      }
    }
  }
});
