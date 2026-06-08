let companies = JSON.parse(localStorage.getItem('chf_companies')||'[]');
let products  = JSON.parse(localStorage.getItem('chf_products')||'{}');

let currentOrigin='all';
let currentStype='name';
let lastResults=[];

function toast(msg){
const t=document.getElementById('toast');
t.textContent=msg;
t.classList.add('show');
setTimeout(()=>t.classList.remove('show'),2000);
}

function switchPage(p){
document.querySelectorAll('.page').forEach(x=>x.classList.remove('on'));
document.getElementById('page-'+p).classList.add('on');
}

function addCompany(){
const name=document.getElementById('coName').value;
const origin=document.getElementById('coOrigin').value;

companies.push({
id:Date.now(),
name,origin,
affBase:''
});

save();
renderCompanies();
}

function save(){
localStorage.setItem('chf_companies',JSON.stringify(companies));
localStorage.setItem('chf_products',JSON.stringify(products));
}

function renderCompanies(){
const el=document.getElementById('adminCompanyList');
el.innerHTML=companies.map(c=>
`<div>${c.name}</div>`
).join('');
}

function selectStype(el){
currentStype=el.dataset.stype;
}

function doSearch(){
let q=document.getElementById('mainSearch').value.toLowerCase();

let pool=[];

companies.forEach(c=>{
(products[c.id]||[]).forEach(p=>{
pool.push(p);
});
});

let res=pool.filter(p=>
(p.name||'').toLowerCase().includes(q)
);

lastResults=res;
renderResults(res);
}

function renderResults(res){
const wrap=document.getElementById('resultsWrap');
const list=document.getElementById('resultsList');

wrap.style.display='block';

list.innerHTML=res.map(r=>
`<div>${r.name}</div>`
).join('');
}

function handleFileUpload(input){
const file=input.files[0];
const reader=new FileReader();

reader.onload=e=>{
const wb=XLSX.read(e.target.result,{type:'array'});
const ws=wb.Sheets[wb.SheetNames[0]];
const data=XLSX.utils.sheet_to_json(ws);

products[companies.at(-1).id]=data;
save();
toast("تم رفع المنتجات");
};

reader.readAsArrayBuffer(file);
}

renderCompanies();