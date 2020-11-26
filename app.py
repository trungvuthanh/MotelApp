from flask import Flask, request, jsonify, render_template, session, redirect, url_for, escape
import os
import json
import threading
import time
import pandas as pd
import numpy as np
from datetime import datetime
import mysql.connector

TEMPLATE_DIR = os.path.abspath('./templates')
STATIC_DIR = os.path.abspath('./static')
app = Flask(__name__, template_folder=TEMPLATE_DIR, static_folder=STATIC_DIR)
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'

mydb = mysql.connector.connect(
    host="remotemysql.com",
    user="Au6FiBsWsm",
    password="msjs6jhiWo",
    database="Au6FiBsWsm"
)

mycursor = mydb.cursor()


@app.route("/", methods=["GET"])
def home():
    return render_template('test.html')

@app.route("/post", methods=["GET"])
def post():
    return render_template('post.html')

@app.route("/post", methods=["POST"])
def postm():
    return render_template('test.html')

@app.route("/detail-post", methods=["GET"])
def detailPost():
    return render_template('detail-post.html')

@app.route("/test", methods=["GET"])
def getData():
    sql = "SELECT * FROM `address` WHERE id = 1;"
    mycursor.execute(sql)
    rv = mycursor.fetchall()
    payload = [{"status": "SUC"}]
    content = {}
    for result in rv:
        content = {'id': result[0], 'province': result[1],
                   'district': result[2], 'ward': result[3]}
        payload.append(content)
        content = {}
    return jsonify(payload)


@app.route("/getImage", methods=["POST"])
def getImage():
    try:
        image = request.get_json()["image"]
    except:
        image = request.form['image']
    sql = "INSERT INTO renter (username, password, imageID) VALUES(%s, %s, %s);"
    val = ("5", "3", str(image))
    mycursor.execute(sql, val)
    mydb.commit()
    payload = {"status": "SUC"}
    return jsonify(payload)


@app.route("/preview", methods=["GET"])
def preview():
    sql = "SELECT imageID FROM renter WHERE username = '5';"
    mycursor.execute(sql)
    myresult = mycursor.fetchall()

    for x in myresult:
        return jsonify({"status": x})
    # return app.response_class(json.dumps(payload), mimetype='application/json')


@app.route("/upload", methods=["POST"])
def upload():
    image = request.files["inputImage"]
    return jsonify({'status': 'SUC', 'filename': image.filename})


if __name__ == "__main__":
    app.run(debug=True)
