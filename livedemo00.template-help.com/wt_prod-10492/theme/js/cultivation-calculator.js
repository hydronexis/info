import { db } from "./firebase-config.js";
import { LOCAL_CROP_DATA } from "./crops-data.js";
import { requirePageAccess } from "./plan-guard.js";
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

await requirePageAccess();

const cropSelect = document.getElementById("calculatorCrop");
const goalSelect = document.getElementById("calculatorGoal");
const plantsInput = document.getElementById("calculatorPlants");
const plantsLabel = document.getElementById("calculatorPlantsLabel");
const productionInput = document.getElementById("calculatorProduction");
const productionLabel = document.getElementById("calculatorProductionLabel");
const button = document.getElementById("calculatorButton");
const results = document.getElementById("calculatorResults");
const feedback = document.getElementById("calculatorFeedback");
let cropData = [];

function showFeedback(message, isError = false) {
  feedback.textContent = message;
  feedback.hidden = false;
  feedback.style.background = isError ? "#fff0ec" : "#eff5ec";
  feedback.style.color = isError ? "#8b2d1e" : "#285421";
}

function validNumber(value) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

// Calculation Engine: it only combines coefficients supplied by reviewed
// crop data. Missing values remain explicitly marked as [DATA REQUIRED].
function calculateCultivation(crop, plants) {
  const calculate = (field) => validNumber(crop[field])
    ? crop[field] * plants
    : null;
  return [
    ["Estimated Seeds", calculate("seedsPerPlant"), "seeds"],
    ["Estimated Growing Spaces", calculate("spacesPerPlant"), "spaces"],
    ["Estimated Water", calculate("waterLitersPerPlant"), "L"],
    ["Estimated Nutrients", calculate("nutrientMlPerPlant"), "ml"],
    ["Estimated Materials", calculate("materialsPerPlant"), "units"],
    ["Estimated Production", calculate("yieldPerPlant"), crop.yieldUnit || "units"]
  ];
}

function renderResults(rows) {
  results.replaceChildren(...rows.map(([label, value, unit]) => {
    const card = document.createElement("article");
    card.className = "account-list-item";
    const title = document.createElement("h3");
    title.textContent = label;
    const output = document.createElement("strong");
    output.textContent = value == null
      ? "[DATA REQUIRED]"
      : `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(value)} ${unit}`;
    card.append(title, output);
    return card;
  }));
}

function updateGoalInputs() {
  const productionMode = goalSelect.value === "production";
  plantsLabel.hidden = productionMode;
  plantsInput.disabled = productionMode;
  plantsInput.required = !productionMode;
  productionLabel.hidden = !productionMode;
  productionInput.disabled = !productionMode;
  productionInput.required = productionMode;
}

goalSelect.addEventListener("change", updateGoalInputs);
updateGoalInputs();

async function loadCropData() {
  try {
    const snapshot = await getDocs(collection(db, "cultivationData"));
    cropData = snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
  } catch {
    cropData = [...LOCAL_CROP_DATA];
  }

  cropSelect.replaceChildren();
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = cropData.length ? "Select a crop" : "[DATA REQUIRED] No reviewed crops available";
  cropSelect.appendChild(placeholder);
  cropData.forEach((crop) => {
    const option = document.createElement("option");
    option.value = crop.id;
    option.textContent = crop.name || crop.id;
    cropSelect.appendChild(option);
  });
  cropSelect.disabled = cropData.length === 0;
  button.disabled = cropData.length === 0;
  if (!cropData.length) {
    showFeedback("[DATA REQUIRED] Add reviewed crop coefficients in Firestore before calculations can run.", true);
  }
}

document.getElementById("calculatorForm")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const crop = cropData.find((entry) => entry.id === data.get("crop"));
  const productionMode = data.get("goal") === "production";
  let plants = Math.trunc(Number(data.get("plants")));
  if (productionMode) {
    const desiredProduction = Number(data.get("production"));
    if (!crop || !validNumber(crop.yieldPerPlant) || crop.yieldPerPlant <= 0) {
      showFeedback("[DATA REQUIRED] This crop needs a reviewed yield-per-plant coefficient before production targets can be calculated.", true);
      return;
    }
    if (!Number.isFinite(desiredProduction) || desiredProduction <= 0) {
      showFeedback("Enter a valid desired production amount.", true);
      return;
    }
    plants = Math.ceil(desiredProduction / crop.yieldPerPlant);
  }
  if (!crop || !Number.isInteger(plants) || plants < 1) {
    showFeedback("Choose a reviewed crop and enter a valid number of plants.", true);
    return;
  }
  const rows = calculateCultivation(crop, plants);
  if (productionMode) rows.unshift(["Required Plants", plants, "plants"]);
  renderResults(rows);
  showFeedback("Results use only the reviewed coefficients stored for this crop.");
});

await loadCropData();
