
const FEATURE_NAMES = ["SEX", "AGEIR", "TC", "HDL", "SMOKE_", "BPMED", "DIAB_01"];

document.querySelectorAll(".toggle-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const name = btn.dataset.name;
    document.querySelectorAll(`[data-name="${name}"]`).forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(name).value = btn.dataset.value;
  });
});


["AGEIR", "TC", "HDL"].forEach(id => {
  const slider = document.getElementById(id);
  const output = document.getElementById(id + "-out");
  slider.addEventListener("input", () => output.value = slider.value);
});


const form      = document.getElementById("predForm");
const submitBtn = document.getElementById("submitBtn");
const btnText   = submitBtn.querySelector(".btn-text");
const btnLoader = submitBtn.querySelector(".btn-loader");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  
  const toggleIds = ["SEX", "SMOKE_", "BPMED", "DIAB_01"];
  for (const id of toggleIds) {
    if (!document.getElementById(id).value) {
      alert(`Please select a value for: ${id}`);
      return;
    }
  }

  const data = {};
  FEATURE_NAMES.forEach(name => {
    const el = document.getElementById(name) || form.elements[name];
    data[name] = el ? el.value : "0";
  });

  submitBtn.disabled = true;
  btnText.hidden  = true;
  btnLoader.hidden = false;

  try {
    const res  = await fetch("/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || "Unknown error");
    showResult(json.risk_score, json.label, json.category);
  } catch (err) {
    alert("Prediction failed: " + err.message);
  } finally {
    submitBtn.disabled = false;
    btnText.hidden  = false;
    btnLoader.hidden = true;
  }
});


function showResult(score, label, category) {
  const resultDiv   = document.getElementById("result");
  const resultLabel = document.getElementById("resultLabel");
  const resultSub   = document.getElementById("resultSub");
  const scoreNum    = document.getElementById("scoreNum");
  const ringFill    = document.getElementById("ringFill");
  const riskMarker  = document.getElementById("riskMarker");

  resultDiv.classList.remove("hidden");
  resultDiv.scrollIntoView({ behavior: "smooth", block: "start" });


  const poly  = document.getElementById("ecgPoly");
  const clone = poly.cloneNode(true);
  poly.parentNode.replaceChild(clone, poly);


  resultLabel.textContent = label;
  resultLabel.className   = "result-label " + category;

  const subs = {
    "low":       "Your risk appears low. Maintain a healthy lifestyle.",
    "moderate":  "Moderate risk detected. Lifestyle changes are advisable.",
    "high":      "High risk identified. Please consult your physician.",
    "very-high": "Very high risk. Seek medical advice promptly."
  };
  resultSub.textContent = subs[category] || "";

  
  const colours = { "low": "#22c55e", "moderate": "#eab308", "high": "#f97316", "very-high": "#e8334a" };
  ringFill.style.stroke = colours[category] || "#e8334a";

  
  const displayPct = Math.min(score, 100);
  const circumference = 314; // 2π×50
  setTimeout(() => {
    ringFill.style.strokeDashoffset = circumference - (circumference * displayPct / 100);
  }, 80);

 
  animateCounter(scoreNum, 0, score, 1100);

 
  const markerPct = Math.min((score / 40) * 100, 99);
  setTimeout(() => { riskMarker.style.left = markerPct + "%"; }, 80);
}

function animateCounter(el, from, to, duration) {
  const start = performance.now();
  (function step(now) {
    const t = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    el.textContent = (from + (to - from) * ease).toFixed(1);
    if (t < 1) requestAnimationFrame(step);
  })(start);
}
