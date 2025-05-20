const jwt = localStorage.getItem("jwt");

  if (!jwt) {
    alert("You are not logged in.");
    window.location.href = "auth.html";
  }

  // Function to fetch the user's name from the backend
  async function fetchUserName() {
      try {
          const response = await fetch('/api/user/name', {
              method: 'GET',
              headers: {
                  "Authorization": "Bearer " + jwt
              }
          });

          if (!response.ok) {
              console.error('Failed to fetch user name:', response.status);
              document.getElementById("welcome-msg").textContent = 'Welcome!'; // Fallback message
              return null;
          }

          const name = await response.text();
          document.getElementById("welcome-msg").textContent = "Welcome, " + name + "!";
          return name;

      } catch (error) {
          console.error('Error fetching user name:', error);
          document.getElementById("welcome-msg").textContent = 'Welcome!'; // Fallback message
          return null;
      }
  }

  // Call fetchUserName when the page loads
  fetchUserName();

  // Load tasks
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
        li.innerHTML = `
          <strong>${task.title}</strong><br/>
          ${task.description || ''}<br/>
          <small>Due: ${task.dueDate || 'No due date'}</small><br/>
          <small>Category: ${task.category}</small><br/>
          <button onclick="deleteTask(${task.id})">Delete</button>
        `;
        taskList.appendChild(li);
      });

    } catch (err) {
      console.error("Failed to load tasks:", err);
      taskList.innerHTML = "<li style='color:red;'>Could not load tasks. Try again later.</li>";
    }
  }

  // Create task
  document.getElementById("task-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const title = document.getElementById("task-title").value;
    const description = document.getElementById("task-description").value;
    const dueDate = document.getElementById("task-dueDate").value;
    const category = document.getElementById("task-category").value;

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
      await fetchTasks(); // Reload list
      document.getElementById("task-form").reset();
    } catch (err) {
      console.error("Failed to add task:", err);
      alert("Could not create task. Please try again.");
    }
  });

  // Delete task
  async function deleteTask(taskId) {
    if (!confirm("Delete this task?")) return;

    try {
      const res = await fetch(`http://localhost:8080/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          "Authorization": "Bearer " + jwt
        }
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await fetchTasks(); // Reload list
    } catch (err) {
      console.error("Failed to delete task:", err);
      alert("Failed to delete task.");
    }
  }

  // Logout
  function logout() {
    localStorage.removeItem("jwt");
    window.location.href = "auth.html";
  }

  // Initial fetch
  fetchTasks();