// js/dashboard.js
import { auth, db } from './firebaseConfig.js';
import { collection, addDoc, getDocs } from 'https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js';

const projectList = document.getElementById("projectList");
const createProjectBtn = document.getElementById("createProject");

// Create a new project
createProjectBtn.addEventListener("click", async () => {
  const name = prompt("Enter project name:");
  if (!name) return;

  try {
    const docRef = await addDoc(collection(db, "projects"), {
      name,
      ownerId: auth.currentUser.uid,
      prompt: "",
      imageUrl: "",
      generatedOutput: "",
      assets: [],
      versions: [],
      createdAt: Date.now()
    });
    loadProjects();
  } catch (error) {
    console.error("Error creating project:", error);
  }
});

// Load projects and handle redirect to project page
async function loadProjects() {
  projectList.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "projects"));

  querySnapshot.forEach(docItem => {
    const li = document.createElement("li");
    li.textContent = docItem.data().name;
    li.addEventListener("click", () => {
      // Save selected project id to localStorage
      localStorage.setItem("projectId", docItem.id);
      // Redirect to project.html
      window.location.href = "project.html";
    });
    projectList.appendChild(li);
  });
}

// Initialize dashboard
window.onload = loadProjects;
