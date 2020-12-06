from models.connectDatabase import ConnectDatabase
from datetime import datetime, timedelta

class Post:
    def __init__(self):
        pass
    
    def create(self, titlePost, contentPost, addressProvince, addressDistrict, addressWard, addressDetail, locationRelate, itemType, numOfRoom, priceItem, area, statusItem, bathroom, kitchen, aircondition, balcony, priceElectric, priceWater, otherUtility, usernameAuthorPost, typeAccountAuthor, postDuration, listImages):
        # typeAccountAuthor in ["owner", "admin"]
        connectDatabase = ConnectDatabase()
        if typeAccountAuthor == "owner":
            # chủ nhà trọ đăng bài => chờ admin duyệt
            statusPost = "handling"
        else:
            # admin đăng bài => không phải chờ duyệt
            statusPost = "active"
        query_str = """
            INSERT INTO post(titlePost, contentPost, addressProvince, addressDistrict, addressWard, addressDetail, locationRelate, itemType, numOfRoom, priceItem, area, statusItem, bathroom, kitchen, aircondition, balcony, priceElectric, priceWater, otherUtility, usernameAuthorPost, typeAccountAuthor, postDuration, createDate, statusPost, statusHired)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """
        connectDatabase.cursor.execute(query_str, titlePost, contentPost, addressProvince, addressDistrict, addressWard, addressDetail, locationRelate, itemType, numOfRoom, priceItem, area, statusItem, bathroom, kitchen, aircondition, balcony, priceElectric, priceWater, otherUtility, usernameAuthorPost, typeAccountAuthor, postDuration, datetime.date(datetime.now()), statusPost, "ready")
        connectDatabase.connection.commit()
        query_str = """
            INSERT INTO image(titlePost, contentPost, addressProvince, addressDistrict, addressWard, addressDetail, locationRelate, itemType, numOfRoom, priceItem, area, statusItem, bathroom, kitchen, aircondition, balcony, priceElectric, priceWater, otherUtility, usernameAuthorPost, typeAccountAuthor, postDuration, createDate, statusPost, statusHired)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """
        connectDatabase.cursor.execute(query_str, titlePost, contentPost, addressProvince, addressDistrict, addressWard, addressDetail, locationRelate, itemType, numOfRoom, priceItem, area, statusItem, bathroom, kitchen, aircondition, balcony, priceElectric, priceWater, otherUtility, usernameAuthorPost, typeAccountAuthor, postDuration, datetime.date(datetime.now()), statusPost, "ready")
        connectDatabase.connection.commit()
        connectDatabase.close()
    
    def adminActiveRequestPost(self, idPost, postDuration):
        # sử dụng khi bài chấp nhận đăng bài lần đầu và gia hạn bài viết
        connectDatabase = ConnectDatabase()
        query_str = "UPDATE post SET statusPost = ?, acceptDate = ?, expireDate = ? WHERE idPost = ?"
        connectDatabase.cursor.execute(query_str, "active", datetime.date(datetime.now()), datetime.date(datetime.now() + timedelta(days=postDuration)), idPost)
        connectDatabase.connection.commit()
        connectDatabase.close()
    
    def adminDenyRequestPost(self, idPost):
        # sử dụng khi bài từ chối đăng bài lần đầu và từ chối gia hạn bài viết
        connectDatabase = ConnectDatabase()
        query_str = "UPDATE post SET statusPost = ?, acceptDate = ? WHERE idPost = ?"
        connectDatabase.cursor.execute(query_str, "deny", datetime.date(datetime.now()), idPost)
        connectDatabase.connection.commit()
        connectDatabase.close()
    
    def ownerCheckEditPost(self, idPost):
        connectDatabase = ConnectDatabase()
        query_str = "SELECT statusPost FROM post WHERE idPost = ?"
        statusPost = connectDatabase.cursor.execute(query_str, idPost).fetchval()
        if statusPost == "handling":
            return True
        else: 
            return False
    
    def editPost(self, idPost, titlePost, contentPost, addressProvince, addressDistrict, addressWard, addressDetail, locationRelate, itemType, numOfRoom, priceItem, area, statusItem, bathroom, kitchen, aircondition, balcony, priceElectric, priceWater, otherUtility, typeAccountAuthor, postDuration):
        pass