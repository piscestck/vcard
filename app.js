document.documentElement.style.setProperty("--accent", CARD.accent || "#0b6477");
document.documentElement.style.setProperty("--accent2", CARD.accent2 || "#083d4a");

const $ = id => document.getElementById(id);
$("name").textContent = CARD.name;
$("jobTitle").textContent = CARD.jobTitle;
$("company").textContent = CARD.company;
$("bio").textContent = CARD.bio;
$("photo").src = CARD.photo;
$("logo").src = CARD.logo;
$("address").textContent = CARD.address;
$("websiteText").textContent = CARD.websiteLabel;

$("callBtn").href = `tel:${CARD.phone.replace(/\s+/g,"")}`;
$("emailBtn").href = `mailto:${CARD.email}`;
$("whatsappBtn").href = `https://wa.me/${CARD.whatsapp}`;

const links = $("links");
if (CARD.website) addLink("🌐 Website", CARD.website);
if (CARD.linkedin) addLink("in LinkedIn", CARD.linkedin);
if (CARD.instagram) addLink("◎ Instagram", CARD.instagram);

function addLink(label, href){
  const a=document.createElement("a");
  a.className="link"; a.href=href; a.target="_blank"; a.rel="noopener";
  a.textContent=label; links.appendChild(a);
}

$("saveBtn").addEventListener("click", ()=>{
  const vcard = [
    "BEGIN:VCARD","VERSION:3.0",
    `FN:${escapeV(CARD.name)}`,
    `ORG:${escapeV(CARD.company)}`,
    `TITLE:${escapeV(CARD.jobTitle)}`,
    `TEL;TYPE=CELL:${CARD.phone}`,
    `EMAIL;TYPE=INTERNET:${CARD.email}`,
    `URL:${CARD.website}`,
    `ADR;TYPE=WORK:;;${escapeV(CARD.address)};;;;`,
    "END:VCARD"
  ].join("\r\n");
  const blob = new Blob([vcard], {type:"text/vcard;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const a=document.createElement("a"); a.href=url; a.download=`${slug(CARD.name)}.vcf`; a.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
  toast("Contact file created");
});

$("shareBtn").addEventListener("click", async ()=>{
  const data={title:CARD.name,text:`${CARD.name} – ${CARD.jobTitle}`,url:location.href};
  if(navigator.share){try{await navigator.share(data)}catch(e){}}
  else {await navigator.clipboard.writeText(location.href);toast("Card link copied");}
});

$("qrBtn").addEventListener("click", ()=>{
  $("qrcode").innerHTML="";
  new QRCode($("qrcode"), {text:location.href,width:220,height:220});
  $("qrUrl").textContent=location.href;
  $("qrDialog").showModal();
});
$("closeQr").onclick=()=>$("qrDialog").close();

function escapeV(s){return String(s||"").replace(/\\/g,"\\\\").replace(/;/g,"\\;").replace(/\n/g,"\\n").replace(/,/g,"\\,")}
function slug(s){return String(s).toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")||"contact"}
function toast(msg){$("toast").textContent=msg;$("toast").classList.add("show");setTimeout(()=>$("toast").classList.remove("show"),2200)}
