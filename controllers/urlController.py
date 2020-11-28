from flask import Flask, request, jsonify, render_template, session, redirect, url_for, escape

class UrlController:
    """
    Class dùng điều khiển URL

    ...

    Methods
    ----------
    homeController(): Chuyển hướng trang home của từng loại tài khoản
    
    loginController(): Chuyển hướng trang đăng nhập của tất cả các loại tài khoản
        
    """
    
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
            return render_template('home-owner.html')
        elif session['type_account'] == "renter":
            return render_template('home.html')
        else:
            return render_template('home-admin.html')
        
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
            return redirect(url_for('/'))
        
        
        