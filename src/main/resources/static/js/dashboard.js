const jwt = localStorage.getItem("jwt");

if (!jwt) {
  alert("You are not logged in.");
  window.location.href = "auth.html";
}

async function fetchUserName() {
  try {
    const response = await fetch('/api/user/name', {
      method: 'GET',
      headers: { "Authorization": "Bearer " + jwt }
    });

    const name = await response.ok ? await response.text() : null;
    const displayMsg = name ? `Welcome, ${name.split(' ')[0]}!` : "Welcome!";
    document.getElementById("welcome-msg").textContent = displayMsg;
  } catch {
    document.getElementById("welcome-msg").textContent = "Welcome!";
  }
}
fetchUserName();

async function fetchTasks() {
  const taskSections = document.getElementById("task-sections");
  taskSections.innerHTML = "<p>Loading tasks...</p>";

  try {
    const res = await fetch("/api/tasks", {
      credentials: 'include',
      headers: { "Authorization": "Bearer " + jwt }
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const tasks = await res.json();
    taskSections.innerHTML = "";

    if (tasks.length === 0) {
      taskSections.innerHTML = '<span style="color:#007bff;font-size:125%"><b>No tasks currently.</b></span>';
      return;
    }

    const activeTasks = tasks.filter(task => !task.completed);
    const completedTasks = tasks.filter(task => task.completed);

    // Create sections
    const createSection = (title) => {
      const section = document.createElement("section");
      section.innerHTML = `<h3>${title}</h3>`;
      const list = document.createElement("ul");
      list.className = "task-list";
      section.appendChild(list);
      return { section, list };
    };

    const { section: activeSection, list: activeList } = createSection("Active Tasks");
    const { section: completedSection, list: completedList } = createSection("Completed Tasks");

    taskSections.appendChild(activeSection);
    taskSections.appendChild(completedSection);

     function createTaskItem(task) {
          const li = document.createElement("li");
          const formattedDate = task.dueDate
            ? new Date(task.dueDate).toLocaleString(undefined, {
                year: 'numeric', month: 'long', day: 'numeric',
                hour: '2-digit', minute: '2-digit'
              })
            : "";

          li.innerHTML = `
            <div class="task-view ${task.completed ? 'completed' : ''}">
              <div class="task-header">
                <strong class="task-title">${task.title}</strong>
                <div class="task-actions">
                  <button class="complete-btn" title="${task.completed ? 'Undo' : 'Complete'}">${task.completed ? '↺' : '✓'}</button>
                  <button class="delete-btn" title="Delete">✗</button>
                </div>
              </div>
              <div class="task-meta">
                <div class="task-details-group"> ${task.description ? `<small><span class="desc-label">Desc:</span> ${task.description}</small>` : ""}
                  ${formattedDate ? `<small><span class="due-label">Due:</span> ${formattedDate}</small>` : ""}
                  ${task.category ? `<small><span class="category-label">Category:</span> ${task.category}</small>` : ""}
                </div>
                ${!task.completed ? `<button class="edit-btn">Edit</button>` : ""}
              </div>
            </div>

            <div class="task-edit" style="display:none;">
              <input type="text" class="edit-title" value="${task.title}" maxlength="30" placeholder="Title"/>
              <input type="text" class="edit-desc" value="${task.description || ''}" placeholder="Task Description" maxlength="85"/>
              <input type="datetime-local" class="edit-due" value="${task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : ''}"/>
              <select class="edit-cat">
                <option value="">Select Category</option>
                <option value="Work" ${task.category === 'Work' ? 'selected' : ''}>Work</option>
                <option value="Personal" ${task.category === 'Personal' ? 'selected' : ''}>Personal</option>
                <option value="Urgent" ${task.category === 'Urgent' ? 'selected' : ''}>Urgent</option>
                <option value="Misc" ${task.category === 'Misc' ? 'selected' : ''}>Misc</option>
              </select>
              <button class="save-edit-btn">Save</button>
              <button class="cancel-edit-btn">Cancel</button>
            </div>
          `;

      // Get elements once here
      const viewDiv = li.querySelector(".task-view");
      const editDiv = li.querySelector(".task-edit");
      const editBtn = li.querySelector(".edit-btn");
      const saveBtn = li.querySelector(".save-edit-btn");
      const cancelBtn = li.querySelector(".cancel-edit-btn");
      const completeBtn = li.querySelector(".complete-btn");
      const deleteBtn = li.querySelector(".delete-btn");


      if (editBtn) {
        editBtn.addEventListener("click", () => {
          viewDiv.style.display = "none";
          editDiv.style.display = "block";
        });
      }

      cancelBtn?.addEventListener("click", () => {
        editDiv.style.display = "none";
        viewDiv.style.display = "block";
      });

      saveBtn?.addEventListener("click", async () => {
        const updatedTask = {
          title: li.querySelector(".edit-title").value.trim(),
          description: li.querySelector(".edit-desc").value.trim(),
          dueDate: li.querySelector(".edit-due").value,
          category: li.querySelector(".edit-cat").value
        };

        if (updatedTask.title.length > 30 || updatedTask.description.length > 85) {
          alert("Title or description too long.");
          return;
        }

        if (updatedTask.dueDate && new Date(updatedTask.dueDate).getTime() <= Date.now()) {
          alert("Due date must be in the future!");
          return;
        }

        try {
          const res = await fetch(`/api/tasks/${task.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + jwt
            },
            body: JSON.stringify(updatedTask)
          });

          if (!res.ok) throw new Error("Update failed");
          await fetchTasks();
        } catch (err) {
          console.error("Update error:", err);
          alert("Could not update task.");
        }
      });

      completeBtn.addEventListener("click", async () => {
        try {
          const res = await fetch(`/api/tasks/${task.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + jwt
            },
            body: JSON.stringify({ completed: !task.completed })
          });

          if (!res.ok) throw new Error("Failed to toggle status");
          await fetchTasks();
        } catch (err) {
          alert("Could not toggle task status.");
          console.error(err);
        }
      });

      deleteBtn.addEventListener("click", () => {
        showDeleteModal(task.id);
      });

      return li;
    }

    activeTasks.forEach(task => activeList.appendChild(createTaskItem(task)));
    completedTasks.forEach(task => completedList.appendChild(createTaskItem(task)));

  } catch (err) {
    console.error("Error loading tasks:", err);
    taskSections.innerHTML = "<p style='color:red;'>Could not load tasks. Try again later.</p>";
  }
}

// Delete modal
function showDeleteModal(taskId) {
  const modal = document.getElementById("delete-confirm-modal");
  modal.style.display = "flex";

  const confirmBtn = document.getElementById("confirm-delete");
  const cancelBtn = document.getElementById("cancel-delete");

  // Remove existing listeners to prevent multiple firings
  const oldConfirmListener = confirmBtn._eventListener;
  if (oldConfirmListener) {
    confirmBtn.removeEventListener("click", oldConfirmListener);
  }

  const newConfirmListener = async () => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + jwt }
      });
      if (!res.ok) throw new Error("Delete failed");
      modal.style.display = "none";
      await fetchTasks();
    } catch (err) {
      alert("Failed to delete task.");
    }
  };
  confirmBtn.addEventListener("click", newConfirmListener);
  confirmBtn._eventListener = newConfirmListener;

  cancelBtn.addEventListener("click", () => {
    modal.style.display = "none";
  },
  { once: true });
}

// Task submission
document.getElementById("task-form").addEventListener("submit", async e => {
  e.preventDefault();
  const title = document.getElementById("task-title").value.trim();
  const description = document.getElementById("task-description").value.trim();
  const dueDate = document.getElementById("task-dueDate").value;
  const category = document.getElementById("task-category").value;

  if (title.length > 30 || description.length > 85) {
    alert("Title must be under 30 characters and description under 85.");
    return;
  }

  if (dueDate && new Date(dueDate).getTime() <= Date.now()) {
    alert("Due date must be in the future!");
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
    console.error("Create task error:", err);
    alert("Could not create task.");
  }
});

function logout() {
  localStorage.removeItem("jwt");
  window.location.href = "auth.html";
}

fetchTasks();