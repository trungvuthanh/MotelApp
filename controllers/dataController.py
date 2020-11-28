from flask import Flask, request, jsonify, render_template, session, redirect, url_for, escape
from models.user import User

class DataController():
    """
    Class dùng điều khiển luồng dữ liệu

    ...

    Methods
    ----------
    loginController(): Kiểm tra dữ liệu đăng nhập
        
    """
    
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
        
       