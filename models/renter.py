from models.user import User
from models.connectDatabase import ConnectDatabase
from datetime import datetime

class Renter(User):
    
    def __init__(self):
        pass
    
    def signup(self, username, password, fullname, phoneNumber, email, birthday, addressProvince, addressDistrict, addressWard, addressDetail, typeAvt):
        """
        Đăng ký tài khoản của Người thuê trọ
        
        Parameters
        ----------
        None
            
        Returns
        ----------
        
        """
        query_str = """
            INSERT INTO renter(username, password, fullname, phoneNumber, email, birthday, addressProvince, addressDistrict, addressWard, addressDetail, typeAvt, status, createDate)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """
        connectDatabase = ConnectDatabase()
        connectDatabase.cursor.execute(query_str, username, password, fullname, phoneNumber, email, birthday, addressProvince, addressDistrict, addressWard, addressDetail, typeAvt, "active", datetime.date(datetime.now()))
        connectDatabase.connection.commit()
        connectDatabase.close()
    
    def editAccount(self, username, password, phoneNumber, email, birthday, addressProvince, addressDistrict, addressWard, addressDetail, typeAvt):
        """
        Chỉnh sửa thông tin tài khoản của Người thuê trọ
        
        Parameters
        ----------
        None
            
        Returns
        ----------
        
        """
        query_str = """
            UPDATE renter SET password = ?, typeAvt = ?, phoneNumber = ?, email = ?, birthday = ?, addressProvince = ?, addressDistrict = ?, addressWard = ?, addressDetail = ?, time = ? WHERE username = ?
            """
        connectDatabase = ConnectDatabase()
        connectDatabase.cursor.execute(query_str, password, typeAvt, phoneNumber, email, birthday, addressProvince, addressDistrict, addressWard, addressDetail, datetime.now(), username)
        connectDatabase.connection.commit()
        connectDatabase.close()