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
    
    def extendPost(self, idPost, postDuration, typeAccountAuthor, usernameAuthorPost):
        if typeAccountAuthor == "owner":
            connectDatabase = ConnectDatabase()
            query_str = """
                UPDATE post SET postDuration = ?, statusPost = ?
                WHERE idPost = ? AND usernameAuthorPost = ?
                """
            connectDatabase.cursor.execute(query_str, postDuration, "extend", idPost, usernameAuthorPost)
            connectDatabase.connection.commit()
            connectDatabase.close()
            # thêm thông báo
            icon = "icon-post.png"
            titleNotification = "Gia hạn bài đăng"
            content = "Bài đăng " + str(idPost) + " đang chờ chấp nhận gia hạn. Liên hệ sớm nhất với quản trị viên để thanh toán"    
            Notification().create(titleNotification, usernameAuthorPost, icon, content)
        else:
            connectDatabase = ConnectDatabase()
            query_str = "UPDATE post SET statusPost = ?, acceptDate = ?, expireDate = ? WHERE idPost = ? AND usernameAuthorPost = ?"
            connectDatabase.cursor.execute(query_str, "active", datetime.date(datetime.now()), datetime.date(datetime.now() + timedelta(days=postDuration)), idPost, usernameAuthorPost)
            connectDatabase.connection.commit()
            connectDatabase.close()
    
    def getAllPost(self, typeAccount, username, statusPost, sortDate, access, province = "", district = "", ward = ""):
        """ 
        Xử lý trang quản lý "của" bên A: chủ trọ và bên C: quản trị viên
                    
            statusPost: 
            
            "handling" (chờ duyệt)  => sortDate =   "createDateASC" (ngày tạo tăng dần - cũ đến mới)
                                                    "createDateDESC" (ngày tạo giảm dần - mới về cũ)
                                    => access (KHÔNG CÓ!)
            
            "active" (đã đăng)      => sortDate =   "acceptDateASC" (ngày đăng tăng dần - cũ đến mới)
                                                    "acceptDateDESC" (ngày đăng giảm dần - mới về cũ)
                                                    "expireDateASC" (thời hạn giảm dần - ngày hạn tăng dần)
                                                    "expireDateDESC" (thời hạn tăng dần - ngày hạn giảm dần)
                                    => access   =   "viewASC" (lượt xem tăng dần)
                                                    "viewDESC" (lượt xem giảm dần)
                                                    "favoriteASC" (lượt yêu thích tăng dần)
                                                    "favoriteDESC" (lượt yêu thích tăng dần)
                                                    "ratingASC" (rating tăng dần)
                                                    "ratingDESC" (rating giảm dần)
            
            "expired" (hết hạn)     => sortDate =   "acceptDateASC" (ngày đăng tăng dần - cũ đến mới)
                                                    "acceptDateDESC" (ngày đăng giảm dần - mới về cũ)
                                                    "expireDateASC" (ngày hạn tăng dần)
                                                    "expireDateDESC" (ngày hạn giảm dần)
                                    => access (KHÔNG CÓ!)
            
            "block" (bị report)     => sortDate =   "acceptDateASC" (ngày block tăng dần - cũ đến mới)
                                                    "acceptDateDESC" (ngày block giảm dần - mới về cũ)
                                    => access (KHÔNG CÓ!)
            
            (bài đăng của admin)    => sortDate =   "createDateASC" (ngày tạo tăng dần - cũ đến mới)
                                                    "createDateDESC" (ngày tạo giảm dần - mới về cũ)
                                    => access   =   "viewASC" (lượt xem tăng dần)
                                                    "viewDESC" (lượt xem giảm dần)
                                                    "favoriteASC" (lượt yêu thích tăng dần)
                                                    "favoriteDESC" (lượt yêu thích tăng dần)
                                                    "ratingASC" (rating tăng dần)
                                                    "ratingDESC" (rating giảm dần)                             
        """
        query_str = """
            SELECT idPost, titlePost, addressProvince, addressDistrict, addressWard, addressDetail, itemType, priceItem, statusItem, createDate, acceptDate, expireDate, statusPost, statusHired, totalView, totalFavorite, avgRating 
            FROM post 
            WHERE 
        """
        # filter địa chỉ
        if province != "":
            query_str += "addressProvince = \"" + province + "\" AND "
        if district != "":
            query_str += "addressDistrict = \"" + district + "\" AND "
        if ward != "":
            query_str += "addressWard = \"" + ward + "\" AND "
        
        if typeAccount == "admin":
            if statusPost == "handling" or statusPost == "active" or statusPost == "expired" or statusPost == "block": 
                query_str += " statusPost = \"" + statusPost + "\" ORDER BY "
            else:
                # bài đăng admin 
                query_str += """ typeAccountAuthor = "admin" ORDER BY """
        else:
            # owner quản lý bài đăng
            query_str += " statusPost = \"" + statusPost + "\", usernameAuthorPost = \"" + username + "\" ORDER BY "
        """ 
        filter sortDate
            "createDateASC" (ngày tạo tăng dần - cũ đến mới)
            "createDateDESC" (ngày tạo giảm dần - mới về cũ)
            "acceptDateASC" (ngày đăng tăng dần - cũ đến mới)
            "acceptDateDESC" (ngày đăng giảm dần - mới về cũ)
            "expireDateASC" (thời hạn giảm dần - ngày hạn tăng dần)
            "expireDateDESC" (thời hạn tăng dần - ngày hạn giảm dần)
            "acceptDateASC" (ngày đăng tăng dần - cũ đến mới)
            "acceptDateDESC" (ngày đăng giảm dần - mới về cũ)          
        """  
        if sortDate == "createDateASC":
            query_str += "createDate, "
        elif sortDate == "createDateDESC":
            query_str += "createDate DESC, "
        
        elif sortDate == "acceptDateASC":
            query_str += "acceptDate, "
        elif sortDate == "acceptDateDESC":
            query_str += "acceptDate DESC, "
        
        elif sortDate == "expireDateASC":
            query_str += "expireDate, "
        else: 
            query_str += "expireDate DESC, "
        
        """ 
        filter access
            "viewASC" (lượt xem tăng dần)
            "viewDESC" (lượt xem giảm dần)
            "favoriteASC" (lượt yêu thích tăng dần)
            "favoriteDESC" (lượt yêu thích tăng dần)
            "ratingASC" (rating tăng dần)
            "ratingDESC" (rating giảm dần)              
        """
        if access == "viewASC":
            query_str += "totalView "
        elif access == "viewDESC":
            query_str += "totalView DESC "
        elif access == "favoriteASC":
            query_str += "totalFavorite "
        elif access == "favoriteDESC":
            query_str += "totalFavorite DESC "
        elif access == "ratingASC":
            query_str += "avgRating "
        elif access == "ratingDESC":
            query_str += "avgRating DESC "
        
        query_str += " LIMIT 50 "
        connectDatabase = ConnectDatabase()
        rows = connectDatabase.cursor.execute(query_str).fetchall()
        connectDatabase.close()
        return [{"idPost": row.idPost, "titlePost": row.titlePost, "addressProvince": row.addressProvince, "addressDistrict": row.addressDistrict, "addressWard": row.addressWard, "addressDetail": row.addressDetail, "itemType": row.itemType, "priceItem": row.priceItem, "statusItem": row.statusItem, "createDate": str(row.createDate), "acceptDate": str(row.acceptDate), "expireDate": str(row.expireDate), "statusPost": row.statusPost, "statusHired": row.statusHired, "totalView": row.totalView, "totalFavorite": row.totalFavorite, "avgRating": row.avgRating} for row in rows]