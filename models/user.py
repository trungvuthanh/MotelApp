from models.connectDatabase import ConnectDatabase
import time

class User:
    """
    Class người dùng (guest, owner, renter, admin)

    ...

    Methods
    ----------
    __init__(username="": str, password="": str): constructor
    
    checkLogin(): str
    
    checkUsername(username: str): str        
    """
    def __init__(self, username = "", password = ""):
        """
        Constructor
        
        Parameters
        ----------
        username: str (tên đăng nhập)
        
        password: str (mật khẩu)
        """
        self.username = username
        self.password = password
        
    def infoAccount(self, username, typeAccount):
        if typeAccount == "owner":
            query_str = """
            SELECT fullName, CONCAT(addressWard, ", ", addressDistrict, ", ", addressProvince) address, phoneNumber
            FROM owner
            WHERE username = ?
            """
            connectDatabase = ConnectDatabase()
            row = connectDatabase.cursor.execute(query_str, username).fetchone()
            return {"name": row.fullName, "address": row.address, "phoneNumber": row.phoneNumber}
        else:
            return {"name": "Quản trị viên", "address": "Xuân Thủy, Cầu Giấy, Hà Nội", "phoneNumber": "0989898766"}
    
      
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
        connectDatabase = ConnectDatabase()
        rows = connectDatabase.cursor.execute(query_str, self.username, self.password)
        count = rows.rowcount
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
    
    def checkUsername(self, username):
        """
        Kiểm tra username đã tồn tại trong database hay chưa
        
        Parameters
        ----------
        username: str (Username muốn kiểm tra)
            
        Returns
        ----------
        str: Username đã tồn tại hay chưa ("exist", "not_exist")
        """
        query_str = """
            WITH user AS (
                SELECT userName FROM admin
                UNION SELECT userName FROM owner
                UNION SELECT userName FROM renter
            ) 
            SELECT * FROM user
            WHERE userName = ?
            """
        connectDatabase = ConnectDatabase()
        rows = connectDatabase.cursor.execute(query_str, username)
        count = rows.rowcount
        if count == 0:
            # chưa có tài khoản nào có tên đăng nhập trùng
            connectDatabase.close()
            return "not_exist"
        # tồn tại tài khoản trùng tên đăng nhập
        connectDatabase.close()  
        return "exist"