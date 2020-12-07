from models.connectDatabase import ConnectDatabase
from models.notification import Notification
from datetime import datetime, timedelta

class Post:
    def __init__(self):
        pass
    
    def create(self, titlePost, contentPost, addressProvince, addressDistrict, addressWard, addressDetail, locationRelate, itemType, numOfRoom, priceItem, area, statusItem, bathroom, kitchen, aircondition, balcony, priceElectric, priceWater, otherUtility, usernameAuthorPost, typeAccountAuthor, postDuration, listImages):
        # typeAccountAuthor in ["owner", "admin"]
        connectDatabase = ConnectDatabase()
        connectDatabase.connection.autocommit = False
        if typeAccountAuthor == "owner":
            # chủ nhà trọ đăng bài => chờ admin duyệt
            statusPost = "handling"
            query_str = """
                INSERT INTO post(titlePost, contentPost, addressProvince, addressDistrict, addressWard, addressDetail, locationRelate, itemType, numOfRoom, priceItem, area, statusItem, bathroom, kitchen, aircondition, balcony, priceElectric, priceWater, otherUtility, usernameAuthorPost, typeAccountAuthor, postDuration, createDate, statusPost, statusHired)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """
            connectDatabase.cursor.execute(query_str, titlePost, contentPost, addressProvince, addressDistrict, addressWard, addressDetail, locationRelate, itemType, numOfRoom, priceItem, area, statusItem, bathroom, kitchen, aircondition, balcony, priceElectric, priceWater, otherUtility, usernameAuthorPost, typeAccountAuthor, postDuration, datetime.date(datetime.now()), statusPost, "ready")
        else:
            # admin đăng bài => không phải chờ duyệt
            statusPost = "active"
            query_str = """
                INSERT INTO post(titlePost, contentPost, addressProvince, addressDistrict, addressWard, addressDetail, locationRelate, itemType, numOfRoom, priceItem, area, statusItem, bathroom, kitchen, aircondition, balcony, priceElectric, priceWater, otherUtility, usernameAuthorPost, typeAccountAuthor, postDuration, createDate, acceptDate, expireDate, statusPost, statusHired)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """
            connectDatabase.cursor.execute(query_str, titlePost, contentPost, addressProvince, addressDistrict, addressWard, addressDetail, locationRelate, itemType, numOfRoom, priceItem, area, statusItem, bathroom, kitchen, aircondition, balcony, priceElectric, priceWater, otherUtility, usernameAuthorPost, typeAccountAuthor, postDuration, datetime.date(datetime.now()), datetime.date(datetime.now()), datetime.date(datetime.now() + timedelta(days=postDuration)), statusPost, "ready")
        query_str = "SELECT MAX(idPost) FROM post"
        idPost = connectDatabase.cursor.execute(query_str).fetchval()
        query_str = """
            INSERT INTO image_post(idPost, image)
            VALUES (?, ?)
            """
        for image in listImages:
            connectDatabase.cursor.execute(query_str, idPost, image)
        connectDatabase.connection.commit()
        connectDatabase.close()
        # thêm thông báo
        icon = "icon-post.png"
        titleNotification = "Đăng bài mới"
        if typeAccountAuthor == "admin":
            content = "Đăng bài thành công. Mã bài đăng: " + str(idPost)
        else:
            content = "Bài đăng " + str(idPost) + " đang chờ được duyệt"        
        Notification().create(titleNotification, usernameAuthorPost, icon, content)
    
    def adminActiveRequestPost(self, idPost, usernameOwner, postDuration):
        # sử dụng khi bài chấp nhận đăng bài lần đầu và gia hạn bài viết
        connectDatabase = ConnectDatabase()
        query_str = "UPDATE post SET statusPost = ?, acceptDate = ?, expireDate = ? WHERE idPost = ?"
        connectDatabase.cursor.execute(query_str, "active", datetime.date(datetime.now()), datetime.date(datetime.now() + timedelta(days=postDuration)), idPost)
        connectDatabase.connection.commit()
        connectDatabase.close()
        # thêm thông báo
        icon = "icon-post.png"
        titleNotification = "Đăng bài mới"
        content = "Bài đăng " + str(idPost) + " đã được duyệt. Ngày hết hạn: " + '/'.join(str(datetime.date(datetime.now() + timedelta(days=postDuration))).split('-')[::-1])      
        Notification().create(titleNotification, usernameOwner, icon, content)
    
    def adminDenyRequestPost(self, idPost, usernameOwner):
        # sử dụng khi bài từ chối đăng bài lần đầu và từ chối gia hạn bài viết
        connectDatabase = ConnectDatabase()
        query_str = "UPDATE post SET statusPost = ?, acceptDate = ? WHERE idPost = ?"
        connectDatabase.cursor.execute(query_str, "deny", datetime.date(datetime.now()), idPost)
        connectDatabase.connection.commit()
        connectDatabase.close()
        # thêm thông báo
        icon = "icon-post.png"
        titleNotification = "Bài đăng thất bại"
        content = "Bài đăng " + str(idPost) + " bị từ chối do thông tin không hợp lý hoặc chưa thanh toán phí. Thử với bài đăng khác hoặc liên hệ lại với quản trị viên"    
        Notification().create(titleNotification, usernameOwner, icon, content)
    
    def ownerCheckEditPost(self, idPost):
        connectDatabase = ConnectDatabase()
        query_str = "SELECT statusPost FROM post WHERE idPost = ?"
        statusPost = connectDatabase.cursor.execute(query_str, idPost).fetchval()
        if statusPost == "handling":
            return True
        else: 
            return False
    
    def editPost(self, idPost, titlePost, contentPost, addressProvince, addressDistrict, addressWard, addressDetail, locationRelate, itemType, numOfRoom, priceItem, area, statusItem, bathroom, kitchen, aircondition, balcony, priceElectric, priceWater, otherUtility, postDuration, usernameOwner):
        # sử dụng khi owner muốn chỉnh sửa bài đăng mà admin chưa phê duyệt
        connectDatabase = ConnectDatabase()
        statusPost = "handling"
        query_str = """
            UPDATE post SET titlePost = ?, contentPost = ?, addressProvince = ?, addressDistrict = ?, addressWard = ?, addressDetail = ?, locationRelate = ?, itemType = ?, numOfRoom = ?, priceItem = ?, area = ?, statusItem = ?, bathroom = ?, kitchen = ?, aircondition = ?, balcony = ?, priceElectric = ?, priceWater = ?, otherUtility = ?, postDuration = ?, statusPost = ?)
            WHERE idPost = ?
            """
        connectDatabase.cursor.execute(query_str, titlePost, contentPost, addressProvince, addressDistrict, addressWard, addressDetail, locationRelate, itemType, numOfRoom, priceItem, area, statusItem, bathroom, kitchen, aircondition, balcony, priceElectric, priceWater, otherUtility, postDuration, statusPost, idPost)
        connectDatabase.connection.commit()
        connectDatabase.close()
        # thêm thông báo
        icon = "icon-post.png"
        titleNotification = "Chỉnh sửa bài đăng"
        content = "Bài đăng " + str(idPost) + " được chính sửa thành công"    
        Notification().create(titleNotification, usernameOwner, icon, content)