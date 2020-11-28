from models.connectDatabase import ConnectDatabase
import time

class User:
    """
    Class người dùng (guest, owner, renter, admin)

    ...

    Methods
    ----------
    __init__(username: str, password: str): constructor
    
    loginController(): Chuyển hướng trang đăng nhập của tất cả các loại tài khoản
        
    """
    def __init__(self, username, password):
        """
        Constructor
        
        Parameters
        ----------
        username: str (tên đăng nhập)
        
        password: str (mật khẩu)
        """
        self.username = username
        self.password = password
        
        
    def checkLogin(self):
        """
        Kiểm tra thông tin đăng nhập, lưu lại tên, loại tài khoản, avatar (nếu có)
        
        Parameters
        ----------
        None
        
        Returns
        ----------
        str: Kết quả kiểm tra ("active", "handling", "block", "null")
        """
        query_str = """
            WITH user AS (
                SELECT userName, password, 'Quản trị viên' AS fullname, 'admin' AS typeAccount, typeAvt, 'active' AS status  FROM admin
                UNION SELECT userName, password, fullname, 'owner' AS typeAccount, typeAvt, status FROM owner
                UNION SELECT userName, password, fullname, 'renter' AS typeAccount, typeAvt, status FROM renter
            ) 
            SELECT * FROM user
            WHERE userName = ? AND password = ?
            """
        tt = time.time()
        connectDatabase = ConnectDatabase()
        print(time.time() - tt)
        rows = connectDatabase.cursor.execute(query_str, self.username, self.password)
        count  = rows.rowcount
        if count == 1:
            row = rows.fetchone()
            if row.status != "block":
                self.type_account = row.typeAccount
                self.type_avatar = row.typeAvt
                self.fullname = row.fullname
            connectDatabase.close()
            return row.status 
        connectDatabase.close()  
        return "null"
        
        tt = time.time()
        
        # check admin        
        query_str = "SELECT typeAvt FROM admin WHERE username = ? AND password = ?" 
        rows = ConnectDatabase.cursor.execute(query_str, self.username, self.password)
        count  = rows.rowcount
        print(time.time() - tt)
        tt = time.time()
        if count == 1:
            # tài khoản này là của admin 
            row = rows.fetchone()
            self.type_account = "admin"
            self.type_avatar = row.typeAvt
            self.fullname = "Quản trị viên"
            return "active"           
        
        # check owner
        query_str = "SELECT fullname, typeAvt, status FROM owner WHERE username = ? AND password = ?" 
        rows = ConnectDatabase.cursor.execute(query_str, self.username, self.password)
        count  = rows.rowcount
        print(time.time() - tt)
        tt = time.time()
        if count == 1:
            # tài khoản này là của owner 
            row = rows.fetchone()
            if row.status != "block":
                # active hoặc handling
                self.type_account = "owner"
                self.type_avatar = row.typeAvt
                self.fullname = row.fullname
            return row.status
        
        # check renter
        query_str = "SELECT fullname, typeAvt, status FROM renter WHERE username = ? AND password = ?" 
        rows = ConnectDatabase.cursor.execute(query_str, self.username, self.password)
        count  = rows.rowcount
        if count == 1:
            # tài khoản này là của renter 
            row = rows.fetchone()
            if row.status == "active":
                self.type_account = "renter"
                self.type_avatar = row.typeAvt
                self.fullname = row.fullname
            print(time.time() - tt)
            tt = time.time()
            return row.status
        
        # không tìm thấy 
        return "null"
        