from flask import Flask, render_template, request, jsonify
import requests
from bs4 import BeautifulSoup
#import pyautogui
from urllib.parse import urlparse, parse_qs


app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        usernameValue = request.form.get('username')
        emailValue = request.form.get('email')
        telefoneValue = request.form.get('telefone')
        textoValue = request.form.get('texto')
        especialidadeValue = request.form.get('especialidade')

        if usernameValue == "":
            return jsonify(error="O nome de usuário é obrigatório.")

        if emailValue == "":
            return jsonify(error="O email é obrigatório.")
        elif not check_email(emailValue):
            return jsonify(error="Por favor, insira um email válido.")

        if telefoneValue == "":
            telefoneValue = "Telefone não informado"

        if especialidadeValue == "":
            return jsonify(error="A especialidade é obrigatória.")

        if textoValue == "":
            return jsonify(error="A descrição da ocorrência é obrigatória.")
        elif len(textoValue) < 20:
            return jsonify(error="Descreva em detalhes sua solicitação.")

        
        soap()

        return jsonify(message="O formulário está 100% válido!")

    return render_template('index.html')



def check_email(email):
    import re
    return re.match(r'^[\w\.-]+@[\w\.-]+$', email)


def soap():
    import datetime

    usernameValue = request.form.get('username')
    emailValue = request.form.get('email')
    telefoneValue = request.form.get('telefone')
    textoValue = request.form.get('texto')
    especialidadeValue = request.form.get('especialidade')

    today = datetime.datetime.now()
    dateTime = today.strftime('%Y-%m-%d %H:%M:%S')

    workRequestDescription = (
        f"Solicitante: {usernameValue}\n"
        f"E-mail: {emailValue}\n"
        f"Telefone: {telefoneValue}\n"
        f"Ocorrencia: {textoValue}"
    )

    print(workRequestDescription)

    sample_url = 0 ############################# definir a URL

    parsed_url = urlparse(sample_url)
    query_params = parse_qs(parsed_url.query)

    version = query_params.get('v', [None])[0]
    company = query_params.get('COMPANY', [None])[0]
    asset = query_params.get('ASSET', [None])[0]


    print("Version:", version)
    print("Company:", company)
    print("Asset:", asset)

    url = "https://inteligencia.conbras.com/Prisma4/WebServices/Public/SaveData.asmx"
    headers = {'content-type': 'text/xml'}
    body = f"""<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:xsd="http://www.w3.org/2001/XMLSchema"
    xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <SaveTableRow xmlns="http://sisteplant.com/">
          <user>USL</user>
          <company>MRVVT-ID03</company>
          <tableName>WorkRequest</tableName>
          <columnValues>
            <Column> <name>workRequestName</name> <value> ################# </value> </Column>
            <Column> <name>workRequestDescription</name> <value> ################# </value> </Column>
            <Column> <name>workRequestType</name> <value> ################ </value> </Column>
            <Column> <name>asset</name> <value>{asset}</value> </Column>
            <Column> <name>workRequestDate</name> <value>{data_convert}</value> </Column>
            <Column> <name>workRequestState</name> <value>00</value> </Column>
            <Column> <name>workType</name> <value>CHA</value> </Column>
            <Column> <name>defect</name> <value>SDF</value> </Column>
            <Column> <name>priority</name> <value>1</value> </Column>
            <Column> <name>requester</name> <value>{requester}</value> </Column>
            <Column> <name>job</name> <value>{especialidade}</value> </Column>
            <Column> <name>customService</name> <value>{servico}</value> </Column>
          </columnValues>
        </SaveTableRow>
      </soap:Body>
    </soap:Envelope>"""

    response = requests.post(url, data=body, headers=headers)
    soup = BeautifulSoup(response.content, 'xml')
    resp = soup.find_all('CheckUserResult')[0].text
    print(resp)

    if resp == "OK":
        return index()
    elif resp == "":
        pass
    else:
        pyautogui.alert("Erro. Por favor, verifique seu login / senha.")

    return render_template("loginb.html")


if __name__ == "__main__":
    app.run(debug=True)
