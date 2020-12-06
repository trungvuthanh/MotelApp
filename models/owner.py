from models.user import User
from models.connectDatabase import ConnectDatabase
from datetime import datetime

class Owner(User):
    
    def __init__(self):
        pass
    
    def signup(self, username, password, fullname, phoneNumber, email, birthday, ID, imageID, addressProvince, addressDistrict, addressWard, addressDetail, typeAvt):
        """
        Đăng ký tài khoản của Chủ nhà trọ => Đưa vào danh sách chờ duyệt
        
        Parameters
        ----------
        None
            
        Returns
        ----------
        
        """
        query_str = """
            INSERT INTO owner(username, password, fullname, phoneNumber, email, birthday, ID, imageID, addressProvince, addressDistrict, addressWard, addressDetail, typeAvt, status, createDate)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """
        connectDatabase = ConnectDatabase()
        connectDatabase.cursor.execute(query_str, username, password, fullname, phoneNumber, email, birthday, ID, imageID, addressProvince, addressDistrict, addressWard, addressDetail, typeAvt, "handling", datetime.date(datetime.now()))
        connectDatabase.connection.commit()
        connectDatabase.close()
        
    def checkEnableEditAccount(self, username):
        """
        Chỉnh sửa Chủ nhà trọ có quyền sửa thông tin cá nhân không
        
        Parameters
        ----------
        None
            
        Returns
        ----------
        
        """
        query_str = "SELECT COUNT(*) FROM owner_profile_scratch WHERE username = ? AND status = ?"
        connectDatabase = ConnectDatabase()
        count_rows = connectDatabase.cursor.execute(query_str, username, "enable").fetchval()
        connectDatabase.close()
        return count_rows == 1
    
    def editAccount(self, username, phoneNumber, email, birthday, addressProvince, addressDistrict, addressWard, addressDetail, fullName):
        """
        Chỉnh sửa thông tin tài khoản của Chủ nhà trọ => Đưa vào danh sách chờ duyệt
        
        Parameters
        ----------
        None
            
        Returns
        ----------
        
        """
        query_str = """
            UPDATE owner_profile_scratch SET status = ? 
            WHERE username = ? AND status = ?
            """
        connectDatabase = ConnectDatabase()
        connectDatabase.cursor.execute(query_str, "deny", username, "handling")
        connectDatabase.connection.commit()
        query_str = """
            UPDATE owner_profile_scratch SET phoneNumber = ?, email = ?, birthday = ?, addressProvince = ?, addressDistrict = ?, addressWard = ?, addressDetail = ?, time = ?, status = ?, fullName = ? 
            WHERE username = ? AND status = ?
            """
        connectDatabase.cursor.execute(query_str, phoneNumber, email, birthday, addressProvince, addressDistrict, addressWard, addressDetail, datetime.now(), "handling", fullName, username, "enable")
        connectDatabase.connection.commit()
        connectDatabase.close()
    
    def changePasswordAndAvatar(self, username, new_password, new_typeAvt):
        query_str = "UPDATE owner SET password = ?, typeAvt = ? WHERE username = ?"
        connectDatabase = ConnectDatabase()
        connectDatabase.cursor.execute(query_str, new_password, new_typeAvt, username)
        connectDatabase.connection.commit()
        connectDatabase.close()
    