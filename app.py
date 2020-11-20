from flask import Flask, request, jsonify, render_template, session, redirect, url_for, escape
import os
import json
import threading
import time
import pandas as pd
import numpy as np
from datetime import datetime
from flask_mysqldb import MySQL

TEMPLATE_DIR = os.path.abspath('./templates')
STATIC_DIR = os.path.abspath('./static')
app = Flask(__name__, template_folder=TEMPLATE_DIR, static_folder=STATIC_DIR)
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'password'
app.config['MYSQL_DB'] = 'Au6FiBsWsm'

mysql = MySQL(app)


@app.route("/", methods=["GET"])
def home():
    return render_template('test.html')


@app.route("/test", methods=["GET"])
def getData():
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM `Address` WHERE id = 1")
    rv = cur.fetchall()
    payload = [{"status": "SUC"}]
    content = {}
    for result in rv:
        content = {'id': result[0], 'province': result[1],
                   'district': result[2], 'ward': result[3]}
        payload.append(content)
        content = {}
    # return app.response_class(json.dumps(payload), mimetype='application/json')
    return jsonify(payload)


if __name__ == "__main__":
    app.run(debug=True)
