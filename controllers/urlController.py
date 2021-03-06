from flask import Flask, request, jsonify, render_template, session, redirect, url_for, escape
from models.post import Post
from models.otherEvent import OtherEvent
import time

class UrlController:
    """
    Class dùng điều khiển URL

    ...

    Methods
    ----------
    homeController(): Chuyển hướng trang home của từng loại tài khoản
    
    loginController(): Chuyển hướng trang đăng nhập của tất cả các loại tài khoản
    
    logoutController(): Đăng xuất của tất cả các loại tài khoản
        
    """
    def UPDATE(self):
        OtherEvent().updateTotalViewDefault()
        OtherEvent().updateTotalFavoriteDefault()
    
    def homeController(self):
        """
        Chuyển hướng trang home của từng loại tài khoản
        
        Parameters
        ----------
        None    
        """
        # có 4 loại tài khoản, trang home của 4 loại tài khoản này cũng khác nhau
        if 'type_account' not in session:
            return render_template('home.html')
        elif session['type_account'] == "owner":
            return render_template('post-manager-owner.html')
        elif session['type_account'] == "renter":
            return render_template('home.html')
        else:
            # type_account is "admin"
            return render_template('post-manager-admin.html')
    
    def detailPost(self, idPost, titlePost):
        if Post().checkPost(idPost, titlePost):
            OtherEvent().eventViewPost(idPost)
            OtherEvent().updateTotalViewDefault()
            OtherEvent().updateTotalFavoriteDefaultupdateTotalFavoriteDefault()
            return render_template('detail-post.html')
        return
    
    def loginController(self):
        """
        Chuyển hướng trang đăng nhập của tất cả các loại tài khoản
        
        Parameters
        ----------
        None
        """
        # user chưa đăng nhập thì chuyển hướng về trang đăng nhập
        # ngược lại, user đã đăng nhập trước đó thì chuyển về trang home
        if 'type_account' not in session:
            return render_template('login.html')
        else:
            return redirect('/')
    
    def logoutController(self):
        """
        Đăng xuất của tất cả các loại tài khoản
        
        Parameters
        ----------
        None
        """
        if 'type_account' not in session:
            # dấu hiệu có sự phá hoại
            time.sleep(10) 
        else:
            # trường hợp bình thường: xóa toàn bộ session
            session.clear()
            # chuyển hướng sang trang đăng nhập
            return redirect('/dang-nhap')
    
    def signupController(self):
        """
        Chuyển hướng sang trang đăng ký tài khoản
        
        Parameters
        ----------
        None
        """
        if 'type_account' in session:
            # bất thường
            session.clear()
        # chuyển hướng sang trang đăng ký
        return render_template('signup.html')
    
    def managerPost(self):
        if 'type_account' not in session:
            return redirect('/dang-nhap') 
        elif session['type_account'] == "owner":
            OtherEvent().updateTotalViewDefault()
            OtherEvent().updateTotalViewDefault()
            return render_template('post-manager-owner.html')
        elif session['type_account'] == "renter":
            return redirect('/')
        else:
            # type_account is "admin"
            OtherEvent().updateTotalViewDefault()
            OtherEvent().updateTotalViewDefault()
            return render_template('post-manager-admin.html')
    