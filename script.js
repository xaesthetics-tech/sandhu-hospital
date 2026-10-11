
document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-links");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      const opened = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(opened));
      toggle.textContent = opened ? "×" : "☰";
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.textContent = "☰";
      });
    });
  }

  document.querySelectorAll("[data-service]").forEach(function (link) {
    link.addEventListener("click", function () {
      const select = document.querySelector("#treatment");
      if (select) {
        select.value = link.dataset.service;
      }
    });
  });

  const form = document.querySelector("#appointmentForm");
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!form.reportValidity()) return;

      const name = document.querySelector("#patientName").value.trim();
      const phone = document.querySelector("#patientPhone").value.trim();
      const treatment = document.querySelector("#treatment").value;
      const message = document.querySelector("#message").value.trim();

      const whatsappMessage = [
        "Hello Sandhu Hospital, I would like to enquire about an appointment.",
        "",
        "Name: " + name,
        "Phone: " + phone,
        "Treatment enquiry: " + treatment,
        message ? "Message: " + message : "",
        "",
        "Please let me know the available appointment times."
      ].filter(Boolean).join("\n");

      const url = "https://wa.me/919608555000?text=" +
        encodeURIComponent(whatsappMessage);

      window.open(url, "_blank", "noopener,noreferrer");

      const status = document.querySelector("#formMessage");
      if (status) {
        status.style.display = "block";
        status.textContent =
          "WhatsApp should open with your enquiry. Please review it and press Send.";
      }
    });
  }

  document.querySelectorAll("[data-year]").forEach(function (element) {
    element.textContent = new Date().getFullYear();
  });
});
