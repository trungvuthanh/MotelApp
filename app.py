from flask import Flask, request, jsonify, render_template, session, redirect, url_for, escape
import os
import json
from controllers.urlController import UrlController
from controllers.dataController import DataController

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





if __name__ == "__main__":
    app.run(debug=True)