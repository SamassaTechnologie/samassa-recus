let receiptCount = 1;

document.getElementById("receiptForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const service = document.getElementById("service").value;
  const refClient = document.getElementById("refClient").value;
  const contrat = document.getElementById("contrat").value;
  const compteur = document.getElementById("compteur").value;
  const montant = document.getElementById("montant").value;
  const facture = document.getElementById("facture").value;
  const frais = document.getElementById("frais").value;
  const mode = document.getElementById("mode").value;
  const transaction = document.getElementById("transaction").value;
  const date = document.getElementById("date").value;

  document.getElementById("serviceTitle").innerText = "Reçu " + service;
  document.getElementById("outRefClient").innerText = refClient;
  document.getElementById("outContrat").innerText = contrat;
  document.getElementById("outCompteur").innerText = compteur;
  document.getElementById("outMontant").innerText = montant;
  document.getElementById("outFacture").innerText = facture;
  document.getElementById("outFrais").innerText = frais;
  document.getElementById("outMode").innerText = mode;
  document.getElementById("outTransaction").innerText = transaction;
  document.getElementById("outDate").innerText = date;
  document.getElementById("receiptNumber").innerText = "SAM-" + receiptCount++;

  // Logo service
  const serviceLogo = document.getElementById("serviceLogo");
  if (service === "EDM") serviceLogo.src = "assets/logo_edm.png";
  if (service === "SOMAGEP") serviceLogo.src = "assets/logo_somagep.png";
  if (service === "ISAGO") serviceLogo.src = "assets/logo_isago.png";

  // Générer QR code
  document.getElementById("qrcode").innerHTML = "";
  new QRCode(document.getElementById("qrcode"), {
    text: "Transaction " + transaction + " - " + montant + " F CFA",
    width: 100,
    height: 100
  });

  document.getElementById("receipt").classList.remove("hidden");
});

// Export PDF
document.getElementById("downloadPdf").addEventListener("click", function() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.html(document.getElementById("receipt"), {
    callback: function (doc) {
      doc.save("recu_samassa.pdf");
    },
    x: 10,
    y: 10
  });
});
