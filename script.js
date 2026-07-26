
  /* ============================================
   ZACI — Zero To Advance Computer Institute
   ============================================ */

/* ============================================
   Result Portal — connects to ZACI's result API
   Functions are global because the buttons in
   index.html call them via inline onclick="".
   ============================================ */
const RESULT_API = "https://script.google.com/macros/s/AKfycbxBRA6G6z5UF2KnSAPrr0HOg9BFSDG1K6Qm7Y9qG-0cgZS8w9pSe4F40V1ZxRnytZAHnw/exec";

function loadMonths(){
  document.getElementById("monthArea").innerHTML = '<div class="loader"></div>';
  document.getElementById("studentArea").innerHTML = "";
  document.getElementById("loginArea").innerHTML = "";
  document.getElementById("downloadOptions").classList.add("hidden");

  fetch(RESULT_API + "?action=months")
    .then(r => r.json())
    .then(data => {
      let html = `<select id="monthSelect" onchange="loadStudents()"><option>Select Month</option>`;
      data.forEach(m => { html += `<option>${m}</option>`; });
      html += `</select>`;
      document.getElementById("monthArea").innerHTML = html;
    })
    .catch(() => {
      document.getElementById("monthArea").innerHTML =
        '<p style="color:var(--muted);font-size:0.85rem;">Result service abhi available nahi hai. Baad mein try karein.</p>';
    });
}

function loadStudents(){
  document.getElementById("studentArea").innerHTML = '<div class="loader"></div>';
  document.getElementById("loginArea").innerHTML = "";
  document.getElementById("downloadOptions").classList.add("hidden");

  let month = document.getElementById("monthSelect").value;

  fetch(RESULT_API + `?action=students&month=${encodeURIComponent(month)}`)
    .then(r => r.json())
    .then(data => {
      let html = `<select id="studentSelect"><option>Select Student</option>`;
      data.forEach(s => { html += `<option>${s}</option>`; });
      html += `</select>
        <input type="password" id="password" placeholder="Enter Password">
        <button class="btn btn-primary btn-full" type="button" onclick="login()">Login</button>`;
      document.getElementById("studentArea").innerHTML = html;
    })
    .catch(() => {
      document.getElementById("studentArea").innerHTML =
        '<p style="color:var(--muted);font-size:0.85rem;">Students list load nahi ho paayi. Baad mein try karein.</p>';
    });
}

function login(){
  let month = document.getElementById("monthSelect").value;
  let name = document.getElementById("studentSelect").value;
  let password = document.getElementById("password").value;

  document.getElementById("loginArea").innerHTML = '<div class="loader"></div>';

  fetch(RESULT_API + `?action=login&month=${encodeURIComponent(month)}&name=${encodeURIComponent(name)}&password=${encodeURIComponent(password)}`)
    .then(r => r.json())
    .then(data => {
      document.getElementById("loginArea").innerHTML = "";

      if (data.success){
        document.getElementById("downloadDiploma").href = data.diploma;
        document.getElementById("downloadMarksheet").href = data.marksheet;
        document.getElementById("downloadOptions").classList.remove("hidden");
      } else {
        alert("Wrong Password");
      }
    })
    .catch(() => {
      document.getElementById("loginArea").innerHTML =
        '<p style="color:var(--muted);font-size:0.85rem;">Login abhi possible nahi hai. Baad mein try karein.</p>';
    });
}

/* ============================================
   Admission Form — submits to ZACI's Google
   Apps Script backend (Google Sheet).
   ============================================ */
const admissionScriptURL = "https://script.google.com/macros/s/AKfycbxCR1iWqCuPelI5vYxFDgL_mrN3pZJ-Df3luhc4JJ9RGg5mLGdwPxZXgcb66dJKXCan/exec";

const studentForm = document.getElementById("studentForm");
const submitBtn = document.getElementById("submitBtn");

if (studentForm && submitBtn){
  studentForm.addEventListener("submit", e => {
    e.preventDefault();

    submitBtn.classList.add("loading");
    submitBtn.innerHTML = "Submitting...";

    fetch(admissionScriptURL, {
      method: "POST",
      body: new FormData(studentForm)
    })
      .then(() => {
        document.getElementById("msg").innerHTML = "✅ Admission Submitted Successfully";
        studentForm.reset();

        submitBtn.classList.remove("loading");
        submitBtn.innerHTML = "Submit";
      })
      .catch(() => {
        document.getElementById("msg").innerHTML = "❌ Error submitting form";

        submitBtn.classList.remove("loading");
        submitBtn.innerHTML = "Submit";
      });
  });
}

/* ============================================
   Certificate Verification — checks a Certificate
   ID against your Google Sheet via Apps Script.
   Replace CERT_API below with your deployed
   Apps Script Web App URL (see setup instructions).
   ============================================ */
const CERT_API = "https://script.google.com/macros/s/AKfycbz6HMWZWj52Pa_SJqwGarOws712wKNdTSty67HPWmIpluy4eSzcto0VODoYczNUGMeT/exec";

function verifyCertificate(){
  const certId = document.getElementById("certId").value.trim();
  const resultArea = document.getElementById("certResult");

  if (!certId){
    resultArea.innerHTML = '<p style="color:var(--muted);font-size:0.85rem;">Please enter a Certificate ID.</p>';
    return;
  }

  resultArea.innerHTML = '<div class="loader"></div>';

  fetch(CERT_API + `?certId=${encodeURIComponent(certId)}`)
    .then(r => r.json())
    .then(data => {
      if (data.found){
        resultArea.innerHTML = `
          <div class="cert-result valid">
            <p class="cert-status">✅ Valid Certificate</p>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Course:</strong> ${data.course}</p>
            <p><strong>Issue Date:</strong> ${data.issueDate}</p>
            <p><strong>Status:</strong> ${data.status}</p>
          </div>`;
      } else {
        resultArea.innerHTML = `
          <div class="cert-result invalid">
            <p class="cert-status">❌ Certificate Not Found</p>
            <p>Please check the Certificate ID and try again.</p>
          </div>`;
      }
    })
    .catch(() => {
      resultArea.innerHTML =
        '<p style="color:var(--muted);font-size:0.85rem;">Verification service is not available right now. Please try again later.</p>';
    });
}

/* ============================================
   Student Status — login checks username/password
   against your "Status" Google Sheet via Apps Script,
   then displays enrollment + fee details.
   Replace STATUS_API below with your deployed
   Apps Script Web App URL (see setup instructions).
   ============================================ */
const STATUS_API = "https://script.google.com/macros/s/AKfycbzZO771l-U_LyvrHtyXRbgKXgZl1FR54pOsZe2fZq4uDnjI1z0m3xsJfak5j6iuxLpWRA/exec";

function maskAadhar(aadhar){
  const digits = String(aadhar || "").replace(/\D/g, "");
  if (digits.length < 4) return "XXXX-XXXX-XXXX";
  const last4 = digits.slice(-4);
  return `XXXX-XXXX-${last4}`;
}

function studentLogin(){
  const username = document.getElementById("statusUsername").value.trim();
  const password = document.getElementById("statusPassword").value.trim();
  const statusMsg = document.getElementById("statusMsg");

  if (!username || !password){
    statusMsg.textContent = "Please enter both username and password.";
    return;
  }

  statusMsg.innerHTML = '<span class="loader" style="margin:0.5rem auto;"></span>';

  fetch(STATUS_API + `?action=login&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`)
    .then(r => r.json())
    .then(data => {
      statusMsg.textContent = "";

      if (data.success){
        document.getElementById("stName").textContent = data.name || "—";
        document.getElementById("stFatherName").textContent = data.fatherName || "—";
        document.getElementById("stMobile").textContent = data.mobile || "—";
        document.getElementById("stAadhar").textContent = maskAadhar(data.aadhar);
        document.getElementById("stCourse").textContent = data.course || "—";
        document.getElementById("stEnrollment").textContent = data.enrollmentNo || "—";
        document.getElementById("stCourseFees").textContent = data.courseFees || "0";
        document.getElementById("stSubmittedFees").textContent = data.submittedFees || "0";
        document.getElementById("stDueFees").textContent = data.dueFees || "0";

        const photoEl = document.getElementById("stPhoto");
        if (data.photo){
          photoEl.src = data.photo;
          photoEl.style.display = "block";
        } else {
          photoEl.style.display = "none";
        }

        document.getElementById("statusLogin").classList.add("hidden");
        document.getElementById("statusDisplay").classList.remove("hidden");
      } else {
        statusMsg.textContent = "❌ Invalid username or password.";
      }
    })
    .catch(() => {
      statusMsg.textContent = "Status service is not available right now. Please try again later.";
    });
}

function statusLogout(){
  document.getElementById("statusDisplay").classList.add("hidden");
  document.getElementById("statusLogin").classList.remove("hidden");
  document.getElementById("statusUsername").value = "";
  document.getElementById("statusPassword").value = "";
  document.getElementById("statusMsg").textContent = "";
}

function printStatus(){
  window.print();
}

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Boot overlay ---------- */
  const bootOverlay = document.getElementById('boot-overlay');
  const bootText = document.getElementById('boot-text');
  const bootMessage = 'ZACI_SYSTEM_BOOT :: initializing student journey...';
  let i = 0;

  function typeBoot(){
    if (i <= bootMessage.length){
      bootText.textContent = bootMessage.slice(0, i);
      i++;
      setTimeout(typeBoot, 22);
    } else {
      setTimeout(() => bootOverlay.classList.add('hide'), 350);
    }
  }
  if (bootOverlay && bootText){
    typeBoot();
    // Safety: never block the page for more than ~2.5s
    setTimeout(() => bootOverlay.classList.add('hide'), 2500);
  }

  /* ---------- Student Site dropdown (nav) ---------- */
  const navDropdown = document.querySelector('.nav-dropdown');
  const dropdownToggle = document.querySelector('.dropdown-toggle');
  if (navDropdown && dropdownToggle){
    dropdownToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navDropdown.classList.toggle('open');
      dropdownToggle.setAttribute('aria-expanded', isOpen);
    });
    document.addEventListener('click', (e) => {
      if (!navDropdown.contains(e.target)){
        navDropdown.classList.remove('open');
        dropdownToggle.setAttribute('aria-expanded', 'false');
      }
    });
    navDropdown.querySelectorAll('.dropdown-menu a').forEach(link => {
      link.addEventListener('click', () => {
        navDropdown.classList.remove('open');
        dropdownToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  if (navToggle && mainNav){
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Animated stat counters ---------- */
  const stats = document.querySelectorAll('.stat');
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        const numEl = el.querySelector('.stat-num');
        let current = 0;
        const duration = 1400;
        const stepTime = 16;
        const steps = duration / stepTime;
        const increment = target / steps;

        const counter = setInterval(() => {
          current += increment;
          if (current >= target){
            current = target;
            clearInterval(counter);
          }
          numEl.textContent = Math.floor(current);
        }, stepTime);

        statObserver.unobserve(el);
      }
    });
  }, { threshold: 0.4 });
  stats.forEach(stat => statObserver.observe(stat));
  /* ---------- Course level filter ---------- */
  const levelTabs = document.querySelectorAll('.level-tab');
  const courseCards = document.querySelectorAll('.course-card');
  levelTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      levelTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const level = tab.getAttribute('data-level');
      courseCards.forEach(card => {
        if (level === 'all' || card.getAttribute('data-level') === level){
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* ---------- Testimonial slider ---------- */
  const testiCards = document.querySelectorAll('.testi-card');
  const testiDotsWrap = document.getElementById('testiDots');
  let testiIndex = 0;

  if (testiCards.length && testiDotsWrap){
    testiCards.forEach((_, idx) => {
      const dot = document.createElement('button');
      if (idx === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', `Testimonial ${idx + 1}`);
      dot.addEventListener('click', () => showTesti(idx));
      testiDotsWrap.appendChild(dot);
    });

    function showTesti(idx){
      testiCards.forEach(c => c.classList.remove('active'));
      testiDotsWrap.querySelectorAll('button').forEach(d => d.classList.remove('active'));
      testiCards[idx].classList.add('active');
      testiDotsWrap.children[idx].classList.add('active');
      testiIndex = idx;
    }

    setInterval(() => {
      const next = (testiIndex + 1) % testiCards.length;
      showTesti(next);
    }, 5000);
  }

  /* ---------- Back to top button ---------- */
  const backToTop = document.getElementById('backToTop');
  if (backToTop){
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500){
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
