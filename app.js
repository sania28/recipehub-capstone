const starterRecipes = [
  {
    id: 1,
    name: "Creamy Tomato Pasta",
    category: "Dinner",
    time: 25,
    rating: 4.9,
    description: "Silky tomato cream sauce, fresh basil and perfectly cooked pasta.",
    image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=800&q=80",
    ingredients: ["Pasta", "Tomatoes", "Cream", "Garlic", "Fresh basil"]
  },
  {
    id: 2,
    name: "Berry Pancake Stack",
    category: "Breakfast",
    time: 20,
    rating: 4.8,
    description: "Fluffy golden pancakes topped with fresh berries and maple syrup.",
    image: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=800&q=80",
    ingredients: ["Flour", "Milk", "Eggs", "Berries", "Maple syrup"]
  },
  {
    id: 3,
    name: "Fresh Garden Salad",
    category: "Lunch",
    time: 15,
    rating: 4.7,
    description: "A refreshing mix of crisp greens, colourful vegetables and herbs.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
    ingredients: ["Lettuce", "Tomatoes", "Cucumber", "Olive oil", "Lemon"]
  },
  {
    id: 4,
    name: "Chocolate Lava Cake",
    category: "Dessert",
    time: 30,
    rating: 5.0,
    description: "Rich chocolate cake with a warm, soft and gooey centre.",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
    ingredients: ["Dark chocolate", "Butter", "Flour", "Eggs", "Sugar"]
  },
  {
    id: 5,
    name: "Avocado Toast",
    category: "Breakfast",
    time: 10,
    rating: 4.6,
    description: "Creamy smashed avocado with lemon on crunchy toasted bread.",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80",
    ingredients: ["Bread", "Avocado", "Lemon", "Chilli flakes", "Salt"]
  },
  {
    id: 6,
    name: "Mediterranean Bowl",
    category: "Lunch",
    time: 20,
    rating: 4.8,
    description: "A colourful bowl of grains, vegetables and a zesty dressing.",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80",
    ingredients: ["Rice", "Chickpeas", "Cucumber", "Tomatoes", "Yogurt"]
  },
  {
    id: 7,
    name: "Herb Roasted Chicken",
    category: "Dinner",
    time: 45,
    rating: 4.9,
    description: "Juicy roasted chicken with fragrant herbs and golden vegetables.",
    image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=800&q=80",
    ingredients: ["Chicken", "Rosemary", "Garlic", "Olive oil", "Potatoes"]
  },
  {
    id: 8,
    name: "Strawberry Cheesecake",
    category: "Dessert",
    time: 40,
    rating: 4.9,
    description: "A smooth and creamy cheesecake finished with fresh strawberries.",
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80",
    ingredients: ["Cream cheese", "Strawberries", "Biscuits", "Butter", "Sugar"]
  },
  {
    id: 9,
    name: "Green Pesto Pasta",
    category: "Dinner",
    time: 18,
    rating: 4.7,
    description: "A fragrant basil pesto pasta with a sprinkle of parmesan.",
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80",
    ingredients: ["Pasta", "Basil", "Pine nuts", "Olive oil", "Parmesan"]
  }
];

const STORAGE_KEYS = {
  recipes: "recipehubRecipes",
  favorites: "recipehubFavorites",
  user: "recipehubUser"
};

const $ = (selector) => document.querySelector(selector);

let recipes = loadData(STORAGE_KEYS.recipes, starterRecipes);
let favorites = loadData(STORAGE_KEYS.favorites, []);
let currentCategory = "All";
let searchTerm = "";
let currentUser = loadData(STORAGE_KEYS.user, null);

function loadData(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved === null ? fallback : JSON.parse(saved);
  } catch {
    return fallback;
  }
}

function saveData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function renderRecipes() {
  const grid = $("#recipeGrid");
  const emptyState = $("#emptyState");
  const sortMode = $("#sortSelect").value;

  let visibleRecipes = recipes.filter((recipe) => {
    const matchesCategory =
      currentCategory === "All" || recipe.category === currentCategory;

    const searchableText = [
      recipe.name,
      recipe.category,
      recipe.description,
      ...(Array.isArray(recipe.ingredients) ? recipe.ingredients : [])
    ].join(" ").toLowerCase();

    return matchesCategory && searchableText.includes(searchTerm.toLowerCase());
  });

  if (sortMode === "az") {
    visibleRecipes.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortMode === "time") {
    visibleRecipes.sort((a, b) => a.time - b.time);
  }

  emptyState.hidden = visibleRecipes.length > 0;

  if (visibleRecipes.length === 0) {
    grid.innerHTML = "";
    return;
  }

  grid.innerHTML = visibleRecipes.map((recipe, index) => {
    const isFavorite = favorites.includes(recipe.id);

    return `
      <article class="recipe-card" style="animation-delay:${index * 70}ms">
        <div class="recipe-image-wrap">
          <img
            src="${escapeHTML(recipe.image)}"
            alt="${escapeHTML(recipe.name)}"
            loading="lazy"
          />
          <span class="recipe-category">${escapeHTML(recipe.category)}</span>
          <button
            class="favorite-button ${isFavorite ? "favorited" : ""}"
            data-action="favorite"
            data-id="${recipe.id}"
            type="button"
            aria-label="${isFavorite ? "Remove from" : "Add to"} favorites"
          >${isFavorite ? "♥" : "♡"}</button>
        </div>
        <div class="recipe-info">
          <h3>${escapeHTML(recipe.name)}</h3>
          <p>${escapeHTML(recipe.description)}</p>
          <div class="recipe-meta">
            <span>◷ ${Number(recipe.time)} min</span>
            <strong>★ ${Number(recipe.rating).toFixed(1)}</strong>
          </div>
          <div class="recipe-actions">
            <button data-action="details" data-id="${recipe.id}" type="button">View Recipe ↗</button>
            <button data-action="edit" data-id="${recipe.id}" type="button">Edit</button>
            <button data-action="delete" data-id="${recipe.id}" type="button">Delete</button>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

function setCategory(category) {
  currentCategory = category;

  document.querySelectorAll(".category-chip").forEach((button) => {
    button.classList.toggle("selected", button.dataset.category === category);
  });

  renderRecipes();
}

$("#searchInput").addEventListener("input", (event) => {
  searchTerm = event.target.value.trim();
  renderRecipes();
});

$("#searchBtn").addEventListener("click", () => {
  searchTerm = $("#searchInput").value.trim();
  renderRecipes();
});

$("#sortSelect").addEventListener("change", renderRecipes);

$("#categoryList").addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (button) setCategory(button.dataset.category);
});

$("#recipeGrid").addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;

  const id = Number(button.dataset.id);
  const recipe = recipes.find((item) => item.id === id);
  if (!recipe) return;

  switch (button.dataset.action) {
    case "favorite":
      favorites = favorites.includes(id)
        ? favorites.filter((favoriteId) => favoriteId !== id)
        : [...favorites, id];

      saveData(STORAGE_KEYS.favorites, favorites);
      renderRecipes();
      break;

    case "details":
      alert(
        `${recipe.name}\n\nIngredients:\n• ${recipe.ingredients.join("\n• ")}\n\nPreparation time: ${recipe.time} minutes`
      );
      break;

    case "edit": {
      const updatedName = prompt("Edit recipe name:", recipe.name);
      if (updatedName === null || !updatedName.trim()) return;

      const updatedDescription = prompt(
        "Edit recipe description:",
        recipe.description
      );
      if (updatedDescription === null) return;

      recipes = recipes.map((item) =>
        item.id === id
          ? {
              ...item,
              name: updatedName.trim(),
              description: updatedDescription.trim()
            }
          : item
      );

      saveData(STORAGE_KEYS.recipes, recipes);
      renderRecipes();
      break;
    }

    case "delete":
      if (confirm(`Delete "${recipe.name}"?`)) {
        recipes = recipes.filter((item) => item.id !== id);
        favorites = favorites.filter((favoriteId) => favoriteId !== id);

        saveData(STORAGE_KEYS.recipes, recipes);
        saveData(STORAGE_KEYS.favorites, favorites);
        renderRecipes();
      }
      break;
  }
});

$("#loginBtn").addEventListener("click", () => {
  if (currentUser) {
    if (confirm(`Sign out ${currentUser.name}?`)) {
      currentUser = null;
      localStorage.removeItem(STORAGE_KEYS.user);
      updateLoginButton();
    }
    return;
  }

  const name = prompt("Welcome to RecipeHub! Enter your name to sign in:");
  if (!name || !name.trim()) return;

  currentUser = { name: name.trim() };
  saveData(STORAGE_KEYS.user, currentUser);
  updateLoginButton();
});

function updateLoginButton() {
  const button = $("#loginBtn");

  if (currentUser) {
    button.innerHTML = `${escapeHTML(currentUser.name)} · Sign Out`;
  } else {
    button.textContent = "Sign In ↗";
  }
}

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", (event) => {
    if (link.hash === "#favorites") {
      event.preventDefault();
      setCategory("All");

      const favoriteRecipes = recipes.filter((recipe) =>
        favorites.includes(recipe.id)
      );

      $("#recipeGrid").innerHTML = favoriteRecipes.map((recipe) => `
        <article class="recipe-card">
          <div class="recipe-image-wrap">
            <img src="${escapeHTML(recipe.image)}" alt="${escapeHTML(recipe.name)}" loading="lazy" />
            <span class="recipe-category">${escapeHTML(recipe.category)}</span>
          </div>
          <div class="recipe-info">
            <h3>${escapeHTML(recipe.name)}</h3>
            <p>${escapeHTML(recipe.description)}</p>
            <div class="recipe-meta"><span>◷ ${Number(recipe.time)} min</span><strong>★ ${Number(recipe.rating).toFixed(1)}</strong></div>
          </div>
        </article>
      `).join("");

      $("#emptyState").hidden = favoriteRecipes.length > 0;
      $("#recipes").scrollIntoView({ behavior: "smooth" });
    }
  });
});

updateLoginButton();
renderRecipes();
