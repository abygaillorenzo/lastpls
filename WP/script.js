// ===============================
// Global Fundraising Data
// ===============================
// Edit these top values to adjust target/current values
const targetAmount = 3000000;
let currentAmount = 1850500; // already collected
let totalDonors = 48266; // approx donor count

// Elements references
const progressBar = document.getElementById("progress-bar");
const totalDonorsEl = document.getElementById("total-donors");
const totalRaisedEl = document.getElementById("total-raised");
const progressPercentEl = document.getElementById("progress-percent");

// Updates progress bar and displayed stats
function updateProgressBar() {
  const percent = Math.min((currentAmount / targetAmount) * 100, 100);
  progressBar.style.width = percent + "%";

  // simple count-up animation for the raised amount
  const currentDisplay = parseInt(progressBar.dataset.value || 0, 10);
  const newValue = currentAmount;
  const step = Math.ceil((newValue - currentDisplay) / 20) || 1;
  let counter = currentDisplay;

  const interval = setInterval(() => {
    counter += step;
    if (counter >= newValue) {
      counter = newValue;
      clearInterval(interval);
    }
    progressBar.textContent = `$${counter.toLocaleString()} raised of $${targetAmount.toLocaleString()}`;
    progressBar.dataset.value = counter;
  }, 50);

  totalDonorsEl.textContent = totalDonors.toLocaleString();
  totalRaisedEl.textContent = currentAmount.toLocaleString();
  progressPercentEl.textContent = percent.toFixed(1) + "%";
}

updateProgressBar();

// ===============================
// Donor Feed helpers
// ===============================
const donorFeedAlt = document.getElementById("donor-feed-alt");

// generate initials for avatar
function getInitials(name) {
  if (!name) return "NA";
  return name.split(" ").map(word => word[0]).join("").toUpperCase();
}

// times like "just now", "10s ago", "5m ago"
function timeAgo(seconds) {
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds/60)}m ago`;
  return `${Math.floor(seconds/3600)}h ago`;
}

// add a donor card to the top of the feed
function addModernDonor(name, amount, message = "") {
  totalDonors++;
  currentAmount += amount;
  updateProgressBar();

  const initials = getInitials(name);
  const timestamp = Date.now();

  const donorCard = document.createElement("div");
  donorCard.classList.add("donor-card");
  donorCard.innerHTML = `
    <div class="donor-left">
      <div class="donor-avatar">${initials}</div>
      <div class="donor-info">
        <h4>${name}</h4>
        <small data-time="${timestamp}">just now</small>
        ${message ? `<div class="donor-message">${message}</div>` : ""}
      </div>
    </div>
    <div class="donor-amount">$${amount.toFixed(2)}</div>
  `;
  donorFeedAlt.insertBefore(donorCard, donorFeedAlt.firstChild);

  // keep feed height reasonable: remove oldest if too many
  const maxCards = 120;
  const cards = donorFeedAlt.querySelectorAll(".donor-card");
  if (cards.length > maxCards) donorFeedAlt.removeChild(cards[cards.length - 1]);
}

// update relative times for donor cards
setInterval(() => {
  const times = document.querySelectorAll(".donor-info small");
  times.forEach(t => {
    const seconds = Math.floor((Date.now() - t.dataset.time) / 1000);
    t.textContent = timeAgo(seconds);
  });
}, 5000);

// ===============================
// Simulate Donor Form (manual)
// ===============================
const simForm = document.getElementById("simulate-donor-form");
simForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("sim-name").value.trim();
  const amount = parseFloat(document.getElementById("sim-amount").value);
  const message = document.getElementById("sim-message").value.trim();
  if (name && amount && !Number.isNaN(amount)) {
    addModernDonor(name, amount, message);
    simForm.reset();
  }
});

// ===============================
// Auto-Simulated Donations
// - Larger name pool and generator to avoid repeats
// - Expand arrays below to add more variety
// ===============================
const firstNames = [
  "Sophia","Liam","Olivia","Noah","Emma","James","Mia","Lucas","Ella","Aiden",
  "Ethan","Isabella","Mason","Amelia","Logan","Ava","Elijah","Harper","Oliver","Charlotte",
  "Benjamin","Emily","Daniel","Abigail","Henry","Sofia","Jackson","Aria","Michael","Scarlett",
  "Sebastian","Victoria","Alexander","Grace","William","Zoe","Jacob","Chloe","Carter","Layla",
  "Nathan","Nora","Aaron","Luna","Caleb","Hannah","Samuel","Leah","Owen","Penelope"
];

const lastInitials = [
  "A.","B.","C.","D.","E.","F.","G.","H.","I.","J.","K.","L.","M.","N.","O.","P.","Q.","R.","S.","T."
];

// simple name generator
function generateRandomName() {
  const first = firstNames[Math.floor(Math.random() * firstNames.length)];
  const last = lastInitials[Math.floor(Math.random() * lastInitials.length)];
  return `${first} ${last}`;
}

const messages = ["Keep going!", "God bless", "Happy to help", "For the kids", "Peace and love", "With hope", "Stay strong", ""];

// auto-insert donations every 7 seconds
setInterval(() => {
  const name = generateRandomName();
  const message = messages[Math.floor(Math.random() * messages.length)];
  const amounts = [10, 20, 25, 30, 50, 75, 100, 150, 200, 300];
  const amount = amounts[Math.floor(Math.random() * amounts.length)];
  addModernDonor(name, amount, message);
}, 7000);

// ===============================
// Dynamic Supply Distribution
// - Add more items here to show in the supply grid
// ===============================
const supplies = [
  { img: "images/3.jpg", desc: "🍞 Distributed 500 food packages to families in need." },
  { img: "images/12.jpg", desc: "💧 Delivered clean drinking water to 200 households." },
  { img: "images/med.webp", desc: "💊 Supplied essential medicines and first aid kits to clinics." },
  { img: "images/clothes.webp", desc: "👕 Distributed clothing and blankets to children." },
  { img: "images/school.webp", desc: "📚 Provided 300 school kits to support education." },
  { img: "images/shelter.png", desc: "🏠 Set up 50 emergency shelters for families." }
];

const supplyGrid = document.getElementById("supply-grid");
supplies.forEach(item => {
  const div = document.createElement("div");
  div.classList.add("grid-item");
  div.innerHTML = `<img src="${item.img}" alt="Supply image"><p>${item.desc}</p>`;
  supplyGrid.appendChild(div);
});

// ===============================
// Thoughts & Opinions Section
// ===============================
const thoughtsForm = document.getElementById("thoughts-form");
const thoughtsFeed = document.getElementById("thoughts-feed");

if (thoughtsForm) {
  thoughtsForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = document.getElementById("thought-message").value.trim();
    if (!message) return;

    const card = document.createElement("div");
    card.classList.add("thought-card");
    card.textContent = message;

    thoughtsFeed.insertBefore(card, thoughtsFeed.firstChild);
    thoughtsForm.reset();
  });
}

// ===============================
// Smooth Scroll for Donate Buttons
// ===============================
document.getElementById("donateOpen")?.addEventListener("click", () => {
  document.getElementById("payment").scrollIntoView({ behavior: "smooth" });
});
document.getElementById("donateOpenMobile")?.addEventListener("click", () => {
  document.getElementById("payment").scrollIntoView({ behavior: "smooth" });
});
