from flask import Flask, request, jsonify, render_template, session, redirect, url_for, escape
from models.user import User
from models.post import Post
from models.address import Address
from models.checkValidation import CheckValidation
from models.renter import Renter
from models.owner import Owner
import time


class DataController():
    """
    Class dùng điều khiển luồng dữ liệu

    ...

    Methods
    ----------
    loginController(): Kiểm tra dữ liệu đăng nhập
        
    """
    
    def detailPost(self, idPost, titlePost):
        if Post().checkPost(idPost, titlePost):
            return Post().getAllInfomationPost(idPost)
        return
    
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
        return Post().search(stringSeachNoRecommend, data["itemType"], data["minPrice"], data["maxPrice"], minArea, data["sort"], data["statusItem"], 0, data["usernameRenter"], data["pageNumber"]) 
    
    def getPostFromProvince(self, loaibaiviet, tinh, minPrice, maxPrice, minArea):
        data = self.normalizeInputDataSearchPost(loaibaiviet, minPrice, maxPrice)
        tinh = Address.normalizeProvince(tinh)
        if tinh is None:
            return
        return Post().search(tinh, data["itemType"], data["minPrice"], data["maxPrice"], minArea, data["sort"], data["statusItem"], 1, data["usernameRenter"], data["pageNumber"]) 
    
    def getPostFromDistrict(self, loaibaiviet, tinh, huyen, minPrice, maxPrice, minArea):
        data = self.normalizeInputDataSearchPost(loaibaiviet, minPrice, maxPrice)
        tinh = Address.normalizeProvince(tinh)
        if tinh is None:
            return
        huyen = Address.normalizeDistrict(tinh, huyen)
        if huyen is None:
            return
        return Post().search(huyen + ", " + tinh, data["itemType"], data["minPrice"], data["maxPrice"], minArea, data["sort"], data["statusItem"], 1, data["usernameRenter"], data["pageNumber"]) 
    
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
        if messageLogin == "ACTIVE":
            # lưu 1 số thông tin vào session
            session['username'] = username
            session['password'] = password
            session['type_account'] = user.type_account
            session['type_avatar'] = user.type_avatar
            session['fullname'] = user.fullname
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
                ID = request.form["ID"]
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
            return "success"
        except:
            return "error"
            