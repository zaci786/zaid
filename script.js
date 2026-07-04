const scriptURL = "https://script.google.com/macros/s/AKfycbxCR1iWqCuPelI5vYxFDgL_mrN3pZJ-Df3luhc4JJ9RGg5mLGdwPxZXgcb66dJKXCan/exec";

const form = document.getElementById("studentForm");

const submitBtn = document.getElementById("submitBtn");

form.addEventListener("submit", e => {
e.preventDefault();

submitBtn.classList.add("loading");
submitBtn.innerHTML = "Submitting...";

fetch(scriptURL,{
method:"POST",
body:new FormData(form)
})
.then(()=>{
document.getElementById("msg").innerHTML="✅ Admission Submitted Successfully";
form.reset();

submitBtn.classList.remove("loading");
submitBtn.innerHTML = "Submit";
})
.catch(()=>{
document.getElementById("msg").innerHTML="❌ Error submitting form";

submitBtn.classList.remove("loading");
submitBtn.innerHTML = "Submit";
});
});


/* Loader Remove After Page Load */

window.addEventListener("load",function(){
setTimeout(()=>{
document.getElementById("loader").classList.add("hide");
},1800);
});

/* ===== POPUP CONTROL ===== */

function closePopup(){
document.getElementById("offerPopup").classList.remove("show");
}

window.addEventListener("load",()=>{
setTimeout(()=>{
document.getElementById("offerPopup").classList.add("show");
},2500);
});






////////// RESULT SYSTEM JS CODE ////////////////
const API="https://script.google.com/macros/s/AKfycbxBRA6G6z5UF2KnSAPrr0HOg9BFSDG1K6Qm7Y9qG-0cgZS8w9pSe4F40V1ZxRnytZAHnw/exec";
function loadMonths(){
document.getElementById("monthArea").innerHTML='<div class="loader"></div>';
fetch(API+"?action=months")
.then(r=>r.json())
.then(data=>{
let html=`
<select id="monthSelect"
onchange="loadStudents()">
<option>Select Month</option>
`;
data.forEach(m=>{
html+=`<option>${m}</option>`;
});
html+=`</select>`;
document.getElementById("monthArea")
.innerHTML=html;
});
}
function loadStudents(){
document.getElementById("studentArea").innerHTML='<div class="loader"></div>';
let month =
document.getElementById("monthSelect").value;
fetch(API+
`?action=students&month=${month}`)
.then(r=>r.json())
.then(data=>{
let html=`
<select id="studentSelect">
<option>Select Student</option>
`;
data.forEach(s=>{
html+=`<option>${s}</option>`;
});
html+=`</select>
<div style="position:relative; width:100%;">

<input
type="password"
id="password"
placeholder="Enter Password"
style="padding-right:45px;">

<span
onclick="togglePassword()"
style="
position:absolute;
right:15px;
top:50%;
transform:translateY(-50%);
cursor:pointer;
font-size:18px;">
👁️
</span>

</div>
<button onclick="login()">
Login
</button>
`;
document.getElementById("studentArea")
.innerHTML=html;
});
}
function login(){
let name =
document.getElementById("studentSelect").value;
let password =
document.getElementById("password").value;
// Loading Spinner
document.getElementById("loginArea").innerHTML='<div class="loader"></div>';
fetch(API+
`?action=login&name=${name}&password=${password}`)
.then(r=>r.json())
.then(data=>{
// Spinner hata do
document.getElementById("loginArea").innerHTML="";
if(data.success){
let btn =
document.getElementById("downloadBtn");
btn.href=data.image;
btn.style.display="inline-block";
}
else{
alert("Wrong Password");
}
});
}
function togglePassword(){

let pass = document.getElementById("password");

if(pass.type==="password"){
pass.type="text";
}
else{
pass.type="password";
}

}
