from flask import Flask, request, jsonify, render_template, session, redirect, url_for, escape
from flask_socketio import SocketIO, send, emit
import os
import json
from controllers.urlController import UrlController
from controllers.dataController import DataController
from models.post import Post
from models.address import Address
from models.otherEvent import OtherEvent
import time

# cấu hình đường dẫn và idSession
TEMPLATE_DIR = os.path.abspath('./templates')
STATIC_DIR = os.path.abspath('./static')
app = Flask(__name__, template_folder=TEMPLATE_DIR, static_folder=STATIC_DIR)
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'
socketio = SocketIO(app, cors_allowed_origins='*')

# -----------------------------------------------------------------------------------
# ----------------------------API trang home 4 bên-----------------------------------
# -----------------------------------------------------------------------------------
@app.route("/", methods=["GET"])
def home():
    """Routing trang home của guest, owner, renter và admin
    
    Parameters
    ----------
    None
    """
    urlController = UrlController()
    return urlController.homeController()

@app.route("/quan-ly-bai-dang", methods=["GET"])
def managerPost():
    urlController = UrlController()
    return urlController.managerPost()




# -----------------------------------------------------------------------------------
# ----------------------------API recommend search-----------------------------------
# -----------------------------------------------------------------------------------
@app.route("/recommendSearch/<stringSearch>", methods=["GET"])
def recommendSearch(stringSearch):
    return app.response_class(json.dumps(OtherEvent().fuzzywuzzySearch(stringSearch, 5)), mimetype='application/json')    




# -----------------------------------------------------------------------------------
# ----------------------------API trang đăng nhập------------------------------------
# -----------------------------------------------------------------------------------
@app.route("/dang-nhap", methods=["GET"])
def login():
    """Routing trang đăng nhập
    
    Parameters
    ----------
    None
    """
    urlController = UrlController()
    return urlController.loginController()

@app.route("/submit-dang-nhap", methods=["POST"])
def submitLogin():
    """Kiểm tra thông tin đăng nhập

    Parameters
    ----------
    None
    """
    message = DataController().loginController()
    return app.response_class(json.dumps({"message": message}), mimetype='application/json')



# -----------------------------------------------------------------------------------
# ----------------------------API địa chỉ--------------------------------------------
# -----------------------------------------------------------------------------------
@app.route("/getProvinces", methods=["GET"])
def getProvinces():
    return app.response_class(json.dumps({"provinces": Address.getProvince()}), mimetype='application/json')

@app.route("/getDistricts/<province>", methods=["GET"]) 
def getDistricts(province):
    return app.response_class(json.dumps({"districts": Address.getDistrict(province)}), mimetype='application/json')


@app.route("/getWards/<province>/<district>", methods=["GET"])
def getWards(province, district):
    return app.response_class(json.dumps({"wards": Address.getWard(province, district)}), mimetype='application/json')


# -----------------------------------------------------------------------------------
# ----------------------------API trang đăng ký--------------------------------------
# -----------------------------------------------------------------------------------
@app.route("/dang-ky", methods=["GET"])
def signup():
    """Routing trang đăng ký
    
    Parameters
    ----------
    None
    """
    urlController = UrlController()
    return urlController.signupController()

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



# -----------------------------------------------------------------------------------
# ----------------------------API đăng xuất------------------------------------------
# -----------------------------------------------------------------------------------
@app.route("/dang-xuat", methods=["GET"])
def logout():
    """Xử lý yêu cầu đăng xuất

    Parameters
    ----------
    None
    """
    urlController = UrlController()
    return urlController.logoutController()



# -----------------------------------------------------------------------------------
# ----------------------------API get Information account----------------------------
# -----------------------------------------------------------------------------------
@app.route("/information-account", methods=["GET"]) # update từ type-account
def informationAccount():
    if 'type_account' not in session:
        return app.response_class(json.dumps({"typeAccount": "guest"}), mimetype='application/json')
    return app.response_class(json.dumps({"typeAccount": session['type_account'], "typeAvt": session['type_avatar'], "username": session['username'], "fullname": session['fullname']}), mimetype='application/json')    



# -----------------------------------------------------------------------------------
# ----------------------------API trang kết quả tìm kiếm-----------------------------
# -----------------------------------------------------------------------------------
@app.route("/<loaibaiviet>/dia-chi/<stringSeachNoRecommend>/0/gia/<minPrice>/<maxPrice>/dien-tich-tu/<int:minArea>", methods=["GET"])
def searchPostButNoRecommend(loaibaiviet, stringSeachNoRecommend, minPrice, maxPrice, minArea):
    return render_template("search-result.html")

@app.route("/<loaibaiviet>/dia-chi/<tinh>/1/gia/<minPrice>/<maxPrice>/dien-tich-tu/<int:minArea>", methods=["GET"])
def searchPostFromProvince(loaibaiviet, tinh, minPrice, maxPrice, minArea):
    return render_template("search-result.html")

@app.route("/<loaibaiviet>/dia-chi/<tinh>/<huyen>/gia/<minPrice>/<maxPrice>/dien-tich-tu/<int:minArea>", methods=["GET"])
def searchPostFromDistrict(loaibaiviet, tinh, huyen, minPrice, maxPrice, minArea):
    return render_template("search-result.html")

@app.route("/<loaibaiviet>/dia-chi/<stringSeachNoRecommend>/0/gia/<minPrice>/<maxPrice>/dien-tich-tu/<int:minArea>", methods=["POST"])
def getPostButNoRecommend(loaibaiviet, stringSeachNoRecommend, minPrice, maxPrice, minArea):
    # body có thể có: pageNumber (start: 1), statusItem (1: "chungchu", 2:"khongchungchu"), sort("price DESC", "price", "area DESC", "area")
    # tham số nào không có thì "không" để default value (statusItem, sort)
    dataController = DataController()
    return dataController.getPostButNoRecommend(loaibaiviet, stringSeachNoRecommend, minPrice, maxPrice, minArea)

@app.route("/<loaibaiviet>/dia-chi/<tinh>/1/gia/<minPrice>/<maxPrice>/dien-tich-tu/<int:minArea>", methods=["POST"])
def getPostFromProvince(loaibaiviet, tinh, minPrice, maxPrice, minArea):
    dataController = DataController()
    return dataController.getPostFromProvince(loaibaiviet, tinh, minPrice, maxPrice, minArea)

@app.route("/<loaibaiviet>/dia-chi/<tinh>/<huyen>/gia/<minPrice>/<maxPrice>/dien-tich-tu/<int:minArea>", methods=["POST"])
def getPostFromDistrict(loaibaiviet, tinh, huyen, minPrice, maxPrice, minArea):
    dataController = DataController()
    return dataController.getPostFromDistrict(loaibaiviet, tinh, huyen, minPrice, maxPrice, minArea)


# -----------------------------------------------------------------------------------
# ----------------------------API get image Post-------------------------------------
# -----------------------------------------------------------------------------------
@app.route("/getImagePost/<int:idPost>/<limit>", methods=["GET"])
def getImagePost(idPost, limit):
    # limit: "one" or "all"
    if limit not in ["one", "all"]:
        return 
    print(Post().getImagePost(idPost, limit))
    return app.response_class(json.dumps(Post().getImagePost(idPost, limit)), mimetype='application/json')    



# -----------------------------------------------------------------------------------
# ----------------------------API favorite post--------------------------------------
# -----------------------------------------------------------------------------------
@app.route("/isFavoritePost/<int:idPost>", methods=["GET"])
def isFavoritePost(idPost):
    return app.response_class(json.dumps(OtherEvent().isFavoritePost(session["username"], idPost)), mimetype='application/json')
    
@app.route("/updateFavoritePost/<int:idPost>/<status>", methods=["GET"])
def updateFavoritePost(idPost, status):
    # status in ["add", "remove"]
    try:
        if status == "add":
            OtherEvent().eventFavoritePost(idPost, session["username"], "add")
        elif status == "remove":
            OtherEvent().unFavoritePost(session["username"], idPost)
        return app.response_class(json.dumps({"result": "success"}), mimetype='application/json')  
    except:  
        1
    return app.response_class(json.dumps({"result": "fail"}), mimetype='application/json')    



# -----------------------------------------------------------------------------------
# ----------------------------API trang detail post----------------------------------
# -----------------------------------------------------------------------------------
@app.route("/bai-dang/<baidangidpost>", methods=["GET"])
def getPost(baidangidpost):
    # baidangidpost: "nha-chung-cu-nguyen-can-gia-re-1"
    # partern: tieu-de-bai-dang-idPost
    titlePost = " ".join(baidangidpost.split("-")[:-1])
    idPost = int(baidangidpost.split("-")[-1])
    return UrlController().detailPost(idPost, titlePost)

@app.route("/thong-tin-bai-dang/<baidangidpost>", methods=["POST"])
def getInformationPost(baidangidpost):
    # baidangidpost: "nha-chung-cu-nguyen-can-gia-re-1"
    # partern: tieu-de-bai-dang-idPost
    titlePost = " ".join(baidangidpost.split("-")[:-1])
    idPost = int(baidangidpost.split("-")[-1])
    return DataController().detailPost(idPost, titlePost)
    
@app.route("/report/<int:idPost>/<int:fakeInfo>/<int:fakePrice>", methods=["POST"])
def sendReport(idPost, fakeInfo, fakePrice):
    dataController = DataController()
    return app.response_class(json.dumps({"message": DataController().renterSendReport(idPost, fakeInfo, fakePrice)}), mimetype='application/json')
 


# -----------------------------------------------------------------------------------
# ----------------------------API trang historyB-------------------------------------
# -----------------------------------------------------------------------------------   
@app.route("/lich-su-yeu-thich-va-lich-su-xem", methods=["GET"])
def historyB():
    if "type_account" not in session or session["type_account"] != "renter":
        time.sleep(10) 
        return
    return render_template("historyB.html")

@app.route("/getHistoryView", methods=["GET"])
def getHistoryView():
    if "type_account" not in session or session["type_account"] != "renter":
        time.sleep(10) 
        return
    dataController = DataController()
    return app.response_class(json.dumps(dataController.getHistoryView(session["username"])), mimetype='application/json')

@app.route("/getHistoryFavorite", methods=["GET"])
def getHistoryFavorite():
    if "type_account" not in session or session["type_account"] != "renter":
        time.sleep(10) 
        return
    dataController = DataController()
    return app.response_class(json.dumps(dataController.getHistoryFavorite(session["username"])), mimetype='application/json')

# unFavorite ở phía trên

@app.route("/deleteHistoryView/<int:idPost>", methods=["GET"])
def deleteHistoryView(idPost):
    if "type_account" not in session or session["type_account"] != "renter":
        time.sleep(10) 
        return
    dataController = DataController()
    return app.response_class(json.dumps(dataController.deleteHistoryView(session["username"], idPost)), mimetype='application/json')

@app.route("/deleteAllHistoryView", methods=["GET"])
def deleteAllHistoryView():
    if "type_account" not in session or session["type_account"] != "renter":
        time.sleep(10) 
        return
    dataController = DataController()
    return app.response_class(json.dumps(dataController.deleteAllHistoryView(session["username"])), mimetype='application/json')



# -----------------------------------------------------------------------------------
# ----------------------------API đăng bài-------------------------------------------
# -----------------------------------------------------------------------------------   
@app.route("/dang-bai", methods=["GET"])
def post():
    if "type_account" not in session or session["type_account"] == "renter":
        time.sleep(10) 
        return
    return render_template("post.html")

@app.route("/thong-tin-lien-he", methods=["GET"])
def infoAccount():
    if "type_account" not in session or session["type_account"] == "renter":
        time.sleep(10) 
        return
    dataController = DataController()
    return app.response_class(json.dumps(dataController.infoAccount(session["username"], session["type_account"])), mimetype='application/json')

@app.route("/createPost", methods=["POST"])
def createPost():
    if "type_account" not in session or session["type_account"] == "renter":
        time.sleep(10) 
        return
    dataController = DataController()
    dataController.createPost()
    return app.response_class(json.dumps({"message": "ok"}), mimetype='application/json')



# print(request.args.get("province"))


### Test trang kết quả
@app.route("/ket-qua", methods=["GET"])
def result():
    """Routing trang kết quả tìm kiếm
    
    Parameters
    ----------
    None
    """
    return render_template('post-manager-admin.html') 





# get: find
# post: create
# put: update
# delete: xóa






# các API request, response data






@app.route("/json", methods=["POST"])
def test():
    username = request.form["username"]
    password = request.form["password"]
    return app.response_class(json.dumps({"username": password, "password": username}), mimetype='application/json')













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
    # socketio.run(app)
    