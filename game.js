const C=document.getElementById("world"),ctx=C.getContext("2d");
const state={name:"",klass:"",score:0,lives:5,stage:0,started:false,results:[],x:90,y:520,keys:{},last:0};
const missions=[
["Gerbang Data","Input","Keyboard adalah perangkat…",["Input","Output","Storage","Process"],0,"Input menerima data/perintah dari pengguna."],
["Akademi IPO","IPO","Urutan IPO yang benar…",["Output-Input-Process","Input-Process-Output","Process-Output-Input","Input-Output-Process"],1,"Model IPO: Input → Process → Output."],
["CPU Center","CPU","Komponen untuk operasi aritmetika dan logika…",["Control Unit","ALU","RAM","SSD"],1,"ALU melakukan operasi aritmetika dan logika."],
["Memory City","Memori","Memori sementara saat program berjalan…",["RAM","SSD","Monitor","Printer"],0,"RAM digunakan sebagai memori kerja sementara."],
["Von Neumann","Arsitektur","Data dan instruksi disimpan terutama pada…",["Monitor","Memory","Keyboard","Speaker"],1,"Konsep Von Neumann menggunakan memory untuk data dan instruksi."],
["OS Tech Park","Sistem Operasi","Fungsi utama sistem operasi…",["Mengatur sumber daya komputer","Menghapus semua data","Membuat listrik","Mengganti CPU"],0,"OS mengelola perangkat keras, file, proses, dan layanan sistem."],
["Input Station","Perangkat Input","Pasangan perangkat input…",["Keyboard + Mouse","Monitor + Speaker","Printer + Proyektor","Speaker + Monitor"],0,"Keyboard dan mouse menerima masukan."],
["Output Studio","Perangkat Output","Untuk menampilkan presentasi ke layar besar…",["Microphone","Scanner","Proyektor","Keyboard"],2,"Proyektor menghasilkan keluaran visual."],
["Final Mission","Integrasi","Keyboard → CPU → Monitor menunjukkan konsep…",["IPO","Hanya storage","Hanya output","Hanya input"],0,"Keyboard = Input, CPU = Process, Monitor = Output."]
];
const buildings=[
{x:90,y:430,w:150,h:75,id:0,label:"🚪 GERBANG DATA"},
{x:270,y:100,w:150,h:75,id:1,label:"🏫 AKADEMI IPO"},
{x:530,y:90,w:150,h:75,id:2,label:"💻 CPU CENTER"},
{x:760,y:210,w:150,h:75,id:3,label:"💾 MEMORY CITY"},
{x:560,y:380,w:155,h:75,id:4,label:"🏛️ VON NEUMANN"},
{x:300,y:455,w:155,h:75,id:5,label:"⚙️ OS TECH PARK"},
{x:720,y:480,w:145,h:70,id:6,label:"⌨️ INPUT"},
{x:800,y:90,w:145,h:70,id:7,label:"📺 OUTPUT"},
{x:440,y:245,w:165,h:75,id:8,label:"⭐ FINAL MISSION"}
];
const obstacles=[
{x:0,y:0,w:1000,h:35},{x:0,y:585,w:1000,h:35},{x:0,y:0,w:35,h:620},{x:965,y:0,w:35,h:620},
{x:175,y:215,w:130,h:35},{x:445,y:145,w:35,h:150},{x:685,y:320,w:125,h:35},{x:165,y:545,w:90,h:25},
{x:720,y:350,w:30,h:100},{x:420,y:400,w:85,h:30}
];
const checkpoints=[
{x:215,y:430},{x:330,y:185},{x:500,y:120},{x:730,y:250},{x:640,y:350},{x:400,y:485},{x:690,y:500},{x:850,y:160},{x:520,y:300}
];
function $(s){return document.querySelector(s)}
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
function rectHit(x,y,r){return obstacles.some(o=>x+12>o.x&&x-12<o.x+o.w&&y+12>o.y&&y-12<o.y+o.h)}
function dist(a,b){return Math.hypot(a.x-b.x,a.y-b.y)}
function unlocked(i){return i===0||state.results[i-1]?.correct}
function renderMissionPanel(){let e=$("#missionPanel");e.innerHTML=missions.map((m,i)=>`<div class="mission ${i===state.stage?"current ":""}${state.results[i]?"done":""}${!unlocked(i)?" locked":""}">${state.results[i]?"✅":(!unlocked(i)?"🔒":"🟨")} ${i+1}. ${m[0]}</div>`).join("")}
function draw(){
 ctx.clearRect(0,0,C.width,C.height);
 ctx.fillStyle="#1b4a3d";ctx.fillRect(0,0,C.width,C.height);
 // grass patches
 for(let y=35;y<585;y+=48)for(let x=35;x<965;x+=48){ctx.fillStyle=(x+y)%96?"#1d4e40":"#205442";ctx.fillRect(x,y,46,46)}
 // roads
 ctx.fillStyle="#59646d";ctx.fillRect(35,350,930,62);ctx.fillRect(455,35,65,550);ctx.fillRect(130,170,740,35);
 ctx.strokeStyle="#c4b87b";ctx.setLineDash([18,15]);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(35,381);ctx.lineTo(965,381);ctx.moveTo(487,35);ctx.lineTo(487,585);ctx.stroke();ctx.setLineDash([]);
 // route guide
 for(let i=0;i<checkpoints.length-1;i++){let a=checkpoints[i],b=checkpoints[i+1];ctx.strokeStyle=i<state.stage?"#45e0bb":"#ffffff18";ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}
 // obstacles
 obstacles.forEach(o=>{ctx.fillStyle="#6e3434";ctx.fillRect(o.x,o.y,o.w,o.h);ctx.fillStyle="#b14b4b";for(let x=o.x+8;x<o.x+o.w;x+=22)ctx.fillRect(x,o.y+6,10,7)});
 // buildings
 buildings.forEach((b,i)=>{let ok=unlocked(i);ctx.fillStyle=ok?"#214f70":"#263442";ctx.strokeStyle=i===state.stage?"#f3c34e":"#47718e";ctx.lineWidth=3;ctx.fillRect(b.x,b.y,b.w,b.h);ctx.strokeRect(b.x,b.y,b.w,b.h);ctx.fillStyle="#fff";ctx.font="bold 15px system-ui";ctx.textAlign="center";ctx.fillText(b.label,b.x+b.w/2,b.y+b.h/2+5);if(!ok){ctx.font="20px system-ui";ctx.fillText("🔒",b.x+b.w-18,b.y+20)}});
 // checkpoints
 checkpoints.forEach((p,i)=>{ctx.fillStyle=i<=state.stage?"#36d49f":"#9b792d";ctx.beginPath();ctx.arc(p.x,p.y,10,0,Math.PI*2);ctx.fill();ctx.fillStyle="#fff";ctx.font="11px system-ui";ctx.textAlign="center";ctx.fillText(i+1,p.x,p.y-16)});
 // player
 ctx.save();ctx.translate(state.x,state.y);ctx.beginPath();ctx.arc(0,0,17,0,Math.PI*2);ctx.fillStyle="#2dd4bf";ctx.fill();ctx.font="26px sans-serif";ctx.textAlign="center";ctx.fillText("🧑‍💻",0,9);ctx.restore();
}
function move(dt){
 let dx=0,dy=0;if(state.keys.up)dy-=1;if(state.keys.down)dy+=1;if(state.keys.left)dx-=1;if(state.keys.right)dx+=1;
 if(dx||dy){let l=Math.hypot(dx,dy);dx/=l;dy/=l;let sp=190*dt,nx=state.x+dx*sp,ny=state.y+dy*sp;if(!rectHit(nx,state.y))state.x=nx;if(!rectHit(state.x,ny))state.y=ny}
}
function nearest(){let b=buildings[state.stage];return Math.hypot(state.x-(b.x+b.w/2),state.y-(b.y+b.h/2))<90}
function action(){if(nearest())openMission(state.stage);else if(state.stage<9)toast("🧭 Ikuti jalan bercahaya dan dekati lokasi misi berikutnya.");}
function toast(t){let old=$("#toast");if(!old){old=document.createElement("div");old.id="toast";old.style.cssText="position:fixed;left:50%;top:80px;transform:translateX(-50%);z-index:100;background:#091722ee;border:1px solid #46708c;border-radius:10px;padding:10px 14px";document.body.appendChild(old)}old.textContent=t;clearTimeout(old.t);old.t=setTimeout(()=>old.remove(),1800)}
function openMission(i){
 if(!unlocked(i)){toast("🔒 Rute ini masih terkunci.");return}
 let m=missions[i];$("#modalBody").innerHTML=`<h2>🎯 Misi ${i+1}: ${m[0]}</h2><p><b>Materi:</b> ${m[1]}</p><p>${m[2]}</p><div id="opts">${m[3].map((o,j)=>`<button class="option" data-j="${j}">${String.fromCharCode(65+j)}. ${o}</button>`).join("")}</div><div id="feedback"></div>`;
 $("#modal").classList.remove("hidden");document.querySelectorAll(".option").forEach(b=>b.onclick=()=>answer(i,+b.dataset.j));
}
function answer(i,j){
 let m=missions[i],ok=j===m[4],fb=$("#feedback");if(state.results[i])return;
 if(ok){let pts=100+Math.max(0,5-state.lives)*5;state.score+=pts;state.results[i]={correct:true,points:pts};state.stage=Math.min(8,i+1);fb.innerHTML=`<div class="feedback">🎉 <b>Benar! +${pts} poin</b><br>${m[5]}<br>🔓 Rute berikutnya terbuka.</div><button class="option" id="continue">➡️ Lanjut menjelajah</button>`;$("#continue").onclick=()=>{$("#modal").classList.add("hidden");if(i===8)finish();renderMissionPanel();draw();save()};}else{state.lives--;state.results[i]={correct:false,points:0};fb.innerHTML=`<div class="feedback">❌ Belum tepat.<br>${m[5]}<br>${state.lives>0?"Kamu kehilangan 1 nyawa. Coba lanjutkan perjalanan.":"Nyawa habis untuk misi ini."}</div><button class="option" id="continue">Kembali ke kota</button>`;$("#continue").onclick=()=>{$("#modal").classList.add("hidden");renderMissionPanel();draw();save()};}
}
function finish(){state.stage=9;save();setTimeout(showReport,200)}
function showReport(){$("#game").classList.add("hidden");$("#report").classList.remove("hidden");let correct=state.results.filter(x=>x?.correct).length;let grade=Math.round(state.score/((100+5*5)*9)*100);grade=clamp(grade,0,100);$("#rScore").textContent=state.score;$("#rGrade").textContent=grade;$("#rDone").textContent=correct+"/9";$("#rLife").textContent=state.lives;$("#reportIntro").textContent=`${state.name} (${state.klass}) telah menyelesaikan perjalanan Kota Komputasional.`;let ev=missions.map((m,i)=>{let r=state.results[i];return `<div><b>${i+1}. ${m[0]}</b> — ${r?.correct?"<span class='good'>Tuntas</span>":"<span class='warn'>Perlu penguatan</span>"}</div>`}).join("");$("#evaluation").innerHTML=`<b>Evaluasi:</b><br>${ev}<hr><b>Rekomendasi:</b> ${grade>=80?"Penguasaan materi sudah baik. Pertahankan dengan latihan kasus dan simulasi.":grade>=60?"Beberapa konsep sudah dikuasai. Ulangi misi yang belum tuntas dan latihan IPO/komponen komputer.":"Perlu penguatan konsep dasar. Pelajari kembali materi dan ulangi perjalanan secara bertahap."}`;drawChart()}
function drawChart(){let c=$("#chart"),x=c.getContext("2d"),w=c.width,h=c.height;x.clearRect(0,0,w,h);x.fillStyle="#091522";x.fillRect(0,0,w,h);let vals=missions.map((_,i)=>state.results[i]?.correct?100:0),bw=60,gap=20; x.font="11px system-ui";x.textAlign="center";vals.forEach((v,i)=>{let xx=25+i*(bw+gap),bh=v*2.2;x.fillStyle=v?"#2dd4bf":"#344b5c";x.fillRect(xx,h-45-bh,bw,bh);x.fillStyle="#fff";x.fillText(`${i+1}`,xx+bw/2,h-25);x.fillText(`${v}%`,xx+bw/2,h-52-bh)});x.textAlign="left";x.fillStyle="#9ab0c2";x.fillText("Penguasaan per misi",20,20)}
function save(){try{localStorage.setItem("kkv2",JSON.stringify(state))}catch(e){}}
function reset(){localStorage.removeItem("kkv2");location.reload()}
function start(){state.started=true;$("#login").classList.add("hidden");$("#game").classList.remove("hidden");renderMissionPanel();requestAnimationFrame(loop)}
function loop(t){let dt=Math.min(.035,(t-state.last)/1000||0);state.last=t;move(dt);draw();requestAnimationFrame(loop)}
$("#loginForm").onsubmit=e=>{e.preventDefault();state.name=$("#name").value.trim();state.klass=$("#klass").value.trim();save();start()};
$("#x").onclick=()=>$("#modal").classList.add("hidden");$("#modal").onclick=e=>{if(e.target.id==="modal")$("#modal").classList.add("hidden")};
$("#actionBtn").onclick=action;$("#restart").onclick=reset;$("#again").onclick=reset;$("#print").onclick=()=>window.print();
const keymap={ArrowUp:"up",ArrowDown:"down",ArrowLeft:"left",ArrowRight:"right",w:"up",s:"down",a:"left",d:"right"};
document.addEventListener("keydown",e=>{let k=keymap[e.key];if(k){state.keys[k]=true;e.preventDefault()}if(e.key==="Enter")action()});
document.addEventListener("keyup",e=>{let k=keymap[e.key];if(k)state.keys[k]=false});
document.querySelectorAll("[data-k]").forEach(b=>{let k=b.dataset.k;b.addEventListener("pointerdown",e=>{e.preventDefault();state.keys[k]=true});["pointerup","pointercancel","pointerleave"].forEach(ev=>b.addEventListener(ev,e=>{state.keys[k]=false}))});
try{let old=JSON.parse(localStorage.getItem("kkv2"));if(old&&old.started){Object.assign(state,old);start()}}catch(e){}
draw();
