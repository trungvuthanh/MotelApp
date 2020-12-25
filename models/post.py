from models.connectDatabase import ConnectDatabase
from models.notification import Notification
from models.otherEvent import OtherEvent
from datetime import datetime, timedelta
from calendar import monthrange
import unidecode

class Post:
    def __init__(self):
        pass
    
    def getImagePost(self, idPost, limit = "all"):
        connectDatabase = ConnectDatabase()
        if limit == "one":
            query_str = "SELECT image FROM image_post WHERE idPost = ? LIMIT 1"
            image = connectDatabase.cursor.execute(query_str, idPost).fetchval()
            connectDatabase.close()
            return {"idPost": idPost, "image": image}
        query_str = "SELECT image FROM image_post WHERE idPost = ?"
        images = connectDatabase.cursor.execute(query_str, idPost).fetchall()
        connectDatabase.close()
        return {"idPost": idPost, "images": [image.image for image in images]}

    def checkPost(self, idPost, titlePost):
        connectDatabase = ConnectDatabase()
        query_str = "SELECT titlePost FROM post WHERE idPost = ?"
        return unidecode.unidecode(connectDatabase.cursor.execute(query_str, idPost).fetchval()).lower() == titlePost
    
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
        titleNotification = "Đăng bài"
        content = "Bài đăng " + str(idPost) + " đã được đăng. Ngày hết hạn: " + '/'.join(str(datetime.date(datetime.now() + timedelta(days=postDuration))).split('-')[::-1])      
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
    
    def checkEditPost(self, idPost, username):
        connectDatabase = ConnectDatabase()
        query_str = "SELECT COUNT(*) FROM post WHERE idPost = ? AND statusPost = ? AND usernameAuthorPost = ?"
        return connectDatabase.cursor.execute(query_str, idPost, "handling", username).fetchval() == 1
    
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
    
    def getMoreInformationPost(self, idPost):
        connectDatabase = ConnectDatabase()
        query_str = """
            SELECT idPost, contentPost, locationRelate, numOfRoom, area, bathroom, kitchen, aircondition, balcony, priceElectric, priceWater, otherUtility, usernameAuthorPost, typeAccountAuthor, postDuration
            FROM post 
            WHERE idPost = ?
            """
        row = connectDatabase.cursor.execute(query_str, idPost).fetchone()
        if row.typeAccountAuthor == "admin":
            name = "Quản trị viên"
            query_str = """
                SELECT phoneNumber, address
                FROM admin 
                LIMIT 1
                """
            adminInfo = connectDatabase.cursor.execute(query_str).fetchone()
            phoneNumber = adminInfo.phoneNumber
            address = adminInfo.address
        else:
            query_str = """
                SELECT fullname, phoneNumber, concat(addressWard, ", ", addressDistrict, ", ", addressProvince) as "address"
                FROM owner WHERE username = ?
                """
            ownerInfo = connectDatabase.cursor.execute(query_str, row.usernameAuthorPost).fetchone()
            name = ownerInfo.fullname
            phoneNumber = ownerInfo.phoneNumber
            address = ownerInfo.address
        query_str = "SELECT image FROM image_post WHERE idPost = ? LIMIT 1"
        image = connectDatabase.cursor.execute(query_str, row.idPost).fetchval()
        connectDatabase.close()
        return {"idPost": row.idPost, "contentPost": row.contentPost, "locationRelate": row.locationRelate, "numOfRoom": row.numOfRoom, "area": row.area, "bathroom": row.bathroom, "kitchen": row.kitchen, "aircondition": row.aircondition, "balcony": row.balcony, "priceElectric": row.priceElectric, "priceWater": row.priceWater, "otherUtility": row.otherUtility, "usernameAuthorPost": row.usernameAuthorPost, "typeAccountAuthor": row.typeAccountAuthor, "postDuration": row.postDuration, "name": name, "phoneNumber": phoneNumber, "address": address, "image": image}
    
    
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
            "extend" (gia hạn)                      "acceptDateDESC" (ngày đăng giảm dần - mới về cũ)
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
            SELECT idPost, titlePost, addressProvince, addressDistrict, addressWard, addressDetail, itemType, priceItem, statusItem, createDate, acceptDate, expireDate, statusPost, statusHired, totalView, totalFavorite, avgRating , postDuration
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
            if statusPost == "postOfAdmin":
                # bài đăng admin 
                query_str += """ typeAccountAuthor = "admin" ORDER BY """
            else: 
                query_str += " statusPost = \"" + statusPost + "\" ORDER BY "                
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
        
        query_str += " LIMIT 10 "
        connectDatabase = ConnectDatabase()
        rows = connectDatabase.cursor.execute(query_str).fetchall()
        connectDatabase.close()
        return [{"idPost": row.idPost, "postDuration": row.postDuration, "titlePost": row.titlePost, "addressProvince": row.addressProvince, "addressDistrict": row.addressDistrict, "addressWard": row.addressWard, "addressDetail": row.addressDetail, "itemType": row.itemType, "priceItem": row.priceItem, "statusItem": row.statusItem, "createDate": str(row.createDate), "acceptDate": str(row.acceptDate), "expireDate": str(row.expireDate), "statusPost": row.statusPost, "statusHired": row.statusHired, "totalView": row.totalView, "totalFavorite": row.totalFavorite, "avgRating": row.avgRating, "moreInfo": self.getMoreInformationPost(row.idPost)} for row in rows]
    
    
    def getAllInfomationPost(self, idPost):
        connectDatabase = ConnectDatabase()
        query_str = """
            SELECT idPost, titlePost, contentPost, addressProvince, addressDistrict, addressWard, addressDetail, locationRelate, itemType, numOfRoom, priceItem, area, statusItem, bathroom, kitchen, aircondition, balcony, priceElectric, priceWater, otherUtility, usernameAuthorPost, typeAccountAuthor, postDuration, createDate, acceptDate, expireDate, statusPost, statusHired, totalView, totalFavorite, avgRating
            FROM post 
            WHERE idPost = ?
            """
        row = connectDatabase.cursor.execute(query_str, idPost).fetchone()
        if row.typeAccountAuthor == "admin":
            name = "Quản trị viên"
            query_str = """
                SELECT phoneNumber, address
                FROM admin 
                LIMIT 1
                """
            adminInfo = connectDatabase.cursor.execute(query_str).fetchone()
            phoneNumber = adminInfo.phoneNumber
            address = adminInfo.address
        else:
            query_str = """
                SELECT fullname, phoneNumber, concat(addressWard, ", ", addressDistrict, ", ", addressProvince) as "address"
                FROM owner WHERE username = ?
                """
            ownerInfo = connectDatabase.cursor.execute(query_str, row.usernameAuthorPost).fetchone()
            name = ownerInfo.fullname
            phoneNumber = ownerInfo.phoneNumber
            address = ownerInfo.address
        query_str = "SELECT image FROM image_post WHERE idPost = ?"
        rows = connectDatabase.cursor.execute(query_str, row.idPost).fetchall()
        images = [row.image for row in rows]
        connectDatabase.close()
        return {"idPost": row.idPost, "contentPost": row.contentPost, "locationRelate": row.locationRelate, "numOfRoom": row.numOfRoom, "area": row.area, "bathroom": row.bathroom, "kitchen": row.kitchen, "aircondition": row.aircondition, "balcony": row.balcony, "priceElectric": row.priceElectric, "priceWater": row.priceWater, "otherUtility": row.otherUtility, "typeAccountAuthor": row.typeAccountAuthor, "postDuration": row.postDuration, "name": name, "images": images, "nameAuthor": name, "phoneNumberAuthor": phoneNumber, "addressAuthor": address}
    
    def updateStatusHired(self, idPost, username, statusHired):
        connectDatabase = ConnectDatabase()
        query_str = "UPDATE post SET statusHired = ? WHERE idPost = ? AND usernameAuthorPost = ?"
        connectDatabase.cursor.execute(query_str, statusHired, idPost, username)
        connectDatabase.connection.commit()
        connectDatabase.close()
    
    def blockPost(self, idPost):
        connectDatabase = ConnectDatabase()
        query_str = "UPDATE post SET statusPost = ? WHERE idPost = ?"
        connectDatabase.cursor.execute(query_str, "block", idPost)
        connectDatabase.connection.commit()
        connectDatabase.close()
        
    def unblockPost(self, idPost):
        connectDatabase = ConnectDatabase()
        query_str = "SELECT statusPost, DATEDIFF(NOW(), expireDate) AS time FROM post WHERE idPost = ?"
        row = connectDatabase.cursor.execute(query_str, idPost).fetchone()
        if row.statusPost != "block":
            connectDatabase.close()
        else:
            status = "active" if row.time <= 0 else "expired"
            query_str = "UPDATE post SET statusPost = ? WHERE idPost = ?" 
            connectDatabase.cursor.execute(query_str, status, idPost)
            connectDatabase.connection.commit()                  
            connectDatabase.close()
    
    def getUsernameAuthorPost(self, idPost):
        connectDatabase = ConnectDatabase()
        query_str = "SELECT usernameAuthorPost FROM post WHERE idPost = ?"
        res = connectDatabase.cursor.execute(query_str, idPost).fetchval()
        connectDatabase.close()
        return res
    
    
    def checkAuthorPost(self, idPost, username):
        connectDatabase = ConnectDatabase()
        query_str = "SELECT COUNT(*) FROM post WHERE idPost = ? AND usernameAuthorPost = ?"
        count = connectDatabase.cursor.execute(query_str, idPost, username).fetchval()
        connectDatabase.close()
        return count == 1
    
    def deletePost(self, idPost):
        connectDatabase = ConnectDatabase()
        query_str = "DELETE FROM post WHERE idPost = ?"
        connectDatabase.cursor.execute(query_str, idPost)
        connectDatabase.connection.commit()
        connectDatabase.close()
    
    def updateExpiredPost(self):
        connectDatabase = ConnectDatabase()
        query_str = """
            UPDATE post SET statusPost = ? 
            WHERE statusPost = ? AND DATEDIFF(NOW(), expireDate) >= 0
            """
        connectDatabase.cursor.execute(query_str, "expired", "active")
        connectDatabase.connection.commit()                  
        connectDatabase.close()
    
    def search(self, stringSearch, itemType, priceItemMin, priceItemMax, area, sort, statusItem, type, usernameRenter = "", numPage = 1):        
        # default: itemType(""), area(0), sort("", "price DESC", "price", "area DESC", "area"), statusItem(0, 1: "chungchu", 2:"khongchungchu")
        # type=0: không click
        # type=1: địa chỉ đã click
        if type == 0:
            data = OtherEvent().fuzzywuzzySearch(stringSearch)
            if data == []:
                return {"hasPrev": False, "hasNext": False, "listPost": []}
            stringSearch = data[0]["address"]
        
        # lưu địa điểm
        OtherEvent().saveHistorySearch(stringSearch, usernameRenter)       
        
        address = stringSearch.split(', ')
        if len(address) == 1:
            filterAddress = " addressProvince = ? "
        else: 
            filterAddress = " addressDistrict = ? and addressProvince = ? "

        connectDatabase = ConnectDatabase() 
        query_str = """
            SELECT idPost, titlePost, priceItem, concat(addressWard, ", ", addressDistrict, ", ", addressProvince) AS "address", area, numOfRoom, priceWater, priceElectric
            FROM post 
            WHERE priceItem >= ? AND priceItem <= ? 
                AND area >= ?
                AND statusPost = ? AND
           """ 
        query_str += filterAddress
        if itemType != "":
            query_str += " AND itemType = \"" + str(itemType) + "\" "
        if statusItem != 0:
            statusItem = {1: "chungchu", 2: "khongchungchu"}[statusItem]
            query_str += " AND statusItem = \"" + str(statusItem) + "\" "
        if sort != "":
            query_str += "ORDER BY "+ sort 
        query_str += " LIMIT 10 OFFSET ? "
        if len(address) == 1:
            rows = connectDatabase.cursor.execute(query_str, priceItemMin, priceItemMax, area, "active", address[0], (numPage - 1)*10).fetchall()
        else:
            rows = connectDatabase.cursor.execute(query_str, priceItemMin, priceItemMax, area, "active", address[0], address[1], (numPage - 1)*10).fetchall()
        query_str = """
            SELECT COUNT(*)
            FROM post 
            WHERE priceItem >= ? AND priceItem <= ? 
                AND area >= ? AND 
        """
        query_str += filterAddress
        if itemType != "":
            query_str += " AND itemType = \"" + str(itemType) + "\" "
        if statusItem != 0:
            statusItem = {1: "chungchu", 2: "khongchungchu"}[statusItem]
            query_str += " AND statusItem = \"" + str(statusItem) + "\" "        
        if len(address) == 1:
            count = connectDatabase.cursor.execute(query_str, priceItemMin, priceItemMax, area, address[0]).fetchval()
        else:
            count = connectDatabase.cursor.execute(query_str, priceItemMin, priceItemMax, area, address[0], address[1]).fetchval()
        connectDatabase.close()
        
        hasPrev = False if numPage == 1 else True
        if count == 0:
            hasNext = False
            hasPrev = False
        else:
            maxPage = ((count - 1)//10*10 + 10)//10
            hasNext = True if numPage < maxPage else False 
        
        return {"hasPrev": hasPrev, "hasNext": hasNext, "listPost": [{"idPost": row.idPost, "titlePost": row.titlePost, "priceItem": row.priceItem, "address": row.address, "area": row.area, "numOfRoom": row.numOfRoom, "priceWater": row.priceWater, "priceElectric": row.priceElectric} for row in rows]}
    
    