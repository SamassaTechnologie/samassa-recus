let receiptCount = 0;

document.getElementById("receiptForm").addEventListener("submit", function(e) {
  e.preventDefault();
  receiptCount++;

  const service = document.getElementById("service").value;
  const refClient = document.getElementById("refClient").value;
  const clientName = document.getElementById("clientName").value;
  const numCompteur = document.getElementById("numCompteur").value;
  const numFacture = document.getElementById("numFacture").value;
  const montant = parseFloat(document.getElementById("montant").value);
  const frais = parseFloat(document.getElementById("frais").value);
  const mode = document.getElementById("mode").value;
  const transaction = document.getElementById("transaction").value;
  const dateHeure = document.getElementById("dateHeure").value;

  const total = montant + frais;

  // Choisir logo du service
  let logoService = "assets/logo_edm.png";
  if (service === "SOMAGEP") logoService = "assets/logo_somagep.png";
  if (service === "ISAGO") logoService = "assets/logo_isago.png";

  // Générer reçu
  document.getElementById("receiptOutput").innerHTML = `
    <div class="receipt">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <img src="assets/logo_samassa.png" style="height:60px;">
        <img src="${logoService}" style="height:60px;">
      </div>
      <h2 style="text-align:center;">REÇU DE PAIEMENT</h2>
      <p><b>Référence client :</b> ${refClient}</p>
      <p><b>Nom / Contrat :</b> ${clientName}</p>
      <p><b>Numéro compteur :</b> ${numCompteur}</p>
      <p><b>Numéro facture :</b> ${numFacture}</p>
      <p><b>Montant :</b> ${montant} F CFA</p>
      <p><b>Frais :</b> ${frais} F CFA</p>
      <p><b>Total payé :</b> ${total} F CFA</p>
      <p><b>Mode de règlement :</b> ${mode}</p>
      <p><b>ID Transaction :</b> ${transaction}</p>
      <p><b>Date / Heure :</b> ${dateHeure}</p>
      <p><b>Numéro de reçu :</b> SAM-${receiptCount}</p>
      <br>
      <p style="text-align:center;">Paiement effectué chez SAMASSA TECHNOLOGIE, opérateur de services agréé pour EDM, SOMAGEP et ISAGO.</p>
    </div>
  `;

  document.getElementById("printBtn").style.display = "block";
});

// Impression PDF
document.getElementById("printBtn").addEventListener("click", function() {
  window.print();
});