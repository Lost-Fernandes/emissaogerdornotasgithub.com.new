async function buscarAlquotaISS() {
  let endereco = document.getElementById("cep").value;

  try {
    const response = await fetch(`https://viacep.com.br/ws/${endereco}/json/`);
    const data = await response.json();

    let enderecoCompleto = `${data.logradouro}, ${data.bairro}`;
    let ufMunicipio = `${data.uf} - Município: ${data.localidade}`;

    document.getElementById("enderecoNota").textContent = enderecoCompleto;
    document.getElementById("telefoneNota").textContent = `${document.getElementById("telefone").value}`;
    document.getElementById("emailNota").textContent = `${document.getElementById("email").value}`;
    document.getElementById("ufMunicipioNota").textContent = ufMunicipio;

  } catch (error) {
    console.error('Erro ao buscar informações do endereço:', error);
  }
}

function formatarNumeroBrasileiro(numero) {
  return numero.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function preencherDadosTomador() {
  let nomeTomador = document.getElementById("nomeTomador").value;
  let enderecoTomador = document.getElementById("enderecoTomador").value;
  let telefoneTomador = document.getElementById("telefoneTomador").value;
  let emailTomador = document.getElementById("emailTomador").value;
  let ufMunicipioTomador = document.getElementById("ufMunicipioTomador").value;

  document.getElementById("nomeTomadorNota").textContent = nomeTomador;
  document.getElementById("enderecoTomadorNota").textContent = enderecoTomador;
  document.getElementById("telefoneTomadorNota").textContent = `Telefone: ${telefoneTomador}`;
  document.getElementById("emailTomadorNota").textContent = `E-mail: ${emailTomador}`;
  document.getElementById("ufMunicipioTomadorNota").textContent = `Município/UF: ${ufMunicipioTomador}`;
}

function calcularNotaFiscal() {
  buscarAlquotaISS(); 
  preencherDadosTomador();

  let nomePrestador = document.getElementById("nomePrestador").value;
  let valorServico = parseFloat(document.getElementById("valorServico").value);
  let descricaoServico = document.getElementById("descricaoServico").value;
  let aliquotaISS = parseFloat(document.getElementById("aliquotaISS").value);

  let valorISS = (aliquotaISS / 100) * valorServico;
  let total = valorServico + valorISS;

  document.getElementById("prestadorNota").textContent = nomePrestador;
  document.getElementById("dataEmissaoNota").textContent = document.getElementById("dataEmissao").value;
  document.getElementById("numeroNFSNota").textContent = document.getElementById("numeroNFS").value;
  document.getElementById("serieRPSNota").textContent = document.getElementById("serieRPS").value;
  document.getElementById("numeroRPSNota").textContent = document.getElementById("numeroRPS").value;
  document.getElementById("cnpjCpfNota").textContent = document.getElementById("cnpjCpf").value;
  document.getElementById("descricaoServicoNota").textContent = descricaoServico;
  document.getElementById("conjuntoTributacaoNota").textContent = document.getElementById("conjuntoTributacao").value;
  document.getElementById("codigoServicoNota").textContent = document.getElementById("codigoServico").value;
  document.getElementById("valorServicoNota").textContent = formatarNumeroBrasileiro(valorServico);
  document.getElementById("aliquotaISSNota").textContent = aliquotaISS.toFixed(2);
  document.getElementById("valorISSNota").textContent = formatarNumeroBrasileiro(valorISS);
  document.getElementById("totalNota").textContent = formatarNumeroBrasileiro(total);

  document.getElementById("notaFiscal").style.display = "block";
}

function gerarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Capturar a imagem do HTML
  const logoImg = document.getElementById('logo');
  const canvas = document.createElement('canvas');
  canvas.width = logoImg.naturalWidth;
  canvas.height = logoImg.naturalHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(logoImg, 0, 0);
  const logoBase64 = canvas.toDataURL('image/png'); // Convertendo a imagem para base64

  // Definir a largura e altura da imagem no PDF
  const imgWidth = 30; // Largura da imagem (ajuste conforme necessário)
  const imgHeight = imgWidth / (logoImg.naturalWidth / logoImg.naturalHeight); // Mantém a proporção da imagem

  // Adicionar o logo ao PDF no canto superior esquerdo
  doc.addImage(logoBase64, 'PNG', 10, 10, imgWidth, imgHeight); // Posicione o logo

  // Título do PDF (alinhado à direita da imagem)
  doc.setFontSize(20);
  const titleX = imgWidth + 50; // Espaço da imagem mais margem
  doc.text("EMISSÕES DE INFORMAÇÕES", titleX, 20);

  // Ajustar a posição para os próximos textos
  let yPosition = 50; // Começar logo abaixo do título

  // Dados do Prestador
  doc.setFontSize(12);
  doc.text("Dados do Prestador", 10, yPosition);
  yPosition += 6;
  doc.setFontSize(10);
  doc.text(`Nome: ${document.getElementById("prestadorNota").textContent}`, 10, yPosition);
  yPosition += 6;
  doc.text(`CNPJ/CPF: ${document.getElementById("cnpjCpfNota").textContent}`, 10, yPosition);
  yPosition += 10;

  // Dados do Tomador
  doc.setFontSize(12);
  doc.text("Dados do Tomador", 10, yPosition);
  yPosition += 6;
  doc.setFontSize(10);
  doc.text(`Nome: ${document.getElementById("nomeTomadorNota").textContent}`, 10, yPosition);
  yPosition += 6;
  doc.text(`Endereço: ${document.getElementById("enderecoTomadorNota").textContent}`, 10, yPosition);
  yPosition += 6;
  doc.text(`Telefone: ${document.getElementById("telefoneTomadorNota").textContent}`, 10, yPosition);
  yPosition += 6;
  doc.text(`E-mail: ${document.getElementById("emailTomadorNota").textContent}`, 10, yPosition);
  yPosition += 6;
  doc.text(`Município/UF: ${document.getElementById("ufMunicipioTomadorNota").textContent}`, 10, yPosition);
  yPosition += 10;

  // Dados do Serviço
  doc.setFontSize(12);
  doc.text("Dados do Serviço", 10, yPosition);
  yPosition += 6;
  doc.setFontSize(10);
  doc.text(`Descrição: ${document.getElementById("descricaoServicoNota").textContent}`, 10, yPosition);
  yPosition += 6;
  doc.text(`Valor do Serviço: ${document.getElementById("valorServicoNota").textContent}`, 10, yPosition);
  yPosition += 6;
  doc.text(`Aliquota ISS: ${document.getElementById("aliquotaISSNota").textContent}%`, 10, yPosition);
  yPosition += 6;
  doc.text(`Valor ISS: ${document.getElementById("valorISSNota").textContent}`, 10, yPosition);
  yPosition += 6;
  doc.text(`Total: ${document.getElementById("totalNota").textContent}`, 10, yPosition);
  yPosition += 10;

  // Detalhes da Nota Fiscal
  doc.setFontSize(12);
  doc.text("Detalhes da Nota Fiscal", 10, yPosition);
  yPosition += 6;
  doc.setFontSize(10);
  doc.text(`Número da NFS: ${document.getElementById("numeroNFSNota").textContent}`, 10, yPosition);
  yPosition += 6;
  doc.text(`Série do RPS: ${document.getElementById("serieRPSNota").textContent}`, 10, yPosition);
  yPosition += 6;
  doc.text(`Número do RPS: ${document.getElementById("numeroRPSNota").textContent}`, 10, yPosition);
  yPosition += 6;
  doc.text(`Data de Emissão: ${document.getElementById("dataEmissaoNota").textContent}`, 10, yPosition);

  // Salvar PDF
  doc.save("nota_fiscal_com_logo.pdf");
}
