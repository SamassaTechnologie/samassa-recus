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
  const isISAGO = scope === 'isago';
  
  // Configuration des informations par société
  let receiptNo, company, headerInfo, address, title, logoSrc;
  receiptNo = nextReceiptNumber(isEDM ? 'EDM' : (isISAGO ? 'ISAGO' : 'SOM'));
  
  if(isEDM){
    company = 'ENERGIE DU MALI - SA';
    headerInfo = 'DIRECTION COMMERCIALE\nAGENCE VIRTUELLE';
    address = 'SQUARE PATRICE LUMUMBA, B.P.69, BAMAKO, MALI';
    logoSrc = 'assets/logo_edm.png';
  } else if(isISAGO){
    company = 'ISAGO';
    headerInfo = 'Direction Générale\nSquare Lumumba\nBP 69 BAMAKO';
    address = 'ISAGO SA';
    logoSrc = 'assets/logo_isago.png';
  } else {
    company = 'SOMAGEP - S.A';
    headerInfo = 'DIRECTION COMMERCIALE\nAGENCE CLIENTÈLE';
    address = 'SOCIÉTÉ MALIENNE DE GESTION DE L\'EAU POTABLE';
    logoSrc = 'assets/logo_somagep.png';
  }
  
  title = isISAGO ? 'REÇU PAIEMENT DE FACTURE' : 'REÇU DE PAIEMENT';

  const dateTxt = new Date(d.dateHeure).toLocaleDateString('fr-FR');
  
  // Style spécial pour ISAGO basé sur le modèle fourni
  if(isISAGO){
    return `
    <div class="receipt isago-style">
      <div class="receipt-header-isago">
        <div class="header-left">
          <img src="${logoSrc}" alt="logo" style="width: 80px; height: auto;" />
        </div>
        <div class="header-center">
          <h2 style="margin: 0; font-size: 18px; font-weight: bold; text-align: center;">${title}</h2>
        </div>
        <div class="header-right" style="text-align: right; font-size: 12px;">
          ${headerInfo.replaceAll('\n','<br>')}
        </div>
      </div>

      <div style="margin: 20px 0; font-size: 14px;">
        <div style="margin-bottom: 8px;"><strong>Reçu N°:</strong> ${receiptNo}</div>
        <div style="margin-bottom: 8px;"><strong>Date:</strong> ${dateTxt}</div>
        <div style="margin-bottom: 8px;"><strong>Vendeur:</strong> ${d.vendeur || 'ISAGO Agence'}</div>
        <div style="margin-bottom: 8px;"><strong>N° client:</strong> ${d.refClient}</div>
        <div style="margin-bottom: 8px;"><strong>Facture:</strong> ${d.numFacture}</div>
        <div style="margin-bottom: 8px;"><strong>Période:</strong> ${d.periode || ''}</div>
        <div style="margin-bottom: 8px;"><strong>Contact:</strong> ${d.contact || ''}</div>
      </div>

      <table class="table-isago" style="width: 100%; border-collapse: collapse; border: 2px solid #000; margin: 20px 0;">
        <thead>
          <tr style="background-color: #f0f0f0;">
            <th style="border: 1px solid #000; padding: 8px; text-align: center; font-weight: bold;">DÉTAIL PAIEMENT</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #000; padding: 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <th style="border-right: 1px solid #000; padding: 8px; background-color: #f9f9f9; text-align: center; font-weight: bold;">MODE RÈGLEMENT</th>
                  <th style="border-right: 1px solid #000; padding: 8px; background-color: #f9f9f9; text-align: center; font-weight: bold;">MONTANT</th>
                  <th style="border-right: 1px solid #000; padding: 8px; background-color: #f9f9f9; text-align: center; font-weight: bold;">FRAIS</th>
                  <th style="padding: 8px; background-color: #f9f9f9; text-align: center; font-weight: bold;">TOTAL</th>
                </tr>
                <tr>
                  <td style="border-right: 1px solid #000; padding: 8px; text-align: center;">${d.mode}</td>
                  <td style="border-right: 1px solid #000; padding: 8px; text-align: center;">${d.montant.toLocaleString('fr-FR')} F CFA</td>
                  <td style="border-right: 1px solid #000; padding: 8px; text-align: center;">${d.frais.toLocaleString('fr-FR')} F CFA</td>
                  <td style="padding: 8px; text-align: center; font-weight: bold;">${d.montantPaye.toLocaleString('fr-FR')} F CFA</td>
                </tr>
              </table>
            </td>
          </tr>
        </tbody>
      </table>

      <div style="text-align: center; margin: 20px 0; font-style: italic;">
        ISAGO SA vous remercie d'avoir utilisé sa solution de paiement.
      </div>

      <div class="barcode-area" style="text-align: center; margin: 20px 0;">
        <svg id="barcode-${scope}"></svg>
      </div>

      <div class="footer-operator" style="border-top: 1px solid #ccc; padding-top: 15px; margin-top: 20px; font-size: 10px; text-align: center;">
        <div style="font-weight: bold; margin-bottom: 4px;">SAMASSA TECHNOLOGIE – SARL</div>
        <div style="margin-bottom: 2px;">Dirigeant : Boussé Samassa | Secteur : Maintenance informatique, gestion et solutions numériques</div>
        <div style="margin-bottom: 2px;">📍 Grand Marché de Kayes, près du 1er arrondissement de la police, Rue Soundiata Keita – Kayes, Mali</div>
        <div style="margin-bottom: 2px;">📞 +223 77 29 19 31 | 📧 samassatechnologie10@gmail.com</div>
        <div style="font-style: italic; margin-bottom: 4px;">« Tout pour l'informatique »</div>
        <div>SERVICE DE PAIEMENT & FACTURATION – AGENCE VIRTUELLE</div>
      </div>
      <div class="generated-note" style="text-align: center; font-size: 9px; color: #666; margin-top: 10px;">
        Document généré le ${new Date().toLocaleString('fr-FR')} via navigateur.
      </div>
    </div>`;
  }

  // Style standard pour EDM et SOMAGEP
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
        <div>${headerInfo.replaceAll('\n','<br>')}</div>
        <h2 style="margin:6px 0 0 0">${title}</h2>
      </div>
    </div>

    <div class="receipt-meta">
      <div><strong>RÉFÉRENCE CLIENT :</strong> ${d.refClient}</div>
      <div><strong>NOM / CONTRAT :</strong> ${d.nomContrat}</div>
      <div><strong>RÉFÉRENCE PAIEMENT :</strong> ${d.idTxn}</div>
      <div><strong>NUMÉRO REÇU :</strong> ${receiptNo}</div>
      <div><strong>VENDEUR :</strong> ${d.vendeur || ''}</div>
      <div><strong>PÉRIODE :</strong> ${d.periode || ''}</div>
      <div><strong>CONTACT :</strong> ${d.contact || ''}</div>
    </div>

    <div style="font-size:12px;margin-top:6px">
      Paiement effectué le ${new Date(d.dateHeure).toLocaleString('fr-FR')} via ${d.mode}. <strong>ID transaction :</strong> ${d.idTxn}
    </div>

    <table class="table">
      <thead>
        <tr>
          <th style="width:28%">MODE RÈGLEMENT</th>
          <th>FACTURE</th>
          <th style="width:16%">MONTANT</th>
          <th style="width:14%">FRAIS</th>
          <th style="width:16%">TOTAL</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${d.mode}</td>
          <td>${d.numFacture}</td>
          <td style="text-align:right">${d.montant.toLocaleString('fr-FR')} F</td>
          <td style="text-align:right">${d.frais.toLocaleString('fr-FR')} F</td>
          <td style="text-align:right">${d.montantPaye.toLocaleString('fr-FR')} F</td>
        </tr>
        <tr>
          <td colspan="2" style="text-align:right;font-weight:bold">TOTAL</td>
          <td style="text-align:right;font-weight:bold">${d.montant.toLocaleString('fr-FR')} F</td>
          <td style="text-align:right;font-weight:bold">${d.frais.toLocaleString('fr-FR')} F</td>
          <td style="text-align:right;font-weight:bold">${d.montantPaye.toLocaleString('fr-FR')} F</td>
        </tr>
      </tbody>
    </table>

    <div class="total-strip">
      <div class="box">MONTANT FACTURE<br>${d.montant.toLocaleString('fr-FR')} F</div>
      <div class="box">MONTANT FRAIS<br>${d.frais.toLocaleString('fr-FR')} F</div>
      <div class="box">MONTANT PAYÉ<br>${d.montantPaye.toLocaleString('fr-FR')} F</div>
    </div>

    <div class="center-msg">${
      isEDM ? 'EDM-SA vous remercie'
      : 'SOMAGEP-SA vous remercie'
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
