
const API="https://script.google.com/macros/s/AKfycbxBRA6G6z5UF2KnSAPrr0HOg9BFSDG1K6Qm7Y9qG-0cgZS8w9pSe4F40V1ZxRnytZAHnw/exec";

function loadMonths(){

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

<input type="password"
id="password"
placeholder="Enter Password">

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

fetch(API+
`?action=login&name=${name}&password=${password}`)
.then(r=>r.json())
.then(data=>{

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
