from flask import Flask, request, jsonify, render_template, session, redirect, url_for, escape
import os
import json
import threading
import time
import pandas as pd
import numpy as np
from datetime import datetime
from models.connectDatabase import ConnectDatabase
from controllers.urlController import UrlController
from controllers.dataController import DataController
from models.admin import Admin
from models.renter import Renter
from models.owner import Owner
from models.chat import Chat
from models.post import Post

# cấu hình đường dẫn và idSession
TEMPLATE_DIR = os.path.abspath('./templates')
STATIC_DIR = os.path.abspath('./static')
app = Flask(__name__, template_folder=TEMPLATE_DIR, static_folder=STATIC_DIR)
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'


# các API định tuyến URL
@app.route("/", methods=["GET"])
def home():
    """Routing trang home của guest, owner, renter và admin
    
    Parameters
    ----------
    None
    """
    urlController = UrlController()
    return urlController.homeController()

@app.route("/dang-nhap", methods=["GET"])
def login():
    """Routing trang đăng nhập
    
    Parameters
    ----------
    None
    """
    urlController = UrlController()
    return urlController.loginController()

@app.route("/dang-xuat", methods=["GET"])
def logout():
    """Xử lý yêu cầu đăng xuất

    Parameters
    ----------
    None
    """
    urlController = UrlController()
    return urlController.logoutController()


@app.route("/dang-ky", methods=["GET"])
def signup():
    """Routing trang đăng ký
    
    Parameters
    ----------
    None
    """
    urlController = UrlController()
    return urlController.signupController()

### Test trang kết quả
@app.route("/ket-qua", methods=["GET"])
def result():
    """Routing trang kết quả tìm kiếm
    
    Parameters
    ----------
    None
    """
    return render_template('search-result.html')





# get: find
# post: create
# put: update
# delete: xóa






# các API request, response data
@app.route("/submit-dang-nhap", methods=["POST"])
def submitLogin():
    """Kiểm tra thông tin đăng nhập

    Parameters
    ----------
    None
    """
    message = DataController().loginController()
    return app.response_class(json.dumps({"message": message}), mimetype='application/json')

@app.route("/kiem-tra-username", methods=["POST"])
def checkUsername():
    """Kiểm tra username đã tồn tại trước đó hay chưa

    Parameters
    ----------
    None
    """
    message = DataController().checkUsernameController()
    return app.response_class(json.dumps({"message": message}), mimetype='application/json')

@app.route("/submit-dang-ky", methods=["POST"])
def submitSignup():
    """Đăng ký tài khoản mới

    Parameters
    ----------
    None
    """
    message = DataController().signupController()
    return app.response_class(json.dumps({"message": message}), mimetype='application/json')



# @app.route("/", methods=["GET"])
# def home():
    # tt = time.time()
    # query_str = "SELECT * FROM renter WHERE username = 'renter1';"
    # rows  = connectDatabase.cursor.execute(query_str)
    # print(time.time() - tt)
    # for rw in rows:
    #     print(rw)
    # return render_template('test.html')

@app.route("/post", methods=["GET"])
def post():
    return render_template('post.html')

@app.route("/post", methods=["POST"])
def postm():
    return render_template('test.html')

@app.route("/detail-post", methods=["GET"])
def detailPost():
    return render_template('detail-post.html')

@app.route("/menu-renter", methods=["GET"])
def menu():
    return render_template('../static/page/menu-renter.html') 

# @app.route("/detail-post", methods=["GET"])
# def detailPost():
#     return render_template('detail-post.html')

# @app.route("/test", methods=["GET"])
# def test():
#     return render_template('test.html') alo k nghe thấy gì hết luôn


# @app.route("/test", methods=["GET"])
# def getData():
#     result = Admin().searchAccountOwner("buivanminh1966@gmail.com")
#     # print(result)
#     return app.response_class(json.dumps({"r1": result}), mimetype='application/json')
@app.route("/test", methods=["GET"])
def getData(): 
    # Post().getMoreInformationPost(1)
    # default: itemType(""), area(""), sort("", "price DESC", "price", "area DESC", "area"), statusItem(0, 1: "chungchu", 2:"khongchungchu")
    return app.response_class(json.dumps(Chat().getListChatRecentsOfAdmin()), mimetype='application/json')

# @app.route("/getImage", methods=["POST"])
# def getImage():
#     try:
#         image = request.get_json()["image"]
#     except:
#         image = request.form['image']
#     sql = "INSERT INTO renter (username, password, imageID) VALUES(%s, %s, %s);"
#     val = ("5", "3", str(image))
#     mycursor.execute(sql, val)
#     mydb.commit()
#     payload = {"status": "SUC"}
#     return jsonify(payload)


# @app.route("/preview", methods=["GET"])
# def preview():
#     sql = "SELECT imageID FROM renter WHERE username = '5';"
#     mycursor.execute(sql)
#     myresult = mycursor.fetchall()

#     for x in myresult:
#         return jsonify({"status": x})
    # return app.response_class(json.dumps(payload), mimetype='application/json')


@app.route("/upload", methods=["POST"])
def upload():
    image = request.files["inputImage"]
    return jsonify({'status': 'SUC', 'filename': image.filename})


if __name__ == "__main__":
    app.run(debug=True)


# import mysql.connector

# mydb = mysql.connector.connect(
#     host="remotemysql.com",
#     user="Au6FiBsWsm",
#     password="msjs6jhiWo",
#     database="Au6FiBsWsm"
# )

# mycursor = mydb.cursor()
