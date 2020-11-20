from flask import Flask, request, jsonify, render_template, session, redirect, url_for, escape
import os, json, threading, time
import pandas as pd
import numpy as np
from datetime import datetime

TEMPLATE_DIR = os.path.abspath('./templates')
STATIC_DIR = os.path.abspath('./static')
app = Flask(__name__, template_folder=TEMPLATE_DIR, static_folder=STATIC_DIR)
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'

@app.route("/", methods=["GET"])
def home():
    pass

if __name__ == "__main__":
    app.run(debug=True)