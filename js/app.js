const PAGES=[["index.html","Início"],["contatos.html","Contatos"],["suporte.html","Suporte"]];
const get=k=>{try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}};
const set=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const here=location.pathname.split("/").pop()||"index.html";
const user=get("ecoair_session");
let links=PAGES.map(p=>`<a href="${p[0]}" class="${here==p[0]?"on":""}">${p[1]}</a>`).join("");
links+=user?`<a href="dashboard.html" class="${here=="dashboard.html"?"on":""}">Dashboard</a><a href="#" id="sair">Sair</a>`:`<a href="login.html" class="${here=="login.html"?"on":""}">Login</a><a href="cadastro.html" class="${here=="cadastro.html"?"on":""}">Cadastro</a>`;
document.getElementById("topo").innerHTML=`<div class="bar"><a class="logo" href="index.html">Eco<b>Air</b></a><nav aria-label="Principal">${links}</nav></div>`;
document.getElementById("rodape").innerHTML="© 2026 EcoAir. Monitoramento da qualidade do ar.";
const s=document.getElementById("sair");
if(s)s.onclick=e=>{e.preventDefault();localStorage.removeItem("ecoair_session");location.href="index.html"};
function show(el,t,ok){el.textContent=t;el.className="msg "+(ok?"ok":"err")}
const cad=document.getElementById("form-cadastro");
if(cad)cad.onsubmit=e=>{e.preventDefault();const f=new FormData(cad),m=document.getElementById("msg"),email=f.get("email").trim().toLowerCase();
 if(f.get("senha").length<6)return show(m,"A senha precisa ter pelo menos 6 caracteres.");
 if(f.get("senha")!==f.get("senha2"))return show(m,"As senhas não são iguais.");
 const us=get("ecoair_users")||{};if(us[email])return show(m,"Este e-mail já tem cadastro. Faça login.");
 us[email]={nome:f.get("nome"),senha:f.get("senha")};set("ecoair_users",us);set("ecoair_session",{email,nome:f.get("nome")});location.href="dashboard.html"};
const log=document.getElementById("form-login");
if(log)log.onsubmit=e=>{e.preventDefault();const f=new FormData(log),m=document.getElementById("msg"),email=f.get("email").trim().toLowerCase();
 const u=(get("ecoair_users")||{})[email];if(!u||u.senha!==f.get("senha"))return show(m,"E-mail ou senha incorretos.");
 set("ecoair_session",{email,nome:u.nome});location.href="dashboard.html"};
const sup=document.getElementById("form-contato");
if(sup)sup.onsubmit=e=>{e.preventDefault();show(document.getElementById("msg"),"Mensagem enviada. Responderemos em até 2 dias úteis.",true);sup.reset()};
if(document.getElementById("dash")){
 if(!user){location.href="login.html"}else{
 document.getElementById("ola").textContent="Olá, "+user.nome.split(" ")[0];
 const loc=document.getElementById("local"),sv=get("ecoair_local");if(sv)loc.value=sv;loc.onchange=()=>set("ecoair_local",loc.value);
 const M=[["pm25","PM2.5","µg/m³",35,12],["pm10","PM10","µg/m³",50,25],["no2","NO₂","µg/m³",100,30],["co","CO","ppm",9,1.5]];
 const box=document.getElementById("medidas");
 box.innerHTML=M.map(m=>`<div class="m"><div class="t"><span>${m[1]}</span><b id="v-${m[0]}">-</b></div><div class="track"><div class="fill" id="b-${m[0]}"></div></div></div>`).join("");
 const hist=[];
 function tick(){const r={h:new Date().toLocaleTimeString("pt-BR")};let worst=0;
  M.forEach(m=>{const v=Math.max(0,m[4]+(Math.random()-.3)*m[3]*.7);r[m[0]]=v;const p=v/m[3];worst=Math.max(worst,p);
   document.getElementById("v-"+m[0]).textContent=v.toFixed(1)+" "+m[2];
   const b=document.getElementById("b-"+m[0]);b.style.width=Math.min(100,p*100)+"%";b.style.background=p<.5?"#4F8A5B":p<1?"#E9A23B":"#C2493D"});
  const st=document.getElementById("status");
  st.textContent=worst<.5?"Ar bom":worst<1?"Atenção":"Ar ruim";st.style.background=worst<.5?"#4F8A5B":worst<1?"#B97A12":"#C2493D";
  hist.unshift(r);if(hist.length>8)hist.pop();
  document.getElementById("hist").innerHTML=hist.map(x=>`<tr><td>${x.h}</td><td>${x.pm25.toFixed(1)}</td><td>${x.pm10.toFixed(1)}</td><td>${x.no2.toFixed(1)}</td><td>${x.co.toFixed(1)}</td></tr>`).join("")}
 tick();setInterval(tick,4000)}}
const ac=document.getElementById("acoes");if(ac&&user)ac.remove();
