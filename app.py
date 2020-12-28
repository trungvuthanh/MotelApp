from flask import Flask, request, jsonify, render_template, session, redirect, url_for, escape
from flask_socketio import SocketIO, send, emit, join_room, leave_room
import os
import json
from controllers.urlController import UrlController
from controllers.dataController import DataController
from models.post import Post
from models.renter import Renter
from models.owner import Owner
from models.admin import Admin
from models.chat import Chat
from models.address import Address
from models.otherEvent import OtherEvent
from models.notification import Notification
from models.checkValidation import CheckValidation
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

@app.route("/managePost", methods=["POST"])
def managePost():
    if "type_account" not in session or session["type_account"] == "renter":
        time.sleep(10)
        return
    dataController = DataController()
    return app.response_class(json.dumps(dataController.managePost(session["username"], session["type_account"])), mimetype='application/json')

@app.route("/getMoreInfo/<int:idPost>", methods=["POST"])
def getMoreInfo(idPost):
    if "type_account" not in session or session["type_account"] == "renter":
        time.sleep(10)
        return
    return app.response_class(json.dumps(Post().getMoreInformationPost(idPost)), mimetype='application/json')

@app.route("/gia-han-bai-dang/<int:idPost>/<int:postDuration>", methods=["GET"])
def extendPost(idPost, postDuration):
    if "type_account" not in session or session["type_account"] == "renter":
        time.sleep(10)
        return
    Post().extendPost(idPost, postDuration, session["type_account"], session["username"])
    return app.response_class(json.dumps({"message": "ok"}), mimetype='application/json')

@app.route("/active/<int:idPost>/<int:postDuration>", methods=["GET"])
def activePost(idPost, postDuration):
    if "type_account" not in session or session["type_account"] != "admin":
        time.sleep(10)
        return
    Post().adminActiveRequestPost(idPost, Post().getUsernameAuthorPost(idPost), postDuration)
    return app.response_class(json.dumps({"message": "ok"}), mimetype='application/json')

@app.route("/deny/<int:idPost>", methods=["GET"])
def denyPost(idPost):
    if "type_account" not in session or session["type_account"] != "admin":
        time.sleep(10)
        return
    Post().adminDenyRequestPost(idPost, Post().getUsernameAuthorPost(idPost))
    return app.response_class(json.dumps({"message": "ok"}), mimetype='application/json')

@app.route("/blockPost/<int:idPost>", methods=["GET"])
def blockPost(idPost):
    if "type_account" not in session or session["type_account"] != "admin":
        time.sleep(10)
        return
    Post().blockPost(idPost)
    return app.response_class(json.dumps({"message": "ok"}), mimetype='application/json')

@app.route("/unblockPost/<int:idPost>", methods=["GET"])
def unblockPost(idPost):
    if "type_account" not in session or session["type_account"] != "admin":
        time.sleep(10)
        return
    Post().unblockPost(idPost)
    return app.response_class(json.dumps({"message": "ok"}), mimetype='application/json')

@app.route("/notification", methods=["GET"])
def notification():
    if "type_account" not in session or session["type_account"] == "renter":
        time.sleep(10)
        return
    return app.response_class(json.dumps(Notification().getAllNotifications(session["username"])), mimetype='application/json')

@app.route("/readnotification/<int:idNotification>", methods=["GET"])
def readNotification(idNotification):
    if "type_account" not in session or session["type_account"] == "renter":
        time.sleep(10)
        return
    Notification().readNotification(idNotification, session["username"])
    return app.response_class(json.dumps({"message": "ok"}), mimetype='application/json')

@app.route("/unreadnotification/<int:idNotification>", methods=["GET"])
def unreadNotification(idNotification):
    if "type_account" not in session or session["type_account"] == "renter":
        time.sleep(10)
        return
    Notification().unreadNotification(idNotification, session["username"])
    return app.response_class(json.dumps({"message": "ok"}), mimetype='application/json')

@app.route("/readallnotification", methods=["GET"])
def readAllNotification():
    if "type_account" not in session or session["type_account"] == "renter":
        time.sleep(10)
        return
    Notification().readAllNotifications(session["username"])
    return app.response_class(json.dumps({"message": "ok"}), mimetype='application/json')

@app.route("/updateStatusHired/<int:idPost>/<statusHired>", methods=["GET"])
def updateStatusHired(idPost, statusHired):
    if "type_account" not in session or session["type_account"] == "renter" or statusHired not in ["ready", "hired"]:
        time.sleep(10)
        return
    Post().updateStatusHired(idPost, session["username"], statusHired)
    return app.response_class(json.dumps({"message": "ok"}), mimetype='application/json')


# -----------------------------------------------------------------------------------
# ----------------------------API chỉnh sửa thông tin--------------------------------
# -----------------------------------------------------------------------------------
@app.route("/chinh-sua-bai-dang/<int:idPost>", methods=["GET"])
def getPageEditPost(idPost):
    if "type_account" not in session or session["type_account"] == "renter":
        time.sleep(10)
        return
    if Post().checkEditPost(idPost, session["username"]):
        return render_template("editPost.html")

@app.route("/editPost/<int:idPost>", methods=["POST"])
def editPost(idPost):
    if "type_account" not in session or session["type_account"] == "renter" or not Post().checkEditPost(idPost, session["username"]):
        time.sleep(10)
        return
    DataController().editPost(idPost)
    return app.response_class(json.dumps({"message": "ok"}), mimetype='application/json')

@app.route("/chinh-sua-thong-tin", methods=["GET"])
def editInfoAccount():
    if session["type_account"] == "renter":
        return render_template("edit-infoB.html")
    elif session["type_account"] == "owner":
        if Admin().checkOwnerEditAccount(session["username"]):
            return render_template("edit-detail-infoA.html")
    
@app.route("/doi-mat-khau-va-avatar", methods=["GET"])
def changePasswordAndAvatar():
    if session["type_account"] == "renter":
        return render_template("edit-infoB.html")
    elif session["type_account"] == "owner":
        return render_template("edit-infoA.html")
    
@app.route("/checkEnableEditAccountOwner", methods=["GET"])
def checkEnableEditAccountOwner():
    if session["type_account"] == "owner":
        return app.response_class(json.dumps({"message": Admin().checkOwnerEditAccount(session["username"])}), mimetype='application/json')

@app.route("/getInfoDefaultB", methods=["GET"]) # sử dụng để set default value khi chỉnh sửa trang tài khoản bên B
def getInfoDefaultB():
    if session["type_account"] != "renter":
        return
    return app.response_class(json.dumps(Renter().getInformation(session["username"])), mimetype='application/json')

# getDefault avt đã có, tự tìm

@app.route("/getInfoDefaultA", methods=["GET"])
def getInfoDefaultA():
    if session["type_account"] != "owner":
        return
    return app.response_class(json.dumps(Owner().getInformation(session["username"])), mimetype='application/json')

@app.route("/luuChinhSuaThongTinB", methods=["POST"])
def luuChinhSuaThongTinB():
    if session["type_account"] != "renter":
        return
    password = str(request.get_json()["password"])
    repassword = str(request.get_json()["repassword"])
    fullname = str(request.get_json()["fullname"])
    phoneNumber = str(request.get_json()["phoneNumber"])
    email = str(request.get_json()["email"])
    birthday = str(request.get_json()["birthday"])
    addressProvince = str(request.get_json()["addressProvince"])
    addressDistrict = str(request.get_json()["addressDistrict"])
    addressWard = str(request.get_json()["addressWard"])
    addressDetail = str(request.get_json()["addressDetail"])
    typeAvt = int(request.get_json()["typeAvt"])
    typeAccount = session["type_account"]
    if password != repassword or not Address.checkAddress(addressProvince, addressDistrict, addressWard) or not CheckValidation.isFullname(fullname) or not CheckValidation.isPhoneNumber(phoneNumber) or not CheckValidation.isEmail(email):
        return
    Renter().editAccount(session["username"], password, phoneNumber, email, birthday, addressProvince, addressDistrict, addressWard, addressDetail, typeAvt)
    return app.response_class(json.dumps({"message": "ok"}), mimetype='application/json')

app.route("/luuChinhSuaMatKhauVaAvatarA", methods=["POST"])
def luuChinhSuaMatKhauVaAvatarA():
    if session["type_account"] != "owner":
        return
    password = str(request.get_json()["password"])
    repassword = str(request.get_json()["repassword"])
    typeAvt = int(request.get_json()["typeAvt"])
    typeAccount = session["type_account"]
    if password != repassword:
        return
    Owner().changePasswordAndAvatar(session["username"], password, typeAvt)
    return app.response_class(json.dumps({"message": "ok"}), mimetype='application/json')

@app.route("/luuChinhSuaThongTinA", methods=["POST"])
def luuChinhSuaThongTinA():
    if session["type_account"] != "renter":
        return
    fullname = str(request.get_json()["fullname"])
    phoneNumber = str(request.get_json()["phoneNumber"])
    email = str(request.get_json()["email"])
    birthday = str(request.get_json()["birthday"])
    addressProvince = str(request.get_json()["addressProvince"])
    addressDistrict = str(request.get_json()["addressDistrict"])
    addressWard = str(request.get_json()["addressWard"])
    addressDetail = str(request.get_json()["addressDetail"])
    typeAvt = int(request.get_json()["typeAvt"])
    typeAccount = session["type_account"]
    if not Address.checkAddress(addressProvince, addressDistrict, addressWard) or not CheckValidation.isFullname(fullname) or not CheckValidation.isPhoneNumber(phoneNumber) or not CheckValidation.isEmail(email):
        return
    Owner().editAccount(session["username"], phoneNumber, email, birthday, addressProvince, addressDistrict, addressWard, addressDetail, fullname)
    return app.response_class(json.dumps({"message": "ok"}), mimetype='application/json')

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
    return app.response_class(json.dumps(dataController.getPostButNoRecommend(loaibaiviet, stringSeachNoRecommend, minPrice, maxPrice, minArea)), mimetype='application/json')   


@app.route("/<loaibaiviet>/dia-chi/<tinh>/1/gia/<minPrice>/<maxPrice>/dien-tich-tu/<int:minArea>", methods=["POST"])
def getPostFromProvince(loaibaiviet, tinh, minPrice, maxPrice, minArea):
    dataController = DataController()
    return app.response_class(json.dumps(dataController.getPostFromProvince(loaibaiviet, tinh, minPrice, maxPrice, minArea)), mimetype='application/json')

@app.route("/<loaibaiviet>/dia-chi/<tinh>/<huyen>/gia/<minPrice>/<maxPrice>/dien-tich-tu/<int:minArea>", methods=["POST"])
def getPostFromDistrict(loaibaiviet, tinh, huyen, minPrice, maxPrice, minArea):
    dataController = DataController()
    return app.response_class(json.dumps(dataController.getPostFromDistrict(loaibaiviet, tinh, huyen, minPrice, maxPrice, minArea)), mimetype='application/json')



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

@app.route("/thong-tin-bai-dang/<baidangidpost>", methods=["GET"])
def getInformationPost(baidangidpost):
    # baidangidpost: "nha-chung-cu-nguyen-can-gia-re-1"
    # partern: tieu-de-bai-dang-idPost
    titlePost = " ".join(baidangidpost.split("-")[:-1])
    idPost = int(baidangidpost.split("-")[-1])
    return DataController().detailPost(idPost, titlePost)

@app.route("/thong-tin-bai-dang/<int:idPost>", methods=["GET"])
def getInformationPostID(idPost):
    return DataController().detailPostID(idPost)

# -----------------------------------------------------------------------------------
# ----------------------------API review, report----------------------------------
# -----------------------------------------------------------------------------------
@app.route("/sendreport/<int:idPost>/<int:fakeInfo>/<int:fakePrice>", methods=["POST"])
def sendReport(idPost, fakeInfo, fakePrice):
    # body có biến content (default: "")
    dataController = DataController()
    return app.response_class(json.dumps({"message": DataController().renterSendReport(idPost, fakeInfo, fakePrice)}), mimetype='application/json')

@app.route("/guestOrRenterGetReView/<int:idPost>", methods=["GET"]) # trang detail-post
def getReport(idPost):
    return app.response_class(json.dumps(OtherEvent().renterOrGuestGetReview(idPost)), mimetype='application/json')

@app.route("/review-report", methods=["GET"])
def routeReviewReport():
    if session["type_account"] == "admin":
        return render_template("review-report.html")
    
@app.route("/adminGetReviews/<status>", methods=["GET"])
def adminGetReviews(status):
    if session["type_account"] == "admin":
        return app.response_class(json.dumps(OtherEvent().adminGetReview(status)), mimetype='application/json')

@app.route("/updateReview/<status>/<int:id>/<int:star>/<content>", methods=["GET"])
def updateReview(status, id, star, content):
    if status not in ["accept", "deny", "handling"]:
        return
    if session["type_account"] == "admin":
        OtherEvent().updateReview(id, status, star, content)
        return app.response_class(json.dumps({"message": "ok"}), mimetype='application/json')

@app.route("/adminGetReports/<status>", methods=["GET"])
def adminGetReports(status):
    if session["type_account"] == "admin":
        return app.response_class(json.dumps(OtherEvent().adminGetAllReport(status)), mimetype='application/json')
    
@app.route("/updateReport/<status>/<int:id>", methods=["GET"])
def updateReport(status, id):
    if status not in ["accept", "deny", "handling"]:
        return
    if session["type_account"] == "admin":
        OtherEvent().changeStatusReport(id, status)
        if status == "accept":
            idPost = OtherEvent().getIdPostFromReport(id)
            Post().blockPost(idPost)    
        return app.response_class(json.dumps({"message": "ok"}), mimetype='application/json')

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


# -----------------------------------------------------------------------------------
# ----------------------------API thống kê-------------------------------------------
# ----------------------------------------------------------------------------------- 
@app.route("/thong-ke", methods=["GET"])
def statistical():
    if "type_account" not in session or session["type_account"] == "renter":
        time.sleep(10) 
        return
    if session["type_account"] == "admin":
        return render_template("statistic-admin.html")
    else:
        return render_template("statistic-owner.html")

@app.route("/adminGetTop3Post", methods=["GET"])
def adminGetTop3Post():
    if session["type_account"] == "admin":
        return app.response_class(json.dumps(OtherEvent().adminGetTop3Post()), mimetype='application/json')

@app.route("/adminThongKeCoCauTrangThaiBaiDang", methods=["GET"]) 
def thongKeCoCauTrangThaiBaiDang():
    return app.response_class(json.dumps(OtherEvent().statisticalPost(session["username"])), mimetype='application/json')

@app.route("/adminThongKeTuKhoaVaThongKeViewNhanh", methods=["GET"]) 
def adminThongKeTuKhoaVaThongKeViewNhanh():
    if session["type_account"] == "admin":
        return app.response_class(json.dumps(OtherEvent().statisticalDateHighestView()), mimetype='application/json')

@app.route("/adminThongKeView/<groupTime>/<arg1>/<arg2>", methods=["GET"]) 
def adminThongKeView(groupTime, arg1, arg2):
    # groupTime = "inDay"    => arg1 = yyyy-mm-dd, arg2 = cái gì cũng được
    # groupTime = "inMonth"  => arg1 = yyyy, arg2 = mm
    # groupTime = "inWeek"   => arg1, arg2 = cái gì cũng được
    # groupTime = "dayToDay" => arg1 = yyyy-mm-dd(start), arg2 = yyyy-mm-dd(end)
    if session["type_account"] == "admin":
        return app.response_class(json.dumps(OtherEvent().statisticalView(username = "admin", groupTime = groupTime, arg1 = arg1, arg2 = arg2)), mimetype='application/json')

@app.route("/ownerThongKeViewInWeek", methods=["GET"]) 
def ownerThongKeView():
    if session["type_account"] == "owner":
        return app.response_class(json.dumps(OtherEvent().statisticalView(session["username"])), mimetype='application/json')

@app.route("/ownerThongKeNhanhView", methods=["GET"]) 
def ownerThongKeNhanhView():
    if session["type_account"] == "owner":
        return app.response_class(json.dumps(OtherEvent().statisticalDateHighestView(session["username"])), mimetype='application/json')

@app.route("/ownerThongKeCoCauPost", methods=["GET"])  
def ownerThongKeCoCauPost():
    if session["type_account"] == "owner":
        return app.response_class(json.dumps(OtherEvent().statisticalOwner(session["username"])), mimetype='application/json')


# -----------------------------------------------------------------------------------
# ----------------------------API quản lý tài khoản----------------------------------
# -----------------------------------------------------------------------------------
@app.route("/quan-ly-tai-khoan", methods=["GET"])
def managerAccount():
    if "type_account" not in session:
        return redirect("/")
    if session["type_account"] == "admin":
        return render_template("account-manager.html")

@app.route("/getAccount/<typeAccount>/<status>/<int:numPage>", methods=["GET"])
def getAccount(typeAccount, status, numPage):
    if session["type_account"] == "admin":
        if typeAccount not in ["owner", "renter"] or status not in ["handling", "edit", "active", "block"]:
            return
        if typeAccount == "renter":
            (result, hasPrev, hasNext) = Admin().getAllAccountRenter(status, numPage)
        elif typeAccount == "owner":
            if status == "edit":
                (result, hasPrev, hasNext) = Admin().getAllRequestEditInfoOwner(numPage)
            else:
                (result, hasPrev, hasNext) = Admin().getAllAccountOwner(status, numPage)
        return app.response_class(json.dumps({"typeAccount": typeAccount, "status": status, "result": result, "hasPrev": hasPrev, "hasNext": hasNext}), mimetype='application/json')

@app.route("/lockAccount/<type>/<username>", methods=["GET"])
def blockAccount(type, username):
    if session["type_account"] != "admin" or type not in ["block", "active", "deny"]:
        return
    Admin().lockAccount(username, type, "owner")
    Admin().lockAccount(username, type, "renter")
    return app.response_class(json.dumps({"message": "ok"}), mimetype='application/json')

@app.route("/chinhsua/<type>/<username>", methods=["GET"])
def editAccount(type, username):
    if session["type_account"] != "admin" or type not in ["enable", "unenable", "accept", "deny"]:
        return
    if type == "enable": 
        Admin().setEnableEditAccountOwner(username)
    elif type == "unenable":
        Admin().setUnEnableEditAccountOwner(username)
    else:
        Admin().handlingEditAccount(username, type) # accept/deny
    return app.response_class(json.dumps({"message": "ok"}), mimetype='application/json')
     
@app.route("/checkEdit/<username>", methods=["GET"])
def checkEdit(username):
    if session["type_account"] != "admin":
        return
    return app.response_class(json.dumps({"message": Admin().checkOwnerEditAccount(username)}), mimetype='application/json')

@app.route("/search/<typeAccount>/<stringSearch>", methods=["GET"])
def searchAccount(typeAccount, stringSearch):
    if session["type_account"] != "admin" or typeAccount not in ["owner", "renter"]:
        return
    stringSearch = stringSearch.title()
    if typeAccount == "owner":
        return app.response_class(json.dumps(Admin().searchAccountOwner(stringSearch)), mimetype='application/json')
    else:
        return app.response_class(json.dumps(Admin().searchAccountRenter(stringSearch)), mimetype='application/json')

@app.route("/getMessages", methods=["GET"])
def getMessages():
    if "type_account" not in session or session["type_account"] == "renter":
        return
    if session["type_account"] == "owner":
        return Chat().getMessages("admin", session["username"], numberPage=1)
    
@socketio.on("connect")
def connect():
    print("client wants to connect")
    emit("consoleLog", { "data": "Connect success!" })

@socketio.on("join")
def on_join(data):
    if session["type_account"] == "owner":
        room = session["username"]
        join_room(room)
    elif session["type_account"] == "admin":
        room = session["usernameOwnerChating"]
        join_room(room)

@socketio.on('leave')
def on_leave(data):
    username = data['username']
    room = data['room']
    leave_room(room)
    send(username + ' has left the room.', room=room)
     
@socketio.on("sendMessage")
def sendMessage(data):
    # data: {"message": "xxxx"}
    # room lưu ở session
    if session["type_account"] == "owner":
        room = session["username"]
        Chat().sendMessage(data["message"], session["username"], True)
        emit("roomMessage", ["me", data["message"]], room=room)
    elif session["type_account"] == "admin":
        room = session["usernameOwnerChating"]
        Chat().sendMessage(data["message"], session["username"], True)
        emit("roomMessage", ["you", data["message"]], room=room)
        

    
    


if __name__ == "__main__":
    app.run(debug=True)
    # socketio.run(app)
    