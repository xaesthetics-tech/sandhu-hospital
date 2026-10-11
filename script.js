"use strict";

const CLINIC = {
  name: "Sandhu Hospital",
  doctor: "Dr. Ravdeep Singh Sandhu",
  phone: "+91 96085 55000",
  whatsapp: "919608555000",
  email: "sandhuravdeep@yahoo.co.in",
  instagram: "https://www.instagram.com/drsandhuclinic/",
  maps: "https://maps.app.goo.gl/mGq7jTttx7FKYtQCA",
  address: "Near Star Palace, Shamsher Nagar, Sirhind, Punjab 140406, India"
};

/*
  IMAGE SETUP
  Assumed directory: images/
  Supported extensions: .jpg, .jpeg, .png, .webp
  If your images are stored elsewhere, change IMAGE_BASE.
*/
const IMAGE_BASE = "images/";

const IMAGE_NAMES = [
  "hospital", "doctor", "hair", "mole", "acne", "tattoo", "scar"
];

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

function setupImage(image) {
  const key = image.dataset.image;
  if (!key || !IMAGE_NAMES.includes(key)) return;

  const fallback = image.parentElement.querySelector(".image-placeholder");
  let index = 0;

  function tryNext() {
    if (index >= IMAGE_EXTENSIONS.length) {
      image.hidden = true;
      if (fallback) {
        fallback.hidden = false;
        fallback.textContent =
          "Image unavailable. Check the file path for " + key + ".";
      }
      return;
    }

    image.src = IMAGE_BASE + key + IMAGE_EXTENSIONS[index];
    index += 1;
  }

  image.addEventListener("load", () => {
    image.hidden = false;
    if (fallback) fallback.hidden = true;
  });

  image.addEventListener("error", tryNext);

  tryNext();
}

document.querySelectorAll("img[data-image]").forEach(setupImage);

/* Shared mobile navigation */
const menuButton = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

function closeMenu() {
  if (!menuButton || !mainNav) return;
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation");
  mainNav.classList.remove("is-open");
  document.body.classList.remove("menu-open");
}

if (menuButton && mainNav) {
  menuButton.addEventListener("click", () => {
    const opening = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(opening));
    menuButton.setAttribute(
      "aria-label",
      opening ? "Close navigation" : "Open navigation"
    );
    mainNav.classList.toggle("is-open", opening);
    document.body.classList.toggle("menu-open", opening);
  });

  mainNav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 820) closeMenu();
  });
}

/* Reveal elements only when motion is allowed */
const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const revealItems = document.querySelectorAll(".reveal");

if (reduceMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach(item => item.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach(item => observer.observe(item));
}

/* Keep footer year current */
document.querySelectorAll("[data-current-year]").forEach(element => {
  element.textContent = String(new Date().getFullYear());
});

/* FAQ: buttons control their associated answer panels */
document.querySelectorAll(".faq-question").forEach(button => {
  button.addEventListener("click", () => {
    const answerId = button.getAttribute("aria-controls");
    const answer = answerId ? document.getElementById(answerId) : null;
    if (!answer) return;

    const isOpen = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!isOpen));
    answer.hidden = isOpen;
  });
});

/* Prefill a treatment selected from the services page */
const treatmentSelect = document.querySelector("#treatment");
if (treatmentSelect) {
  const params = new URLSearchParams(window.location.search);
  const requestedTreatment = params.get("treatment");

  if (requestedTreatment) {
    const matchingOption = Array.from(treatmentSelect.options).find(
      option => option.value.toLowerCase() === requestedTreatment.toLowerCase()
    );

    if (matchingOption) treatmentSelect.value = matchingOption.value;
  }
}

/* WhatsApp enquiry: client-side validation, no false booking confirmation */
const enquiryForm = document.querySelector("#enquiry-form");

if (enquiryForm) {
  const feedback = document.querySelector("#form-message");

  enquiryForm.addEventListener("submit", event => {
    event.preventDefault();

    if (feedback) {
      feedback.textContent = "";
      feedback.classList.remove("form-message--error");
    }

    if (!enquiryForm.reportValidity()) return;

    const data = new FormData(enquiryForm);

    const fullName = String(data.get("fullName") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const treatment = String(data.get("treatment") || "").trim();
    const preferredDate = String(data.get("preferredDate") || "").trim();
    const preferredTime = String(data.get("preferredTime") || "").trim();
    const message = String(data.get("message") || "").trim();
    const consent = data.get("consent");

    if (!fullName || !phone || !treatment || !consent) {
      if (feedback) {
        feedback.textContent = "Please complete the required fields and consent.";
        feedback.classList.add("form-message--error");
      }
      return;
    }

    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length < 7 || phoneDigits.length > 15) {
      if (feedback) {
        feedback.textContent =
          "Please enter a valid phone or WhatsApp number, including the country code if needed.";
        feedback.classList.add("form-message--error");
      }
      return;
    }

    const lines = [
      "Hello " + CLINIC.name + ",",
      "",
      "I would like to enquire about a consultation.",
      "",
      "Name: " + fullName,
      "My phone/WhatsApp: " + phone,
      "Treatment of interest: " + treatment,
      "Preferred date: " + (preferredDate || "Not specified"),
      "Preferred time: " + (preferredTime || "Not specified"),
      "Additional message: " + (message || "Not provided"),
      "",
      "Please let me know about availability and the next steps."
    ];

    const whatsappUrl =
      "https://wa.me/" + CLINIC.whatsapp +
      "?text=" + encodeURIComponent(lines.join("\n"));

    if (feedback) {
      feedback.textContent =
        "Your enquiry is ready. WhatsApp will open so you can review and send it to the clinic. Your enquiry is not sent until you press Send in WhatsApp.";
      feedback.classList.remove("form-message--error");
    }

    const openedWindow = window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    /*
      Some mobile browsers block new windows. Keep a direct fallback
      available instead of silently discarding the enquiry.
    */
    if (!openedWindow) {
      window.location.href = whatsappUrl;
    }
  });
}
