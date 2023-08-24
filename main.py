from flask import Flask, render_template, request
import requests
from bs4 import BeautifulSoup
import pyautogui

username = ""
password = ""
pos_a = ""
pos_b = ""
pos_c = ""
pos_d = ""

app = Flask(__name__)


@app.route("/home")
def homepage():
    return "Esse é meu segundo site"


@app.route("/mens001", methods=["GET", "POST"])
def mens001():
    print(request.form.get("pos_a"))
    global pos_a
    pos_a = request.form.get("pos_a")
    # global pos_b
    # pos_b = request.form.get("pos_b")
    # global pos_c
    # pos_c = request.form.get("pos_c")
    # global pos_d
    # pos_d = request.form.get("pos_d")
    #
    if pos_a == "": #and (pos_b is None) and (pos_c is None) and (pos_d is None)
        return render_template("mens001.html")
    else:
        return render_template("login.html")


@app.route("/servicos", methods=["GET", "POST"])
def servicos():
    global servico
    servico = request.form.get("servico")

    if (servico is None):
        pass
    else:
        return render_template(servico.lower() + ".html")

    return render_template("servicos.html")


@app.route("/loginb", methods=["GET", "POST"])
def loginb():

    global username
    username = request.form.get("username")
    global password
    password = request.form.get("password")
    global resp
    resp = ""

    if (username is None) or (password is None):
        pass
    else:
        url = "https://inteligencia.conbras.com/Prisma4/WebServices/Public/SaveData.asmx"
        headers = {'content-type': 'text/xml'}
        body = """<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <CheckUser xmlns="http://sisteplant.com/">
      <user>""" + username + """</user>
      <password>""" + password + """</password>
      <company>MASTER2</company>
    </CheckUser>
  </soap:Body>
</soap:Envelope>"""

        response = requests.post(url, data=body, headers=headers)
        soup = BeautifulSoup(response.content, 'xml')
        resp = soup.find_all('CheckUserResult')[0].text
        print(resp)

    if resp == "OK":
        return servicos()
    elif resp == "":
        pass
    else:
        pyautogui.alert("Erro. Por favor, verifique seu login / senha.")

    return render_template("loginb.html")


if __name__ == "__main__":
    app.run(debug=True, port=3000)
