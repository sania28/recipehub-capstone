"use strict";

const starterRecipes = [
  {
    id: "r1",
    name: "Creamy Tomato Pasta",
    category: "Dinner",
    time: 25,
    description: "Silky tomato cream sauce, herbs and perfectly cooked pasta.",
    image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=85",
    ingredients: ["Pasta", "Tomatoes", "Cream", "Garlic", "Basil"]
  },
  {
    id: "r2",
    name: "Berry Pancake Stack",
    category: "Breakfast",
    time: 20,
    description: "Fluffy golden pancakes topped with fresh seasonal berries.",
    image: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=900&q=85",
    ingredients: ["Flour", "Milk", "Eggs", "Berries", "Maple syrup"]
  },
  {
    id: "r3",
    name: "Fresh Garden Salad",
    category: "Lunch",
    time: 15,
    description: "A refreshing bowl of crunchy greens and a bright dressing.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85",
    ingredients: ["Lettuce", "Cucumber", "Tomatoes", "Olive oil", "Lemon"]
  },
  {
    id: "r4",
    name: "Chocolate Lava Cake",
    category: "Dessert",
    time: 30,
    description: "A rich chocolate cake with a warm, gooey centre.",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=85",
    ingredients: ["Chocolate", "Butter", "Sugar", "Eggs", "Flour"]
  },
  {
    id: "r5",
    name: "Avocado Toast",
    category: "Breakfast",
    time: 10,
    description: "Crispy toast topped with creamy avocado and a hint of lime.",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=900&q=85",
    ingredients: ["Bread", "Avocado", "Lime", "Chilli flakes", "Salt"]
  },
  {
    id: "r6",
    name: "Mediterranean Bowl",
    category: "Lunch",
    time: 25,
    description: "Colourful grains, fresh vegetables and a creamy dressing.",
    image: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?auto=format&fit=crop&w=900&q=85",
    ingredients: ["Rice", "Chickpeas", "Cucumber", "Tomatoes", "Yogurt"]
  },
  {
    id: "r7",
    name: "Herb Roasted Chicken",
    category: "Dinner",
    time: 45,
    description: "Juicy roasted chicken with fragrant herbs and vegetables.",
    image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=900&q=85",
    ingredients: ["Chicken", "Rosemary", "Garlic", "Olive oil", "Pepper"]
  },
  {
    id: "r8",
    name: "Strawberry Cheesecake",
    category: "Dessert",
    time: 50,
    description: "A creamy cheesecake finished with sweet strawberries.",
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=900&q=85",
    ingredients: ["Cream cheese", "Strawberries", "Biscuits", "Butter", "Sugar"]
  },
  {
    id: "r9",
    name: "Green Pesto Pasta",
    category: "Dinner",
    time: 20,
    description: "Fresh basil pesto, parmesan and pasta in every bite.",
    image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=85",
    ingredients: ["Pasta", "Basil", "Parmesan", "Olive oil", "Pine nuts"]
  }
];

const KEYS = {
  recipes: "recipehubRecipes",
  favorites: "recipehubFavorites",
  user: "recipehubUser"
};

const recipeGrid = document.getElementById("recipeGrid");
const searchInput = document.getElementById("searchInput");
const categoryList = document.getElementById("categoryList");
const sortSelect = document.getElementById("sortSelect");
const emptyState = document.getElementById("emptyState");
const loginBtn = document.getElementById("loginBtn");
const addRecipeBtn = document.getElementById("addRecipeBtn");

let selectedCategory = "All";
let showingFavorites = false;
let recipes = loadJSON(KEYS.recipes, starterRecipes);
let favorites = loadJSON(KEYS.favorites, []);
let currentUser = loadJSON(KEYS.user, null);

function loadJSON(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : structuredClone(fallback);
  } catch (error) {
    console.error("Could not load saved data:", error);
    return structuredClone(fallback);
  }
}

function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    alert("Could not save data in this browser. Please check your browser storage.");
    console.error("Could not save data:", error);
    return false;
  }
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]);
}

function safeImageURL(value) {
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

function saveRecipes() {
  return saveJSON(KEYS.recipes, recipes);
}

function getVisibleRecipes() {
  const query = searchInput.value.trim().toLowerCase();

  let result = recipes.filter(recipe => {
    const searchable = [
      recipe.name,
      recipe.category,
      recipe.description,
      ...(Array.isArray(recipe.ingredients) ? recipe.ingredients : [])
    ].join(" ").toLowerCase();

    const matchesSearch = searchable.includes(query);
    const matchesCategory =
      selectedCategory === "All" || recipe.category === selectedCategory;
    const matchesFavorite =
      !showingFavorites || favorites.includes(recipe.id);

    return matchesSearch && matchesCategory && matchesFavorite;
  });

  if (sortSelect.value === "az") {
    result.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortSelect.value === "time") {
    result.sort((a, b) => Number(a.time) - Number(b.time));
  }

  return result;
}

function renderRecipes() {
  const visibleRecipes = getVisibleRecipes();

  recipeGrid.innerHTML = visibleRecipes.map((recipe, index) => {
    const isFavorite = favorites.includes(recipe.id);
    const image = safeImageURL(recipe.image);
    const ingredients = Array.isArray(recipe.ingredients)
      ? recipe.ingredients
      : [];

    return `
      <article class="recipe-card" style="animation-delay:${Math.min(index * 60, 300)}ms">
        <div class="recipe-image-wrap">
          <img
            class="recipe-image"
            src="${escapeHTML(image)}"
            alt="${escapeHTML(recipe.name)}"
            loading="lazy"
            onerror="this.style.opacity='.25'"
          >
          <span class="recipe-category">${escapeHTML(recipe.category)}</span>
          <button
            class="favorite-button ${isFavorite ? "is-favorite" : ""}"
            data-action="favorite"
            data-id="${escapeHTML(recipe.id)}"
            type="button"
            aria-label="${isFavorite ? "Remove from favorites" : "Add to favorites"}"
            aria-pressed="${isFavorite}"
          >${isFavorite ? "♥" : "♡"}</button>
        </div>
        <div class="recipe-content">
          <div class="recipe-meta">
            <span>◷ ${Number(recipe.time)} min</span>
            <span>${ingredients.length} ingredients</span>
          </div>
          <h3 class="recipe-title">${escapeHTML(recipe.name)}</h3>
          <p class="recipe-description">${escapeHTML(recipe.description)}</p>
          <div class="recipe-actions">
            <button data-action="details" data-id="${escapeHTML(recipe.id)}" type="button">View details ↗</button>
            <button data-action="edit" data-id="${escapeHTML(recipe.id)}" type="button">Edit</button>
            <button class="delete-button" data-action="delete" data-id="${escapeHTML(recipe.id)}" type="button">Delete</button>
          </div>
        </div>
      </article>
    `;
  }).join("");

  emptyState.hidden = visibleRecipes.length !== 0;
  recipeGrid.hidden = visibleRecipes.length === 0;
}

function setCategory(category) {
  selectedCategory = category;
  showingFavorites = false;

  categoryList.querySelectorAll("[data-category]").forEach(button => {
    button.classList.toggle("active", button.dataset.category === category);
  });

  renderRecipes();
}

categoryList.addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;

  setCategory(button.dataset.category);
});

searchInput.addEventListener("input", renderRecipes);
sortSelect.addEventListener("change", renderRecipes);

recipeGrid.addEventListener("click", event => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const recipe = recipes.find(item => item.id === button.dataset.id);
  if (!recipe) return;

  const action = button.dataset.action;

  if (action === "favorite") {
    const wasFavorite = favorites.includes(recipe.id);

    favorites = wasFavorite
      ? favorites.filter(id => id !== recipe.id)
      : [...favorites, recipe.id];

    if (!saveJSON(KEYS.favorites, favorites)) return;
    renderRecipes();
  }

  if (action === "details") {
    const ingredients = Array.isArray(recipe.ingredients)
      ? recipe.ingredients.join(", ")
      : "Not provided";

    alert(
      `${recipe.name}\n\nCategory: ${recipe.category}\nCooking time: ${recipe.time} minutes\n\nAbout this recipe:\n${recipe.description}\n\nIngredients:\n${ingredients}`
    );
  }

  if (action === "edit") {
    editRecipe(recipe);
  }

  if (action === "delete") {
    deleteRecipe(recipe);
  }
});

function addRecipe() {
  const name = prompt("Recipe name:");
  if (name === null) return;

  if (!name.trim()) {
    alert("Recipe name is required.");
    return;
  }

  const category = prompt(
    "Choose a category: Breakfast, Lunch, Dinner or Dessert",
    "Dinner"
  );
  if (category === null) return;

  const validCategories = ["Breakfast", "Lunch", "Dinner", "Dessert"];
  const matchedCategory = validCategories.find(
    item => item.toLowerCase() === category.trim().toLowerCase()
  );

  if (!matchedCategory) {
    alert("Please enter Breakfast, Lunch, Dinner or Dessert.");
    return;
  }

  const timeInput = prompt("Cooking time in minutes:", "20");
  if (timeInput === null) return;

  const time = Number(timeInput);
  if (!Number.isInteger(time) || time < 1 || time > 1440) {
    alert("Enter a cooking time between 1 and 1440 minutes.");
    return;
  }

  const description = prompt("Short recipe description:");
  if (description === null) return;

  const ingredientsInput = prompt(
    "Ingredients separated by commas:",
    "Tomatoes, Garlic, Olive oil"
  );
  if (ingredientsInput === null) return;

  const ingredients = ingredientsInput
    .split(",")
    .map(item => item.trim())
    .filter(Boolean);

  if (ingredients.length === 0) {
    alert("Please add at least one ingredient.");
    return;
  }

  const imageInput = prompt(
    "Image URL (optional). Leave blank to use a default image:",
    ""
  );
  if (imageInput === null) return;

  const image = imageInput.trim()
    ? safeImageURL(imageInput.trim())
    : "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85";

  if (!image) {
    alert("Please enter a valid HTTP or HTTPS image URL.");
    return;
  }

  const newRecipe = {
    id: `recipe-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: name.trim(),
    category: matchedCategory,
    time,
    description: description.trim() || "A homemade favourite, ready to enjoy.",
    image,
    ingredients
  };

  recipes = [newRecipe, ...recipes];

  if (!saveRecipes()) {
    recipes = recipes.filter(item => item.id !== newRecipe.id);
    return;
  }

  showingFavorites = false;
  setCategory("All");
  searchInput.value = "";
  sortSelect.value = "default";
  renderRecipes();
  alert("Recipe added successfully!");
}

function editRecipe(recipe) {
  const newName = prompt("Update recipe name:", recipe.name);
  if (newName === null) return;

  if (!newName.trim()) {
    alert("Recipe name cannot be empty.");
    return;
  }

  const newDescription = prompt(
    "Update recipe description:",
    recipe.description
  );
  if (newDescription === null) return;

  const updatedRecipes = recipes.map(item =>
    item.id === recipe.id
      ? {
          ...item,
          name: newName.trim(),
          description: newDescription.trim() || "A homemade favourite."
        }
      : item
  );

  const previousRecipes = recipes;
  recipes = updatedRecipes;

  if (!saveRecipes()) {
    recipes = previousRecipes;
    return;
  }

  renderRecipes();
}

function deleteRecipe(recipe) {
  const confirmed = confirm(`Delete "${recipe.name}"? This cannot be undone.`);
  if (!confirmed) return;

  const previousRecipes = recipes;
  const previousFavorites = favorites;

  recipes = recipes.filter(item => item.id !== recipe.id);
  favorites = favorites.filter(id => id !== recipe.id);

  if (!saveRecipes()) {
    recipes = previousRecipes;
    favorites = previousFavorites;
    return;
  }

  if (!saveJSON(KEYS.favorites, favorites)) {
    recipes = previousRecipes;
    favorites = previousFavorites;
    saveRecipes();
    return;
  }

  renderRecipes();
}

function updateLoginButton() {
  if (currentUser) {
    loginBtn.innerHTML = `Hi, ${escapeHTML(currentUser)} <span>↗</span>`;
    loginBtn.setAttribute("aria-label", "Sign out");
  } else {
    loginBtn.innerHTML = 'Sign In <span>↗</span>';
    loginBtn.setAttribute("aria-label", "Sign in");
  }
}

loginBtn.addEventListener("click", () => {
  if (currentUser) {
    if (!confirm("Would you like to sign out?")) return;

    currentUser = null;
    localStorage.removeItem(KEYS.user);
    updateLoginButton();
    alert("You have signed out.");
    return;
  }

  const name = prompt("Welcome to RecipeHub! Enter your name to continue:");
  if (name === null) return;

  if (!name.trim()) {
    alert("Please enter your name.");
    return;
  }

  currentUser = name.trim().slice(0, 40);

  if (!saveJSON(KEYS.user, currentUser)) {
    currentUser = null;
    return;
  }

  updateLoginButton();
  alert(`Welcome to RecipeHub, ${currentUser}!`);
});

addRecipeBtn.addEventListener("click", addRecipe);

document.querySelectorAll('.nav-links a, .logo, .footer a[href="#discover"]').forEach(link => {
  link.addEventListener("click", () => {
    showingFavorites = false;
  });
});

const favoritesLink = [...document.querySelectorAll(".nav-links a")]
  .find(link => link.textContent.toLowerCase().includes("favorites"));

if (favoritesLink) {
  favoritesLink.addEventListener("click", event => {
    event.preventDefault();
    showingFavorites = true;
    selectedCategory = "All";

    categoryList.querySelectorAll("[data-category]").forEach(button => {
      button.classList.toggle("active", button.dataset.category === "All");
    });

    renderRecipes();
    document.getElementById("recipes").scrollIntoView({ behavior: "smooth" });
  });
}

updateLoginButton();
renderRecipes();
