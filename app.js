// Tabs
document.querySelectorAll('.tab').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.tab').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.tabpanel').forEach(p=>p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

document.getElementById('year').textContent = new Date().getFullYear();

// Unique numbering (localStorage)
function nextReceiptNumber(prefix){
  const key = 'samassa_receipt_counter_' + prefix;
  const current = parseInt(localStorage.getItem(key) || '0', 10) + 1;
  localStorage.setItem(key, String(current));
  // Format: PREFIX-YYYYMMDD-HHMMSS-####
  const d = new Date();
  const pad = (n)=> String(n).padStart(2,'0');
  const stamp = d.getFullYear().toString()+pad(d.getMonth()+1)+pad(d.getDate())+'-'+pad(d.getHours())+pad(d.getMinutes())+pad(d.getSeconds());
  return `${prefix}-${stamp}-${String(current).padStart(4,'0')}`;
}

function getFormData(scope){
  const form = document.getElementById(`form-${scope}`);
  const data = Object.fromEntries(new FormData(form).entries());
  // totals
  const montant = parseInt(data.montant || 0,10);
  const frais = parseInt(data.frais || 0,10);
  const total = montant; // EDM model: frais à part
  const montantPaye = montant + frais;
  return {...data, montant, frais, total, montantPaye};
}

function buildReceipt(scope){
  const d = getFormData(scope);
  const isEDM = scope === 'edm';
  // Configuration des informations par société
  let receiptNo, company, headerRightTop, address, title, logoSrc;
  receiptNo = nextReceiptNumber(isEDM ? 'EDM' : (scope === 'isago' ? 'ISAGO' : 'SOM'));
  
  if(isEDM){
    company = 'ENERGIE DU MALI - SA';
    headerRightTop = 'DIRECTION COMMERCIALE\nAGENCE VIRTUELLE';
    address = 'SQUARE PATRICE LUMUMBA, B.P.69, BAMAKO, MALI';
    logoSrc = 'assets/logo_edm.png';
  } else if(scope === 'isago'){
    company = 'ISAGO';
    headerRightTop = 'DIRECTION COMMERCIALE\nAGENCE CLIENTÈLE';
    address = 'Adresse ISAGO'; // Remplacez par l'adresse réelle si nécessaire
    logoSrc = 'assets/logo_isago.png';
  } else {
    company = 'SOMAGEP - S.A';
    headerRightTop = 'DIRECTION COMMERCIALE\nAGENCE CLIENTÈLE';
    address = 'SOCIÉTÉ MALIENNE DE GESTION DE L\'EAU POTABLE';
    logoSrc = 'assets/logo_somagep.png';
  }
  title = 'REÇU DE PAIEMENT';

  const dateTxt = new Date(d.dateHeure).toLocaleString('fr-FR');

  return `
  <div class="receipt">
    <div class="receipt-header">
      <div class="header-left">
        <img src="${logoSrc}" alt="logo" />
        <div>
          <div style="font-weight:bold">${company}</div>
          <div>${address}</div>
        </div>
      </div>
      <div class="header-title">
        <div>${headerRightTop.replaceAll('\n','<br>')}</div>
        <h2 style="margin:6px 0 0 0">${title}</h2>
      </div>
    </div>

    <div class="receipt-meta">
      <div><strong>RÉFÉRENCE CLIENT :</strong> ${d.refClient}</div>
      <div><strong>NOM / CONTRAT :</strong> ${d.nomContrat}</div>
      <div><strong>RÉFÉRENCE PAIEMENT :</strong> ${d.idTxn}</div>
      <div><strong>NUMÉRO REÇU :</strong> ${receiptNo}</div>
    </div>

    <div style="font-size:12px;margin-top:6px">
      Paiement effectué le ${dateTxt} via ${d.mode}. <strong>ID transaction :</strong> ${d.idTxn}
    </div>

    <table class="table">
      <thead>
        <tr>
          <th style="width:28%">MODE RÈGLEMENT</th>
          <th>FACTURE</th>
          <th style="width:16%">MONTANT</th>
          <th style="width:14%">FRAIS TIMBRE</th>
          <th style="width:16%">TOTAL</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${d.mode}</td>
          <td>${d.numFacture}</td>
          <td style="text-align:right">${d.montant.toLocaleString('fr-FR')}</td>
          <td style="text-align:right">0</td>
          <td style="text-align:right">${d.total.toLocaleString('fr-FR')}</td>
        </tr>
        <tr>
          <td colspan="2" style="text-align:right;font-weight:bold">TOTAL FACTURE</td>
          <td style="text-align:right;font-weight:bold">${d.total.toLocaleString('fr-FR')}</td>
          <td style="text-align:right;font-weight:bold">0</td>
          <td style="text-align:right;font-weight:bold">${d.total.toLocaleString('fr-FR')}</td>
        </tr>
      </tbody>
    </table>

    <div class="total-strip">
      <div class="box">TOTAL FACTURE<br>${d.total.toLocaleString('fr-FR')} F</div>
      <div class="box">MONTANT FRAIS<br>${d.frais.toLocaleString('fr-FR')} F</div>
      <div class="box">MONTANT PAYÉ<br>${d.montantPaye.toLocaleString('fr-FR')} F</div>
    </div>

    <div class="center-msg">${
      isEDM ? 'EDM-SA vous remercie'
      : (scope === 'isago' ? 'ISAGO-SA vous remercie' : 'SOMAGEP-SA vous remercie')
    }</div>

    <div class="barcode-area">
      <svg id="barcode-${scope}"></svg>
    </div>

    <div class="footer-operator">
      <div style="font-weight: bold; margin-bottom: 4px;">SAMASSA TECHNOLOGIE – SARL</div>
      <div style="font-size: 11px; margin-bottom: 2px;">Dirigeant : Boussé Samassa | Secteur : Maintenance informatique, gestion et solutions numériques</div>
      <div style="font-size: 10px; margin-bottom: 2px;">📍 Grand Marché de Kayes, près du 1er arrondissement de la police, Rue Soundiata Keita – Kayes, Mali</div>
      <div style="font-size: 10px; margin-bottom: 2px;">📞 +223 77 29 19 31 | 📧 samassatechnologie10@gmail.com</div>
      <div style="font-style: italic; font-size: 10px; margin-bottom: 4px;">« Tout pour l'informatique »</div>
      <div style="font-size: 11px;">SERVICE DE PAIEMENT & FACTURATION – AGENCE VIRTUELLE</div>
    </div>
    <div class="generated-note">
      Document généré le ${new Date().toLocaleString('fr-FR')} via navigateur.
    </div>
  </div>`;
}

function generateReceipt(scope){
  const preview = document.getElementById(`preview-${scope}`);
  preview.innerHTML = buildReceipt(scope);
  // Barcode: encode receipt number + idTxn
  const form = document.getElementById(`form-${scope}`);
  const data = Object.fromEntries(new FormData(form).entries());
  const isEDM = scope === 'edm';
  let type;
  if(isEDM){
    type = 'EDM';
  } else if(scope === 'isago'){
    type = 'ISAGO';
  } else {
    type = 'SOM';
  }
  const recId = preview.querySelector('.receipt-meta div:nth-child(4)').textContent.replace('NUMÉRO REÇU :','').trim();
  const content = `${type}|${recId}|${data.idTxn}|${data.numFacture}|${data.montant}`;
  JsBarcode(`#barcode-${scope}`, content, {format:'CODE128', displayValue:false, width:2, height:48, margin:0});
}

async function exportPDF(scope){
  const container = document.getElementById(`preview-${scope}`);
  if(!container.firstChild){ generateReceipt(scope); }
  const element = container.firstElementChild;
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF('p','pt','a4');
  const canvas = await html2canvas(element,{scale:2});
  const imgData = canvas.toDataURL('image/png');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const ratio = Math.min(pageWidth / canvas.width, pageHeight / canvas.height);
  const imgW = canvas.width * ratio;
  const imgH = canvas.height * ratio;
  pdf.addImage(imgData, 'PNG', (pageWidth-imgW)/2, 20, imgW, imgH);
  pdf.save(`${scope}-recu.pdf`);
}

function printReceipt(scope){
  const container = document.getElementById(`preview-${scope}`);
  if(!container.firstChild){ generateReceipt(scope); }
  window.print();
}
