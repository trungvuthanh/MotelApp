from flask import Flask, request, jsonify, render_template, session, redirect, url_for, escape
from models.user import User
from models.post import Post
from models.address import Address
from models.checkValidation import CheckValidation
from models.renter import Renter
from models.owner import Owner
from models.user import User
from models.post import Post
from models.otherEvent import OtherEvent
import time
import json


class DataController():
    """
    Class dùng điều khiển luồng dữ liệu

    ...

    Methods
    ----------
    loginController(): Kiểm tra dữ liệu đăng nhập
        
    """
    def editPost(self, idPost):
        titlePost = str(request.get_json()["titlePost"])
        contentPost = str(request.get_json()["contentPost"])
        addressProvince = str(request.get_json()["addressProvince"])
        addressDistrict = str(request.get_json()["addressDistrict"])
        addressWard = str(request.get_json()["addressWard"])
        addressDetail = str(request.get_json()["addressDetail"])
        if not Address.checkAddress(addressProvince, addressDistrict, addressWard):
            return 
        locationRelate = str(request.get_json()["locationRelate"])
        itemType = str(request.get_json()["itemType"])
        if itemType not in ["phongtro", "nhanguyencan", "chungcumini", "chungcunguyencan"]:
            return
        numOfRoom = int(request.get_json()["numOfRoom"])
        priceItem = float(request.get_json()["priceItem"])
        area = float(request.get_json()["area"])
        statusItem = float(request.get_json()["statusItem"])
        if statusItem not in ["chungchu", "khongchungchu"]:
            return
        bathroom = str(request.get_json()["bathroom"])
        temp = bathroom.split(" ")
        if len(temp) != 2 or temp[0] not in ["khepkin", "khongkhepkin"] or temp[1] not in ["nonglanh", "khongnonglanh"]:
            time.sleep(10)
            return
        kitchen = str(request.get_json()["kitchen"])
        if kitchen not in ["khubepchung", "khubeprieng", "khongnauan"]:
            time.sleep(10)
            return
        aircondition = int(request.get_json()["aircondition"])
        if aircondition != 0 and aircondition != 1:
            time.sleep(10)
            return
        balcony = int(request.get_json()["balcony"])
        if balcony != 0 and balcony != 1:
            time.sleep(10)
            return
        priceElectric = str(request.get_json()["priceElectric"])
        priceWater = str(request.get_json()["priceWater"])
        otherUtility = str(request.get_json()["otherUtility"])
        postDuration = int(request.get_json()["postDuration"])
        listImages = request.get_json()["listImages"]
        Post().editPost(idPost, titlePost, contentPost, addressProvince, addressDistrict, addressWard, addressDetail, locationRelate, itemType, numOfRoom, priceItem, area, statusItem, bathroom, kitchen, aircondition, balcony, priceElectric, priceWater, otherUtility, postDuration, session["username"])
    
    def managePost(self, username, typeAccount):
        statusPost = str(request.get_json()["statusPost"])
        sortDate = str(request.get_json()["sortDate"])
        access = str(request.get_json()["access"])
        if statusPost not in ["handling", "expired", "active", "extend", "block", "postOfAdmin"] or sortDate not in ["createDateASC", "createDateDESC", "acceptDateASC", "acceptDateDESC", "expireDateASC", "expireDateDESC", "acceptDateASC", "acceptDateDESC"] or access not in ["viewASC", "viewDESC", "favoriteASC", "favoriteDESC", "ratingASC", "ratingDESC"]:
            return
        if typeAccount == "owner":        
            return Post().getAllPost(typeAccount, username, statusPost, sortDate, access)
        elif typeAccount == "admin":
            province = str(request.get_json()["province"])
            district = str(request.get_json()["district"]) # ""
            ward = str(request.get_json()["ward"]) # ""
            print(typeAccount, username, statusPost, sortDate, access, province, district, ward)
            return Post().getAllPost(typeAccount, username, statusPost, sortDate, access, province, district, ward)
    
    def createPost(self):
        titlePost = str(request.get_json()["titlePost"])
        contentPost = str(request.get_json()["contentPost"])
        addressProvince = str(request.get_json()["addressProvince"])
        addressDistrict = str(request.get_json()["addressDistrict"])
        addressWard = str(request.get_json()["addressWard"])
        addressDetail = str(request.get_json()["addressDetail"])
        if not Address.checkAddress(addressProvince, addressDistrict, addressWard):
            time.sleep(10)
            return 
        locationRelate = str(request.get_json()["locationRelate"])
        itemType = str(request.get_json()["itemType"])
        if itemType not in ["phongtro", "nhanguyencan", "chungcumini", "chungcunguyencan"]:
            time.sleep(10)
            return 
        numOfRoom = int(request.get_json()["numOfRoom"])
        priceItem = float(request.get_json()["priceItem"])
        area = float(request.get_json()["area"])
        statusItem = str(request.get_json()["statusItem"])
        if statusItem not in ["chungchu", "khongchungchu"]:
            time.sleep(10)
            return
        bathroom = str(request.get_json()["bathroom"])
        temp = bathroom.split(" ")
        if len(temp) != 2 or temp[0] not in ["khepkin", "khongkhepkin"] or temp[1] not in ["nonglanh", "khongnonglanh"]:
            time.sleep(10)
            return
        kitchen = str(request.get_json()["kitchen"])
        if kitchen not in ["khubepchung", "khubeprieng", "khongnauan"]:
            time.sleep(10)
            return
        aircondition = int(request.get_json()["aircondition"])
        if aircondition != 0 and aircondition != 1:
            time.sleep(10)
            return
        balcony = int(request.get_json()["balcony"])
        if balcony != 0 and balcony != 1:
            time.sleep(10)
            return
        priceElectric = str(request.get_json()["priceElectric"])
        priceWater = str(request.get_json()["priceWater"])
        otherUtility = str(request.get_json()["otherUtility"])
        postDuration = int(request.get_json()["postDuration"])
        listImages = request.get_json()["listImages"]
        Post().create(titlePost, contentPost, addressProvince, addressDistrict, addressWard, addressDetail, locationRelate, itemType, numOfRoom, priceItem, area, statusItem, bathroom, kitchen, aircondition, balcony, priceElectric, priceWater, otherUtility, session["username"], session["type_account"], postDuration, listImages)
    
    def infoAccount(self, username, typeAccount):
        return User().infoAccount(username, typeAccount)
    
    def deleteAllHistoryView(self, usernameRenter):
        OtherEvent().deleteAllHistoryPost(usernameRenter)
        return {"message": "ok"}
    
    def deleteHistoryView(self, usernameRenter, idPost):
        OtherEvent().deleteHistoryPost(usernameRenter, idPost)
        return {"message": "ok"}
    
    def getHistoryFavorite(self, usernameRenter):
        return OtherEvent().getFavoritePost(usernameRenter)
    
    def getHistoryView(self, usernameRenter):
        return OtherEvent().getHistoryPost(usernameRenter)
    
    def renterSendReport(self, idPost, fakeInfo, fakePrice):
        try:
            content = request.form["content"]
        except:
            try:
                content = request.get_json()["content"]
            except:
                content = ""            
        if (fakeInfo != 1 and fakeInfo != 0) or (fakePrice != 1 and fakePrice != 0) or ('type_account' not in session or session['type_account'] != "renter"):
            time.sleep(10)
            return "fail"
        OtherEvent().renterSendReport(idPost, session["username"], fakeInfo, fakePrice, content)
        return "success"
    
    def detailPost(self, idPost, titlePost):
        if Post().checkPost(idPost, titlePost):
            return Post().getAllInfomationPost(idPost)
        return
    
    def detailPostID(self, idPost):
        return Post().getAllInfomationPost(idPost)
    
    def normalizeInputDataSearchPost(self, loaibaiviet, minPrice, maxPrice):
        Post().updateExpiredPost()
        try:
            pageNumber = request.form["pageNumber"]
            statusItem = request.form["statusItem"]
            sort = request.form["sort"]
        except:
            try:
                pageNumber = request.get_json()["pageNumber"]
                statusItem = request.get_json()["statusItem"]
                sort = request.get_json()["sort"]
            except:
                pageNumber = None
                statusItem = None
                sort = None                
        itemType = {"bai-dang": "", "phong-tro": "phongtro", "nha-nguyen-can": "nhanguyencan", "chung-cu-mini": "chungcumini", "chung-cu-nguyen-can": "chungcunguyencan"}[loaibaiviet]
        minPrice = float(minPrice)
        maxPrice = float(maxPrice)
        pageNumber = 1 if pageNumber is None else int(pageNumber)
        if pageNumber <= 0:
            time.sleep(10)
            return
        statusItem = 0 if statusItem is None else {1: "chungchu", 2:"khongchungchu"}[int(statusItem)]
        sort = "" if sort is None else sort
        usernameRenter = "" if 'type_account' not in session else session['username']
        return {"pageNumber": pageNumber, "statusItem": statusItem, "sort": sort, "itemType": itemType, "minPrice": minPrice, "maxPrice": maxPrice, "usernameRenter": usernameRenter}    
        
    
    def getPostButNoRecommend(self, loaibaiviet, stringSeachNoRecommend, minPrice, maxPrice, minArea):
        data = self.normalizeInputDataSearchPost(loaibaiviet, minPrice, maxPrice)
        return [Post().search(stringSeachNoRecommend, data["itemType"], data["minPrice"], data["maxPrice"], minArea, data["sort"], data["statusItem"], 0, data["usernameRenter"], data["pageNumber"]), {"stringSearch": stringSeachNoRecommend}]
    
    def getPostFromProvince(self, loaibaiviet, tinh, minPrice, maxPrice, minArea):
        data = self.normalizeInputDataSearchPost(loaibaiviet, minPrice, maxPrice)
        tinh = Address.normalizeProvince(tinh)
        if tinh is None:
            return
        return [Post().search(tinh, data["itemType"], data["minPrice"], data["maxPrice"], minArea, data["sort"], data["statusItem"], 1, data["usernameRenter"], data["pageNumber"]), {"stringSearch": tinh}]
    
    def getPostFromDistrict(self, loaibaiviet, tinh, huyen, minPrice, maxPrice, minArea):
        data = self.normalizeInputDataSearchPost(loaibaiviet, minPrice, maxPrice)
        tinh = Address.normalizeProvince(tinh)
        if tinh is None:
            return
        huyen = Address.normalizeDistrict(tinh, huyen)
        if huyen is None:
            return
        return [Post().search(huyen + ", " + tinh, data["itemType"], data["minPrice"], data["maxPrice"], minArea, data["sort"], data["statusItem"], 1, data["usernameRenter"], data["pageNumber"]), {"stringSearch": huyen + ", " + tinh}]
    
    def loginController(self):
        """
        Kiểm tra dữ liệu đăng nhập
        
        Parameters
        ----------
        None
        """
        # Bước 1: lấy dữ liệu từ form
        flagError = False
        try: 
            try:
                # support: application/x-www-form-urlencoded hoặc multipart/form-data
                username = request.form["username"]
                password = request.form["password"]
            except:
                # support: application/json
                username = request.get_json()["username"]
                password = request.get_json()["password"]
        except:
            flagError = True
        
        # Bước 2: Kiểm tra tính đầy đủ dữ liệu
        if flagError or username is None or password is None:
            # đang có lỗi, dấu hiệu của tấn công, dừng 10s
            time.sleep(10)
            return "ERR"
        
        # Bước 3: Chuẩn hóa dữ liệu
        username = str(username)
        password = str(password) 
        
        # Bước 4: Kết nối với model
        user = User(username, password)
        messageLogin = user.checkLogin()
        if messageLogin == "active" or messageLogin == "handling":
            # lưu 1 số thông tin vào session
            session['username'] = username
            session['password'] = password
            session['type_account'] = user.type_account
            session['type_avatar'] = user.type_avatar
            session['fullname'] = user.fullname
            session['status'] = messageLogin
        return messageLogin
        
    def checkUsernameController(self):
        """
        Kiểm tra username đã tồn tại hay chưa
        
        Parameters
        ----------
        None
        """
        # Bước 1: lấy dữ liệu từ form
        flagError = False
        try: 
            try:
                # support: application/x-www-form-urlencoded hoặc multipart/form-data
                username = request.form["username"]
            except:
                # support: application/json
                username = request.get_json()["username"]
        except:
            flagError = True
        
        # Bước 2: Kiểm tra tính đầy đủ dữ liệu
        if flagError or username is None:
            # đang có lỗi, dấu hiệu của tấn công, dừng 10s
            time.sleep(10)
            return "miss"
        
        # Bước 3: Chuẩn hóa dữ liệu
        username = str(username)
        
        # Bước 4: Kết nối với model
        user = User()
        messageCheck = user.checkUsername(username)
        return messageCheck   
    
    def signupController(self):
        """
        Kiểm tra đăng ký tài khoản
        
        Parameters
        ----------
        None
        """
        # Bước 1: lấy dữ liệu từ form
        flagError = False
        try: 
            try:
                # support: application/x-www-form-urlencoded hoặc multipart/form-data
                username = request.form["username"]
                password = request.form["password"]
                repassword = request.form["repassword"]
                fullname = request.form["fullname"]
                phoneNumber = request.form["phoneNumber"]
                email = request.form["email"]
                birthday = request.form["birthday"]
                ID = request.form["ID"]
                imageID = request.form["imageID"]
                addressProvince = request.form["addressProvince"]
                addressDistrict = request.form["addressDistrict"]
                addressWard = request.form["addressWard"]
                addressDetail = request.form["addressDetail"]                
                typeAvt = request.form["typeAvt"]                
                typeAccount = request.form["typeAccount"]                
            except:
                # support: application/json
                username = request.get_json()["username"]
                password = request.get_json()["password"]
                repassword = request.get_json()["repassword"]
                fullname = request.get_json()["fullname"]
                phoneNumber = request.get_json()["phoneNumber"]
                email = request.get_json()["email"]
                birthday = request.get_json()["birthday"]
                ID = request.get_json()["ID"]
                imageID = request.get_json()["imageID"]
                addressProvince = request.get_json()["addressProvince"]
                addressDistrict = request.get_json()["addressDistrict"]
                addressWard = request.get_json()["addressWard"]
                addressDetail = request.get_json()["addressDetail"]                
                typeAvt = request.get_json()["typeAvt"]                
                typeAccount = request.get_json()["typeAccount"] 
        except:
            flagError = True
        
        # Bước 2: Kiểm tra tính đầy đủ dữ liệu
        if flagError or typeAccount is None: # Lỗi phát sinh
            time.sleep(10)
            return "miss"
        typeAccount = str(typeAccount)
        if typeAccount == "owner":
            # nếu đăng ký owner, các trường phải đầy đủ
            if len([x for x in [username, password, repassword, fullname, phoneNumber, email, birthday, ID, imageID, addressProvince, addressDistrict, addressWard, addressDetail, typeAvt] if x is None or str(x) == ""]) > 0:
                time.sleep(10)
                return "miss"
        elif typeAccount == "renter":
            # trừ trường ID, imageID có thể bỏ qua, còn lại bắt buộc phải có
            if len([x for x in [username, password, repassword, fullname, phoneNumber, email, birthday, addressProvince, addressDistrict, addressWard, addressDetail, typeAvt] if x is None or str(x) == ""]) > 0:
                time.sleep(10)
                return "miss"
        else:
            # loại tài khoản bất thường
            time.sleep(10)
            return "miss"
        
        if password != repassword:
            # đang có lỗi, dấu hiệu của tấn công, dừng 10s
            time.sleep(10)
            return "miss"
        
        # Bước 3: Chuẩn hóa và kiểm tra tính đúng đắn của dữ liệu
        username = str(username)
        password = str(password)
        fullname = str(fullname)
        phoneNumber = str(phoneNumber)
        email = str(email)
        birthday = str(birthday)
        if ID == None:
            ID = ""
        if imageID == None:
            imageID = ""
        ID = str(ID)
        imageID = str(imageID)
        addressProvince = str(addressProvince)
        addressDistrict = str(addressDistrict)
        addressWard = str(addressWard)
        if not Address.checkAddress(addressProvince, addressDistrict, addressWard):
            return "fail"
        addressDetail = str(addressDetail)
        typeAvt = int(typeAvt)
        
        # kiểm tra validation: fullname, phoneNumber, birthday, addressProvince, addressDistrict, addressWard
        if not CheckValidation.isFullname(fullname) or not CheckValidation.isPhoneNumber(phoneNumber) or not CheckValidation.isEmail(email) or not Address.checkAddress(addressProvince, addressDistrict, addressWard) or typeAvt < 0:
            time.sleep(10)
            return "fail"
        
        # Bước 4: Kết nối với model
        user = User()
        if user.checkUsername(username) == "exist":
            time.sleep(10)
            return "fail"
        try:
            if typeAccount == "renter":
                Renter().signup(username, password, fullname, phoneNumber, email, birthday, addressProvince, addressDistrict, addressWard, addressDetail, typeAvt)
            else:
                Owner().signup(username, password, fullname, phoneNumber, email, birthday, ID, imageID, addressProvince, addressDistrict, addressWard, addressDetail, typeAvt)
            session['username'] = username
            session['password'] = password
            session['type_account'] = typeAccount
            session['type_avatar'] = typeAvt
            session['fullname'] = fullname
            session['status'] = "active" if typeAccount == "renter" else "handling"
            return "success"
        except:
            return "error"
            