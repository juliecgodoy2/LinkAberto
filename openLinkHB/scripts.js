// INÍCIO DE ROTINAS DE VERIFICAÇÃO DO FORMULÁRIO

const form = document.getElementById("form");
const username = document.getElementById("username");
const email = document.getElementById("email");
const telefone = document.getElementById("telefone");
const texto = document.getElementById("texto");

var select = document.getElementById("especialidade");
var especialidade = '';
select.onchange = function(){
    especialidade = this.value;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  checkInputs();
});

function checkInputs() {
  const usernameValue = username.value;
  const emailValue = email.value;
  const telefoneValue = telefone.value;
  const textoValue = texto.value;
  const especialidadeValue = especialidade;

  if (usernameValue === "") {
    setErrorFor(username, "O nome de usuário é obrigatório.");
  } else {
    setSuccessFor(username);
  }

  if (emailValue === "") {
    setErrorFor(email, "O email é obrigatório.");
  } else if (!checkEmail(emailValue)) {
    setErrorFor(email, "Por favor, insira um email válido.");
  } else {
    setSuccessFor(email);
  }

  if (telefoneValue === "") {
    telefone.value = "Telefone não informado";
    setSuccessFor(telefone);
  } else {
    setSuccessFor(telefone);
  }

  if (especialidadeValue === "") {
    setErrorFor(select, "A especialidade é obrigatória.");
  } else {
    setSuccessFor(select);
  }
 
  if (textoValue === "") {
    setErrorFor(texto, "A descrição da ocorrência é obrigatória.");
  } else if (textoValue.length < 20) {
    setErrorFor(texto, "Descreva em detalhes sua solicitação.");
  } else {
    setSuccessFor(texto);
  }

  const formControls = form.querySelectorAll(".form-control");

  const formIsValid = [...formControls].every((formControl) => {
    return formControl.className === "form-control success";
  });

  if (formIsValid) {
    console.log("O formulário está 100% válido!");
    soap();
  }
}

function setErrorFor(input, message) {
  const formControl = input.parentElement;
  const small = formControl.querySelector("small");

  // Adiciona a mensagem de erro
  small.innerText = message;

  // Adiciona a classe de erro
  formControl.className = "form-control error";
}

function setSuccessFor(input) {
  const formControl = input.parentElement;

  // Adicionar a classe de sucesso
  formControl.className = "form-control success";
}

function checkEmail(email) {
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  );
}

// TÉRMINO DE ROTINAS DE VERIFICAÇÃO DO FORMULÁRIO

// INÍCIO DE ROTINAS DE GRAVAÇÃO

function soap() {

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var yyyy = String(today.getFullYear());
  var hh = String(today.getHours()).padStart(2,'0');
  var mn = String(today.getMinutes()).padStart(2,'0');
  var ss = String(today.getSeconds()).padStart(2,'0');
  const dateTime = yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + mn+ ':' + ss;

  const workRequestDescription = "Solicitante: " + username.value + "\n" +
  "E-mail: " + email.value + "\n" +
  "Telefone: " + telefone.value + "\n" +
  "Ocorrencia: " + texto.value;
  
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const version = urlParams.get('v');
  const company = urlParams.get('COMPANY');
  const asset = urlParams.get('ASSET');
  let vrs = ""

  switch(version) {
    case "1":
      vrs = "http://localhost/Prisma4/WebServices/Public/SaveData.asmx";
      break;
    case "2":
      vrs = "https://www.prisma-dev.com.br/ConbrasP4DEV/WebServices/Public/SaveData.asmx";
      break;
    case "3":
      vrs = "https://inteligencia.conbras.com/Prisma4/WebServices/Public/SaveData.asmx";
      break;
  }

  // alert("vrs = " + vrs);
  // alert("1. Empresa: " + company + "\n" + "Ativo: " + asset);

  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open('POST', vrs, true);
  var sr =
  '<?xml version="1.0" encoding="utf-8"?>' +
      '<soapenv:Envelope ' + 
          'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
          'xmlns:xsd="http://www.w3.org/2001/XMLSchema" ' +
          'xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">' +
          '<soapenv:Body>' +
            '<SaveTableRow xmlns="http://sisteplant.com/">' +
              '<user>USL</user>' +
              '<company>' + company + '</company>' +
              '<tableName>WorkRequest</tableName>' +
              '<columnValues>' +
                '<Column>' +
                  '<name>workRequestName</name>' +
                  '<value>ABERTURA DE CHAMADO</value>' +
                '</Column>' +
                '<Column>' +
                  '<name>workRequestType</name>' +
                  '<value>' + especialidade + '</value>' +
                '</Column>' +
                '<Column>' +
                  '<name>asset</name>' +
                  '<value>' + asset + '</value>' +
                '</Column>' +
                '<Column>' +
                  '<name>workRequestDate</name>' +
                  '<value>' + dateTime + '</value>' +
                '</Column>' +
                '<Column>' +
                  '<name>workRequestState</name>' +
                  '<value>00</value>' +
                '</Column>' +
                '<Column>' +
                  '<name>workType</name>' +
                  '<value>CHA</value>' +
                '</Column>' +
                '<Column>' +
                  '<name>defect</name>' +
                  '<value>CMD</value>' +
                '</Column>' +
                '<Column>' +
                  '<name>priority</name>' +
                  '<value>1</value>' +
                '</Column>' +
                '<Column>' +
                  '<name>requester</name>' +
                  '<value>USL</value>' +
                '</Column>' +
                '<Column>' +
                  '<name>job</name>' +
                  '<value>' + especialidade + '</value>' +
                '</Column>' +            
                '<Column>' +
                  '<name>workRequestDescription</name>' +
                  '<value>' + workRequestDescription + '</value>' +
                '</Column>' +  
                '<Column>' +
                  '<name>customService</name>' +
                  '<value>CMD-001</value>' +
                '</Column>' +                                                                               
              '</columnValues>' +
            '</SaveTableRow>' +
          '</soapenv:Body>' +
      '</soapenv:Envelope>';

  xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState == 4) {
          if (xmlhttp.status == 200) {
            form.reset();
            alert("Solicitação enviada com sucesso. Aguarde, você receberá o número da Ordem de Serviço por e-mail.");
          }
          else {
            alert(xmlhttp.responseText);
          }
      }
  }
  // Send the POST request
  xmlhttp.setRequestHeader('Content-Type', 'text/xml');
  xmlhttp.send(sr);
  // send request
}