


function initHeaderScripts() {

  const btn = document.querySelector("[data-menu-btn]");
  const mobileNav = document.querySelector("[data-mobile-nav]");
  const overlay = document.getElementById("menuOverlay");

  if (btn && mobileNav) {
  btn.addEventListener("click", () => {
          btn.classList.toggle("active");   // ⭐ ADD THIS
    mobileNav.classList.toggle("open");
    overlay?.classList.toggle("active");
  });
}

document.querySelectorAll(".mobile-nav a").forEach(link => {
  link.addEventListener("click", () => {
    btn.classList.remove("active");   // ⭐ ADD THIS
    mobileNav.classList.remove("open");
    overlay?.classList.remove("active");
  });
});


  if (overlay) {
    overlay.addEventListener("click", () => {
      btn.classList.remove("active");
      mobileNav.classList.remove("open");
      overlay.classList.remove("active");
    });
  }

  // Active nav link
  const path = location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll("a[data-nav]").forEach(link => {
    if (link.getAttribute("href") === path) {
      link.classList.add("active");
    }
  });
}


// ===============================
// SMOOTH SCROLL OFFSET
// ===============================

window.addEventListener("load", () => {

  if (location.hash) {
    const el = document.querySelector(location.hash);

    if (el) {
      setTimeout(() => {

        const y = el.getBoundingClientRect().top + window.scrollY - 90;

        window.scrollTo({
          top: y,
          behavior: "smooth"
        });

      }, 50);
    }
  }

});


// ===============================
// PRODUCTS PAGE
// ===============================

document.addEventListener("DOMContentLoaded", function () {

  const productList = document.getElementById("productList");
  if (!productList) return;

  const products = window.productData || [];

  const categorySelect = document.getElementById("categorySelect");
  const searchInput = document.getElementById("search");

  function initCategories() {

    const categories = ["All", ...new Set(products.map(p => p.category))];

    categories.forEach(cat => {

      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat;

      categorySelect.appendChild(option);

    });

  }

  function renderProducts() {

    const selectedCategory = categorySelect.value;
    const searchText = searchInput.value.toLowerCase();

    productList.innerHTML = "";

    const filtered = products.filter(p => {

      const matchCategory =
        selectedCategory === "All" || p.category === selectedCategory;

      const matchSearch =
        p.product.toLowerCase().includes(searchText) ||
        (p.type && p.type.toLowerCase().includes(searchText)) ||
        p.typicalUse.toLowerCase().includes(searchText);

      return matchCategory && matchSearch;

    });

    if (filtered.length === 0) {
      productList.innerHTML = "<p>No products found.</p>";
      return;
    }

    const grouped = {};

    filtered.forEach(p => {
      if (!grouped[p.category]) grouped[p.category] = [];
      grouped[p.category].push(p);
    });

    for (const category in grouped) {

      const section = document.createElement("div");

      let tableHTML = `
      <h2>${category}</h2>
      <table class="table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Typical Use</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
      `;

      grouped[category].forEach(p => {

        const pdfLink = p.pdf ? p.pdf : "assets/pdf/sample.pdf";

        tableHTML += `
        <tr>
          <td>
            <strong>${p.product}</strong>
            ${p.type ? `<br><span class="badge">${p.type}</span>` : ""}
          </td>

          <td>${p.typicalUse}</td>

          <td>
            <button class="btn primary" onclick="openPDFModal('${pdfLink}')">
              View Details
            </button>
          </td>
        </tr>
        `;

      });

      tableHTML += `
        </tbody>
      </table>
      `;

      section.innerHTML = tableHTML;
      productList.appendChild(section);

    }

  }

  categorySelect?.addEventListener("change", renderProducts);
  searchInput?.addEventListener("input", renderProducts);

  initCategories();
  renderProducts();

});


// ===============================
// PDF MODAL
// ===============================

function openPDFModal(pdfUrl) {

  const modal = document.getElementById("pdfModal");
  const frame = document.getElementById("pdfFrame");

  if (!modal || !frame) return;

  frame.src = pdfUrl;
  modal.style.display = "flex";

}

function closePDFModal() {

  const modal = document.getElementById("pdfModal");
  const frame = document.getElementById("pdfFrame");

  if (!modal || !frame) return;

  frame.src = "";
  modal.style.display = "none";

}

window.addEventListener("click", function (e) {

  const modal = document.getElementById("pdfModal");

  if (e.target === modal) {
    closePDFModal();
  }

});


// ===============================
// FAQ PAGE
// ===============================

document.addEventListener("DOMContentLoaded", function () {

  const container = document.getElementById("faqContainer");
  if (!container) return;

  let faqIndex = 0;
  const faqPerPage = 10;

  const loadBtn = document.getElementById("loadMoreFaq");
  const resetBtn = document.getElementById("resetFaq");

  function renderFaqs() {

    const slice = window.faqData.slice(faqIndex, faqIndex + faqPerPage);

    slice.forEach(faq => {

      const item = document.createElement("div");
      item.className = "faq-item";

      item.innerHTML = `
      <button class="faq-question">
        ${faq.question}
        <span class="faq-icon">+</span>
      </button>

      <div class="faq-answer">
        <p>${faq.answer}</p>
      </div>
      `;

      container.appendChild(item);

    });

    faqIndex += faqPerPage;

    if (faqIndex >= window.faqData.length) {
      loadBtn.style.display = "none";
      resetBtn.style.display = "inline-block";
    }

    initFaqAccordion();
  }

  loadBtn?.addEventListener("click", renderFaqs);

  resetBtn?.addEventListener("click", () => {

    container.innerHTML = "";
    faqIndex = 0;

    loadBtn.style.display = "inline-block";
    resetBtn.style.display = "none";

    renderFaqs();

    window.scrollTo({
      top: container.offsetTop - 120,
      behavior: "smooth"
    });

  });

  function initFaqAccordion() {

    const items = document.querySelectorAll(".faq-item");

    items.forEach(item => {

      const q = item.querySelector(".faq-question");

      q.addEventListener("click", () => {

        const active = document.querySelector(".faq-item.active");

        if (active && active !== item) {
          active.classList.remove("active");
        }

        item.classList.toggle("active");

      });

    });

  }

  renderFaqs();

});


document.addEventListener("DOMContentLoaded", () => {
  initHeaderScripts();
});


document.querySelectorAll(".accordion-header").forEach(btn => {

btn.addEventListener("click", () => {

const item = btn.parentElement;

document.querySelectorAll(".accordion-item").forEach(i=>{
if(i !== item) i.classList.remove("active");
});

item.classList.toggle("active");

});

});

const form = document.getElementById("enquiryForm");

if(form){
form.addEventListener("submit", function(e){

e.preventDefault();

const company = form.company.value;
const temp = form.temp.value;
const insulation = form.insulation.value;
const msg = form.msg.value;

const subject = encodeURIComponent("Insulation Accessory Material Enquiry");

const body = encodeURIComponent(
`Company / Project Name: ${company}

Service Temperature Range: ${temp}

Insulation Type: ${insulation}

Project Details:
${msg}

----------------------------------
Please provide quotation and technical recommendation.

Capricorn Coatings & Colours
`
);

window.location.href =
`mailto:capricorn_coatings@yahoo.co.in?subject=${subject}&body=${body}`;

});
}

