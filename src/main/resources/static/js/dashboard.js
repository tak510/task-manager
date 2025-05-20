const jwt = localStorage.getItem("jwt");

if (!jwt) {
  alert("You are not logged in.");
  window.location.href = "auth.html";
}

async function fetchUserName() {
  try {
    const response = await fetch('/api/user/name', {
      method: 'GET',
      headers: {
        "Authorization": "Bearer " + jwt
      }
    });

    const name = await response.ok ? await response.text() : null;
    document.getElementById("welcome-msg").textContent = name ? `Welcome, ${name}!` : "Welcome!";
  } catch {
    document.getElementById("welcome-msg").textContent = "Welcome!";
  }
}
fetchUserName();

async function fetchTasks() {
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = "<li>Loading tasks...</li>";

  try {
    const res = await fetch("/api/tasks", {
      credentials: 'include',
      headers: {
        "Authorization": "Bearer " + jwt
      }
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const tasks = await res.json();
    taskList.innerHTML = "";

    if (tasks.length === 0) {
      taskList.innerHTML = "<li>No tasks currently.</li>";
      return;
    }

    tasks.forEach(task => {
      const li = document.createElement("li");
      const formattedDate = task.dueDate
        ? new Date(task.dueDate).toLocaleString(undefined, {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
          })
        : null;

      li.innerHTML = `
        <strong>${task.title}</strong>
        <div class="task-meta">
          ${task.description ? `<small><span class="desc-label">Desc:</span> ${task.description}</small>` : ""}
          ${formattedDate ? `<small><span class="due-label">Due:</span> ${formattedDate}</small>` : ""}
          ${task.category ? `<small><span class="category-label">Category:</span> ${task.category}</small>` : ""}
        </div>
        <button class="complete-btn" onclick="deleteTask(${task.id})">✓</button>
      `;
      taskList.appendChild(li);
    });

  } catch (err) {
    console.error("Failed to load tasks:", err);
    taskList.innerHTML = "<li style='color:red;'>Could not load tasks. Try again later.</li>";
  }
}

document.getElementById("task-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const title = document.getElementById("task-title").value.trim();
  const description = document.getElementById("task-description").value.trim();
  const dueDate = document.getElementById("task-dueDate").value;
  const category = document.getElementById("task-category").value;

  if (title.length > 30 || description.length > 85) {
    alert("Title must be under 30 characters and description under 85.");
    return;
  }

  try {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + jwt
      },
      body: JSON.stringify({ title, description, dueDate, category })
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    await fetchTasks();
    document.getElementById("task-form").reset();
  } catch (err) {
    console.error("Failed to add task:", err);
    alert("Could not create task. Please try again.");
  }
});

async function deleteTask(taskId) {
  if (!confirm("Mark this task as complete?")) return;

  try {
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
        "Authorization": "Bearer " + jwt
      }
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    await fetchTasks();
  } catch (err) {
    console.error("Failed to delete task:", err);
    alert("Failed to complete task.");
  }
}

function logout() {
  localStorage.removeItem("jwt");
  window.location.href = "auth.html";
}

fetchTasks();