
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
  document.getElementById("downloadBtn").style.display = "none";

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
  document.getElementById("downloadBtn").style.display = "none";

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
  let name = document.getElementById("studentSelect").value;
  let password = document.getElementById("password").value;

  document.getElementById("loginArea").innerHTML = '<div class="loader"></div>';

  fetch(RESULT_API + `?action=login&name=${encodeURIComponent(name)}&password=${encodeURIComponent(password)}`)
    .then(r => r.json())
    .then(data => {
      document.getElementById("loginArea").innerHTML = "";

      if (data.success){
        let btn = document.getElementById("downloadBtn");
        btn.href = data.image;
        btn.style.display = "inline-block";
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
