from models.user import User
from models.connectDatabase import ConnectDatabase
from models.notification import Notification
from datetime import datetime
import math

class Admin(User):
    
    def __init__(self):
        pass
    
    def checkOwnerEditAccount(self, username):
        query_str = """
            SELECT COUNT(*) FROM owner_profile_scratch WHERE username = ? AND status = ?
            """
        connectDatabase = ConnectDatabase()
        return connectDatabase.cursor.execute(query_str, username, "enable").fetchval() > 0
    
    def getAllAccountOwner(self, status, numPage = 1):
        # status = "active" or "handling" or "block"
        query_str = """
            SELECT status, "owner" as typeAccount, fullname, birthday, concat(addressWard, ", ", addressDistrict, ", ", addressProvince) address, ID, imageID , email, username, phoneNumber, DATE(createDate) createDate
            FROM owner 
            WHERE status = ?
            LIMIT 10 OFFSET ?"""
        connectDatabase = ConnectDatabase()
        rows = connectDatabase.cursor.execute(query_str, status, (numPage - 1)*10)
        result = [{"status": row.status, "typeAccount": row.typeAccount, "fullname": row.fullname, "birthday": str(row.birthday), "address": row.address, "ID": row.ID, "imageID": row.imageID , "email": row.email, "username": row.username, "phoneNumber": row.phoneNumber, "createDate": str(row.createDate), "enableEdit": self.checkOwnerEditAccount(row.username)} for row in rows]
        
        query_str = "SELECT COUNT(*) FROM owner WHERE status = ?"
        numberAccount = connectDatabase.cursor.execute(query_str, status).fetchval()
        connectDatabase.close()
        
        hasPrev = False if numPage == 1 else True
        if numberAccount == 0:
            hasNext = False
            hasPrev = False
        else:
            maxPage = ((numberAccount - 1)//10*10 + 10)//10
            hasNext = True if numPage < maxPage else False
        return (result, hasPrev, hasNext)
    
    def getAllRequestEditInfoOwner(self, numPage = 1):
        query_str = """
            SELECT "edit" as status, "owner" as typeAccount, fullname, birthday, concat(addressWard, ", ", addressDistrict, ", ", addressProvince) address, "" as ID, "null" as imageID , email, username, phoneNumber, DATE(time) createDate FROM owner_profile_scratch WHERE status = ? LIMIT 10 OFFSET ?"""
        connectDatabase = ConnectDatabase()
        rows = connectDatabase.cursor.execute(query_str, "handling", (numPage - 1)*10)
        result = [{"status": row.status, "typeAccount": row.typeAccount, "fullname": row.fullname, "birthday": str(row.birthday), "address": row.address, "ID": row.ID, "imageID": row.imageID , "email": row.email, "username": row.username, "phoneNumber": row.phoneNumber, "createDate": str(row.createDate)} for row in rows]
        
        query_str = "SELECT COUNT(*) FROM owner_profile_scratch WHERE status = ?"
        numberAccount = connectDatabase.cursor.execute(query_str, "handling").fetchval()
        connectDatabase.close()
        
        hasPrev = False if numPage == 1 else True
        if numberAccount == 0:
            hasNext = False
            hasPrev = False
        else:
            maxPage = ((numberAccount - 1)//10*10 + 10)//10
            hasNext = True if numPage < maxPage else False
        return (result, hasPrev, hasNext)
    
    def getAllAccountRenter(self, status, numPage = 1):
        # status = "active" or "block"
        query_str = """
            SELECT status, "renter" as typeAccount, fullname, birthday, concat(addressWard, ", ", addressDistrict, ", ", addressProvince) address, "" as ID, "null" as imageID , email, username, phoneNumber, DATE(createDate) createDate 
            FROM renter 
            WHERE status = ? 
            LIMIT 10 
            OFFSET ?"""
        connectDatabase = ConnectDatabase()
        rows = connectDatabase.cursor.execute(query_str, status, (numPage - 1)*10)
        result = [{"status": row.status, "typeAccount": row.typeAccount, "fullname": row.fullname, "birthday": str(row.birthday), "address": row.address, "ID": row.ID, "imageID": row.imageID , "email": row.email, "username": row.username, "phoneNumber": row.phoneNumber, "createDate": str(row.createDate)} for row in rows]
        
        query_str = "SELECT COUNT(*) FROM owner WHERE status = ?"
        numberAccount = connectDatabase.cursor.execute(query_str, status).fetchval()
        connectDatabase.close()
        
        hasPrev = False if numPage == 1 else True
        if numberAccount == 0:
            hasNext = False
            hasPrev = False
        else:
            maxPage = ((numberAccount - 1)//10*10 + 10)//10
            hasNext = True if numPage < maxPage else False
        return (result, hasPrev, hasNext)
    
    def stringQuerySearchAccountOwner(self, type):
        if type == 1:
            query_str = "SELECT * FROM owner WHERE username = ?"
        else:
            query_str = "SELECT * FROM owner_profile_scratch WHERE username = ?"
        return query_str
    
    def searchAccountOwner(self, stringSearch):
        query_str = """
            WITH user AS (
                SELECT status, "owner" as typeAccount, fullname, birthday, concat(addressWard, ", ", addressDistrict, ", ", addressProvince) address, ID, imageID , email, username, phoneNumber, DATE(createDate) createDate, MATCH(fullname, phoneNumber) AGAINST (?) as score FROM owner 
                UNION 
                SELECT "edit" as status, "owner" as typeAccount, fullname, birthday, concat(addressWard, ", ", addressDistrict, ", ", addressProvince) address, "" as ID, "null" as imageID , email, username, phoneNumber, DATE(time) createDate, MATCH(fullname, phoneNumber) AGAINST (?) as score
                FROM owner_profile_scratch 
            ) 
            SELECT status, typeAccount, fullname, birthday, address, ID, imageID , email, username, phoneNumber, createDate 
            FROM user
            ORDER BY score DESC LIMIT 5
            """
        connectDatabase = ConnectDatabase()
        rows = connectDatabase.cursor.execute(query_str, stringSearch, stringSearch).fetchall()
        connectDatabase.close()
        return [{"status": row.status, "typeAccount": row.typeAccount, "fullname": row.fullname, "birthday": str(row.birthday), "address": row.address, "ID": row.ID, "imageID": row.imageID , "email": row.email, "username": row.username, "phoneNumber": row.phoneNumber, "createDate": str(row.createDate)} for row in rows]
    
    def searchAccountRenter(self, stringSearch):
        query_str = """
            SELECT status, "renter" as typeAccount, fullname, birthday, concat(addressWard, ", ", addressDistrict, ", ", addressProvince) address, "" as ID, "null" as imageID , email, username, phoneNumber, DATE(createDate) createDate, MATCH(fullname, phoneNumber) AGAINST (?) as score 
            FROM renter 
            ORDER BY score DESC LIMIT 5"""
        connectDatabase = ConnectDatabase()
        rows = connectDatabase.cursor.execute(query_str, stringSearch).fetchall()
        connectDatabase.close()
        return [{"status": row.status, "typeAccount": row.typeAccount, "fullname": row.fullname, "birthday": str(row.birthday), "address": row.address, "ID": row.ID, "imageID": row.imageID , "email": row.email, "username": row.username, "phoneNumber": row.phoneNumber, "createDate": str(row.createDate)} for row in rows]
    
    def setUnEnableEditAccountOwner(self, username):
        query_str = "DELETE FROM owner_profile_scratch WHERE username = ? AND status = ?"
        connectDatabase = ConnectDatabase()
        connectDatabase.cursor.execute(query_str, username, "enable")
        connectDatabase.connection.commit()
        connectDatabase.close()
    
    def setEnableEditAccountOwner(self, username):
        query_str = "DELETE FROM owner_profile_scratch WHERE username = ? AND status = ?"
        connectDatabase = ConnectDatabase()
        connectDatabase.cursor.execute(query_str, username, "enable")
        connectDatabase.connection.commit()
        query_str = """
            INSERT INTO owner_profile_scratch(status, username) 
            VALUES (?, ?)
            """
        connectDatabase.cursor.execute(query_str, "enable", username)
        connectDatabase.connection.commit()
        connectDatabase.close()
        # thêm thông báo
        icon = "icon-account.png"
        titleNotification = "Chỉnh sửa tài khoản"
        content = "Tài khoản của bạn vừa được quản trị viên cấp quyền chỉnh sửa. Lưu ý chỉ chỉnh sửa được 1 lần, hãy thận trọng với những thông tin được sửa đổi. Nếu phát hiện thông tin bất thường, tài khoản của bạn có thể bị khóa hoặc xóa vĩnh viễn"    
        Notification().create(titleNotification, username, icon, content)
        
    def handlingEditAccount(self, username, status):
        # status = "deny" or status = "accept"
        query_str = """
            UPDATE owner_profile_scratch SET status = ? 
            WHERE username = ? AND status = ?
            """
        connectDatabase = ConnectDatabase()
        connectDatabase.cursor.execute(query_str, status, username, "handling")
        connectDatabase.connection.commit()
        if status == "accept":
            query_str = """
            SELECT phoneNumber, email, birthday, addressProvince, addressDistrict, addressWard, addressDetail, fullname
            FROM owner_profile_scratch 
            WHERE username = ? AND status = ? 
            ORDER BY id DESC
            LIMIT 1
            """
            row = connectDatabase.cursor.execute(query_str, username, "accept").fetchone()
            query_str = """
                UPDATE owner SET phoneNumber = ?, email = ?, birthday = ?, addressProvince = ?, addressDistrict = ?, addressWard = ?, addressDetail = ?, fullname = ? 
                WHERE username = ? AND status = ?
                """
            connectDatabase.cursor.execute(query_str, row.phoneNumber, row.email, row.birthday, row.addressProvince, row.addressDistrict, row.addressWard, row.addressDetail, row.fullname, username, "active")
            connectDatabase.connection.commit()
        connectDatabase.close()
        
    def handlingRequestCreateAccountOwner(self, username, status):
        # status = "active" or status = "deny"
        query_str = """
            UPDATE owner SET status = ?, acceptDate = ? 
            WHERE username = ? AND status = ?
            """
        connectDatabase = ConnectDatabase()
        connectDatabase.cursor.execute(query_str, status, datetime.date(datetime.now()), username, "handling")
        connectDatabase.connection.commit()
        connectDatabase.close()
    
    def lockAccount(self, username, status, typeAccount):
        # status = "block" or status = "active"
        if typeAccount == "owner":
            query_str = """
                UPDATE owner SET status = ? 
                WHERE username = ?
                """
        else:
            query_str = """
                UPDATE renter SET status = ? 
                WHERE username = ?
                """
        connectDatabase = ConnectDatabase()
        connectDatabase.cursor.execute(query_str, status, username)
        connectDatabase.connection.commit()
        connectDatabase.close()
    
    def deleteAccount(self, username, typeAccount):
        connectDatabase = ConnectDatabase()
        if typeAccount == "owner":
            query_str = """
                DELETE FROM owner 
                WHERE username = ?
                """
            connectDatabase.cursor.execute(query_str, username)
            connectDatabase.connection.commit()
            query_str = """
                DELETE FROM owner_profile_scratch 
                WHERE username = ?
                """
            connectDatabase.cursor.execute(query_str, username)
            connectDatabase.connection.commit()
        else:
            query_str = """
                UPDATE renter SET status = ? 
                WHERE username = ?
                """        
            connectDatabase.cursor.execute(query_str, username)
            connectDatabase.connection.commit()
        connectDatabase.close()
        
    