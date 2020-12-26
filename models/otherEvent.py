from models.connectDatabase import ConnectDatabase
from fuzzywuzzy import fuzz
from datetime import datetime, timedelta
from calendar import monthrange


class OtherEvent:
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
    
    def eventViewPost(self, idPost, usernameRenter=""):
        # lưu lịch sử 
        query_str = """
            INSERT INTO history_view(idPost, usernameRenter) VALUES (?, ?)
            """
        connectDatabase = ConnectDatabase()
        connectDatabase.cursor.execute(query_str, idPost, usernameRenter)
        connectDatabase.connection.commit()
        # update totalView
        query_str = """
            UPDATE post SET totalView = (
                SELECT COUNT(*) FROM history_view WHERE history_view.idPost = ? AND NOW() >= history_view.time
            ) WHERE idPost = ?
            """
        connectDatabase = ConnectDatabase()
        connectDatabase.cursor.execute(query_str, idPost)
        connectDatabase.connection.commit()
        connectDatabase.close()       
        
    def updateTotalViewDefault(self):    
        # update totalView()
        query_str = """
            UPDATE post SET totalView = (
                SELECT COUNT(*) FROM history_view WHERE history_view.idPost = ? AND NOW() >= history_view.time
            ) WHERE idPost = ?
            """
        connectDatabase = ConnectDatabase()
        for i in range(1, 801):
            connectDatabase.cursor.execute(query_str, i, i)
            connectDatabase.connection.commit()
        connectDatabase.close()
        
    def eventFavoritePost(self, idPost, usernameRenter, status="add"):
        connectDatabase = ConnectDatabase()
        query_str = """
            UPDATE favorite_post 
            SET status = ? 
            WHERE idPost = ? AND usernameRenter = ? AND NOW() >= favorite_post.time
            """   
        connectDatabase.cursor.execute(query_str, "no", idPost, usernameRenter)
        connectDatabase.connection.commit()
        if status == "add":  
            query_str = """
                INSERT INTO favorite_post(idPost, usernameRenter) VALUES (?, ?)
                """   
            connectDatabase.cursor.execute(query_str, idPost, usernameRenter)
            connectDatabase.connection.commit()
        
        # update totalFavorite
        query_str = """
            UPDATE post SET totalFavorite = (
                SELECT COUNT(*) 
                FROM favorite_post 
                WHERE favorite_post.idPost = ? AND NOW() >= favorite_post.time AND favorite_post.status = ?
            ) WHERE idPost = ?
            """
        connectDatabase = ConnectDatabase()
        connectDatabase.cursor.execute(query_str, idPost, "yes", idPost)
        connectDatabase.connection.commit()
        connectDatabase.close()       
        
    def updateTotalFavoriteDefault(self):    
        # update totalView()
        query_str = """
            UPDATE post SET totalFavorite = (
                SELECT COUNT(*) 
                FROM favorite_post 
                WHERE favorite_post.idPost = ? AND NOW() >= favorite_post.time AND favorite_post.status = ?
            ) WHERE idPost = ?
            """
        connectDatabase = ConnectDatabase()
        for i in range(1, 801):
            connectDatabase.cursor.execute(query_str, i, i, "yes")
            connectDatabase.connection.commit()
        connectDatabase.close()
    
    def renterSendReport(self, idPost, usernameRenter, fakeInfo, fakePrice, content=""):
        query_str = """
            INSERT INTO report_post(idPost, usernameRenter, fakeInfo, fakePrice, content) VALUES (?, ?, ?, ?, ?)
            """
        connectDatabase = ConnectDatabase()
        connectDatabase.cursor.execute(query_str, idPost, usernameRenter, fakeInfo, fakePrice, content)
        connectDatabase.connection.commit()
        connectDatabase.close()
    
    def adminGetAllReport(self, status):
        query_str = """
            SELECT id, report_post.idPost, fakeInfo, fakePrice, fullname, content, DATE(time) time, titlePost, typeAvt, report_post.status status
            FROM report_post 
            JOIN renter ON renter.username = usernameRenter 
            JOIN post ON post.idPost = report_post.idPost
            WHERE report_post.status = ? AND NOW() >= time
            ORDER BY time
            """
        connectDatabase = ConnectDatabase()
        rows = connectDatabase.cursor.execute(query_str, status).fetchall()
        connectDatabase.close()
        return [{"id": row.id, "status": row.status, "idPost": row.idPost, "fakeInfo": row.fakeInfo, "fakePrice": row.fakePrice, "fullname": row.fullname, "content": row.content, "time": str(row.time), "titlePost": row.titlePost, "typeAvt": row.typeAvt} for row in rows]
    
    def ownerGetAllReport(self, usernameRenter):
        query_str = """
            SELECT id, report_post.idPost, fakeInfo, fakePrice, fullname, typeAvt, content, time, titlePost, report_post.status
            FROM report_post 
            JOIN renter ON renter.username = usernameRenter 
            JOIN post ON post.idPost = report_post.idPost
            WHERE NOW() >= time AND usernameRenter = ?
            """
        connectDatabase = ConnectDatabase()
        rows = connectDatabase.cursor.execute(query_str, usernameRenter).fetchall()
        connectDatabase.close()
        return [{"id": row.id, "idPost": row.idPost, "fakeInfo": row.fakeInfo, "fakePrice": row.fakePrice, "fullname": row.fullname, "content": row.content, "time": str(row.time), "titlePost": row.titlePost, "status": row.status, "typeAvt": row.typeAvt} for row in rows]
    
    def changeStatusReport(self, id, status):
        query_str = """
            UPDATE report_post SET status = ? WHERE id = ?
            """
        connectDatabase = ConnectDatabase()
        connectDatabase.cursor.execute(query_str, status, id)
        connectDatabase.connection.commit()
        connectDatabase.close()        
    
    def getIdPostFromReport(self, id):
        query_str = """
            SELECT idPost FROM report_post WHERE id = ?
            """
        connectDatabase = ConnectDatabase()
        return connectDatabase.cursor.execute(query_str, id).fetchval()
    
    def getHistoryPost(self, usernameRenter):
        query_str = """
            SELECT DISTINCT(post.idPost) idPost, post.titlePost, post.priceItem, post.addressDetail, post.addressWard, post.addressDistrict, post.addressProvince
            FROM history_view
            JOIN post ON history_view.idPost = post.idPost
            WHERE usernameRenter = ? AND history_view.status = ?
            AND NOW() >= history_view.time
            ORDER BY history_view.time DESC
            """
        connectDatabase = ConnectDatabase()
        rows = connectDatabase.cursor.execute(query_str, usernameRenter, "yes").fetchall()
        connectDatabase.close()
        return [{"idPost": row.idPost, "image": self.getImagePost(row.idPost, "one")["image"], "titlePost": row.titlePost, "priceItem": row.priceItem, "addressDetail": row.addressDetail, "addressWard": row.addressWard, "addressDistrict": row.addressDistrict, "addressProvince": row.addressProvince} for row in rows]
    
    def deleteHistoryPost(self, usernameRenter, idPost):
        query_str = """
            UPDATE history_view 
            SET status = ?
            WHERE usernameRenter = ? AND idPost = ? AND NOW() >= time 
            """
        connectDatabase = ConnectDatabase()
        connectDatabase.cursor.execute(query_str, "no", usernameRenter, idPost)
        connectDatabase.connection.commit()
        connectDatabase.close()
        
    def deleteAllHistoryPost(self, usernameRenter):
        query_str = """
            UPDATE history_view 
            SET status = ?
            WHERE usernameRenter = ? AND NOW() >= time 
            """
        connectDatabase = ConnectDatabase()
        connectDatabase.cursor.execute(query_str, "no", usernameRenter)
        connectDatabase.connection.commit()
        connectDatabase.close()
        
    def getFavoritePost(self, usernameRenter):
        query_str = """
            SELECT idPost, titlePost, priceItem, addressDetail, addressWard, addressDistrict, addressProvince
            FROM post
            WHERE idPost IN (
                SELECT DISTINCT(idPost)
                FROM favorite_post
                WHERE usernameRenter = ? AND status = ? AND NOW() >= time 
            )
            """
        connectDatabase = ConnectDatabase()
        rows = connectDatabase.cursor.execute(query_str, usernameRenter, "yes").fetchall()
        connectDatabase.close()
        return [{"idPost": row.idPost, "image": self.getImagePost(row.idPost, "one")["image"], "titlePost": row.titlePost, "priceItem": row.priceItem, "addressDetail": row.addressDetail, "addressWard": row.addressWard, "addressDistrict": row.addressDistrict, "addressProvince": row.addressProvince} for row in rows]
    
    def isFavoritePost(self, usernameRenter, idPost):
        connectDatabase = ConnectDatabase()
        query_str = """
            SELECT COUNT(*) FROM favorite_post WHERE usernameRenter = ? AND idPost = ? AND NOW() > time AND status = ?
            """
        val = connectDatabase.cursor.execute(query_str, usernameRenter, idPost, "yes").fetchval()
        connectDatabase.close()
        return {"isFavorite": val!=0, "idPost": idPost}
    
    def unFavoritePost(self, usernameRenter, idPost):
        query_str = """
            UPDATE favorite_post 
            SET status = ? 
            WHERE usernameRenter = ? AND idPost = ? AND NOW() >= time AND status = ? 
            """
        connectDatabase = ConnectDatabase()
        connectDatabase.cursor.execute(query_str, "no", usernameRenter, idPost, "yes")
        connectDatabase.connection.commit()
        connectDatabase.close()
        
    def ownerGetPost(self, usernameOwner, statusPost):
        connectDatabase = ConnectDatabase()
        if statusPost != "report":
            query_str = """
                SELECT idPost, titlePost, priceItem, addressDetail, addressWard, addressDistrict, addressProvince
                FROM post
                WHERE usernameAuthorPost = ? AND statusPost = ?
                """
            rows = connectDatabase.cursor.execute(query_str, usernameOwner, statusPost).fetchall()
        else:
            query_str = """
                SELECT idPost, titlePost, priceItem, addressDetail, addressWard, addressDistrict, addressProvince
                FROM post
                WHERE usernameAuthorPost = ? AND idPost IN (
                    SELECT DISTINCT(idPost) FROM report_post
                )
                """
            rows = connectDatabase.cursor.execute(query_str, usernameOwner).fetchall()
        connectDatabase.close()
        return [{"idPost": row.idPost, "titlePost": row.titlePost, "priceItem": row.priceItem, "addressDetail": row.addressDetail, "addressWard": row.addressWard, "addressDistrict": row.addressDistrict, "addressProvince": row.addressProvince} for row in rows]
    
    def statisticalOwner(self, usernameOwner):
        query_str = """
            SELECT COUNT(*) FROM post WHERE usernameAuthorPost = ? AND statusPost = ?
            """
        connectDatabase = ConnectDatabase()
        actives = connectDatabase.cursor.execute(query_str, usernameOwner, "active").fetchval()
        handlings = connectDatabase.cursor.execute(query_str, usernameOwner, "handling").fetchval()
        blocks = connectDatabase.cursor.execute(query_str, usernameOwner, "block").fetchval()
        query_str = """
            SELECT COUNT(*)
            FROM post
            WHERE usernameAuthorPost = ? AND idPost IN (
                SELECT DISTINCT(idPost) FROM report_post
            )
            """
        reports = connectDatabase.cursor.execute(query_str, usernameOwner).fetchval()
        query_str = """
            SELECT COUNT(*) AS posts, SUM(totalView) as totalViews, SUM(totalFavorite) as totalFavorites FROM post WHERE usernameAuthorPost = ?
            """
        row = connectDatabase.cursor.execute(query_str, usernameOwner).fetchone()      
        connectDatabase.close()
        return {"actives": actives, "handlings": handlings, "reports": reports, "blocks": blocks, "posts": row.posts, "totalViews": int(row.totalViews), "totalFavorites": int(row.totalFavorites)}
    
    def allDays(self, y, m):
        return ['{:04d}-{:02d}-{:02d}'.format(y, m, d) for d in range(1, monthrange(y, m)[1] + 1)]

    def statisticalDateHighestView(self, username="admin"):
        connectDatabase = ConnectDatabase()
        if username != "admin":
            query_str = """
                SELECT DATE(time) day, COUNT(*) maxView FROM history_view WHERE idPost IN (
                    SELECT idPost FROM post WHERE usernameAuthorPost = ?
                ) AND time <= NOW()
                GROUP BY DATE(time)
                ORDER BY maxView DESC 
                LIMIT 1
                """
            row = connectDatabase.cursor.execute(query_str, username).fetchone() 
            return {"day": str(row.day), "maxView": row.maxView}
        else:
            query_str = """
                SELECT DATE(time) day, COUNT(*) maxView FROM history_view 
                WHERE time <= NOW() 
                GROUP BY DATE(time) 
                ORDER BY maxView DESC 
                LIMIT 1
                """
            row = connectDatabase.cursor.execute(query_str).fetchone() 
            query_str = """
                SELECT COUNT(*) maxView, HOUR(time) hour FROM history_view WHERE time <= NOW()
                GROUP BY HOUR(time)
                ORDER BY maxView DESC 
                LIMIT 1
                """
            hour = connectDatabase.cursor.execute(query_str).fetchone() 
            views = {"day": str(row.day), "maxView": row.maxView, "hour": hour.hour, "countInHour": hour.maxView}
            query_str = """
                SELECT addressSearch, COUNT(*) count FROM history_search WHERE time <= NOW()
                GROUP BY addressSearch
                ORDER BY count DESC
                LIMIT 3
                """
            rows = connectDatabase.cursor.execute(query_str).fetchall()
            searchs = [{"addressSeach": row.addressSearch, "count": row.count} for row in rows]
            return {"views": views, "searchs": searchs}

    def adminGetTop3Post(self):
        connectDatabase = ConnectDatabase()
        query_str = """
            SELECT idPost, titlePost, CONCAT(addressWard, ", ", addressDistrict, ", ", addressProvince) address, totalView, totalFavorite, totalView+2*totalFavorite score
            FROM post
            ORDER BY score DESC
            LIMIT 3
            """
        rows = connectDatabase.cursor.execute(query_str).fetchall()
        i = 0
        data = []
        for row in rows:
            i += 1
            if i == 1:
                data.append({"idPost": row.idPost, "titlePost": row.titlePost, "address": row.address, "totalView": row.totalView, "totalFavorite": row.totalFavorite, "score": row.score, "images": self.getImagePost(row.idPost, "all")})
            else:
                data.append({"idPost": row.idPost, "titlePost": row.titlePost, "address": row.address, "totalView": row.totalView, "totalFavorite": row.totalFavorite, "score": row.score, "image": self.getImagePost(row.idPost, "one")})
        return data
    
    def statisticalPost(self, username="admin"):
        connectDatabase = ConnectDatabase()
        if username != "admin":
            query_str = """
                SELECT COUNT(*) count, statusPost
                FROM post
                WHERE usernameAuthorPost = ? 
                GROUP BY statusPost
                """
            rows = connectDatabase.cursor.execute(query_str, username).fetchall()
            return [{"statusPost": row.statusPost, "count": row.count} for row in rows]
        else:
            query_str = """
                SELECT COUNT(*) count, statusPost
                FROM post
                GROUP BY statusPost
                """
            rows = connectDatabase.cursor.execute(query_str).fetchall()
            arr1 = [{"statusPost": row.statusPost, "count": row.count} for row in rows]
            query_str = "SELECT COUNT(*) FROM report_post"
            report_post = connectDatabase.cursor.execute(query_str).fetchval()
            query_str = "SELECT COUNT(*) FROM review"
            review = connectDatabase.cursor.execute(query_str).fetchval()
            arr1.append({"report_post": report_post, "review": review})
            return arr1

    def statisticalView(self, username = "admin", groupTime = "", arg1 = "", arg2 = ""):
        # groupTime in ["inDay yyyy-mm-dd", "inWeek", "inMonth yyyy mm", "dayToDay yyyy-mm-dd yyyy-mm-dd"]
        connectDatabase = ConnectDatabase()
        if username != "admin":
            # thống kê lượt xem trong 7 ngày gần nhất
            query_str = """
                SELECT COUNT(*) FROM history_view 
                WHERE idPost IN (
                    SELECT idPost FROM post WHERE usernameAuthorPost = ?
                ) AND DATE(time) = ?
                """
            data = []
            for x in range(7):
                day = datetime.date(datetime.now() - timedelta(days=x))
                viewInDay = connectDatabase.cursor.execute(query_str, username, day).fetchval() 
                data.append({"day": str(day), "viewInDay": viewInDay})
            return data
        else:
            # admin: thống kê trong ngày, tuần, tháng
            data = []
            if groupTime == "inDay":
                day = datetime.date(datetime.strptime(arg1, "%Y-%m-%d"))
                query_str = "SELECT COUNT(*) FROM history_view WHERE DATE(time) = ? AND HOUR(time) = ? AND NOW() - time >= 0"
                for x in range(24):
                    viewInHour = connectDatabase.cursor.execute(query_str, day, x).fetchval() 
                    data.append({"hour": x, "viewInHour": viewInHour})
                return data
            elif groupTime == "inMonth":
                year = int(arg1)
                month = int(arg2)
                query_str = "SELECT COUNT(*) FROM history_view WHERE DATE(time) = ? AND NOW() - time >= 0"
                for x in self.allDays(year, month):
                    viewInDay = connectDatabase.cursor.execute(query_str, datetime.date(datetime.strptime(x, "%Y-%m-%d"))).fetchval() 
                    data.append({"day": x, "viewInDay": viewInDay})
                return data
            else:
                if groupTime == "inWeek":
                    intervalDay = [datetime.date(datetime.now()) - timedelta(days=x) for x in range(6, -1, -1)]
                else:
                    # groupTime = "dayToDay"
                    start = datetime.date(datetime.strptime(arg1, "%Y-%m-%d"))
                    end = datetime.date(datetime.strptime(arg2, "%Y-%m-%d"))
                    intervalDay = [start + timedelta(days=x) for x in range(0, (end-start).days + 1)]
                query_str = "SELECT COUNT(*) FROM history_view WHERE DATE(time) = ? AND NOW() - time >= 0"
                for x in intervalDay:
                    viewInDay = connectDatabase.cursor.execute(query_str, x).fetchval() 
                    data.append({"day": str(x), "viewInDay": viewInDay})
                return data
    
    def createReview(self, usernameRenter, stars, content, idPost, typeAvt):
        query_str = """
            INSERT INTO review(usernameRenter, stars, content, idPost)
            VALUES(?, ?, ?, ?)
            """
        connectDatabase = ConnectDatabase()
        connectDatabase.cursor.execute(query_str, usernameRenter, stars, content, idPost)
        connectDatabase.connection.commit()
        connectDatabase.close()

    def adminGetReview(self, status):
        query_str = """
            SELECT id, review.idPost, stars, fullname, content, DATE(time) time, titlePost, typeAvt, review.status
            FROM review 
            JOIN renter ON renter.username = usernameRenter 
            JOIN post ON post.idPost = review.idPost
            WHERE review.status = ? AND NOW() >= time
            ORDER BY time
            """
        connectDatabase = ConnectDatabase()
        rows = connectDatabase.cursor.execute(query_str, status).fetchall()
        connectDatabase.close()
        return [{"id": row.id, "status": row.status, "idPost": row.idPost, "stars": row.stars, "fullname": row.fullname, "content": row.content, "time": str(row.time), "titlePost": row.titlePost, "typeAvt": row.typeAvt} for row in rows]
    
    def ownerGetReview(self, usernameRenter):
        query_str = """
            SELECT id, review.idPost, stars, fullname, content, time, titlePost, typeAvt, review.status
            FROM review 
            JOIN renter ON renter.username = usernameRenter 
            JOIN post ON post.idPost = report_post.idPost
            WHERE NOW() >= time AND usernameRenter = ?
            """
        connectDatabase = ConnectDatabase()
        rows = connectDatabase.cursor.execute(query_str, usernameRenter).fetchall()
        connectDatabase.close()
        return [{"id": row.id, "idPost": row.idPost, "stars": row.stars, "fullname": row.fullname, "content": row.content, "time": str(row.time), "titlePost": row.titlePost, "status": row.status, "typeAvt": row.typeAvt} for row in rows]
    
    def renterOrGuestGetReview(self, idPost):
        query_str = """
            SELECT id, stars, fullname, content, time, typeAvt
            FROM review 
            JOIN renter ON renter.username = usernameRenter 
            WHERE NOW() >= time AND review.status = ? AND idPost = ?
            """
        connectDatabase = ConnectDatabase()
        rows = connectDatabase.cursor.execute(query_str, "accept", idPost).fetchall()
        connectDatabase.close()
        return [{"id": row.id, "stars": row.stars, "fullname": row.fullname, "content": row.content, "time": str(row.time), "typeAvt": row.typeAvt} for row in rows]
    
    def updateReview(self, id, status, stars="", content=""):
        connectDatabase = ConnectDatabase()
        if stars == "" and content == "":
            query_str = "UPDATE review SET status = ? WHERE id = ?"
            connectDatabase.cursor.execute(query_str, status)
        else:
            query_str = "UPDATE review SET status = ?, stars = ?, content = ? WHERE id = ?"
            connectDatabase.cursor.execute(query_str, status, stars, content, id)
        connectDatabase.connection.commit()    
        connectDatabase.close()
        
    def statisticalRenter(self, usernameRenter):
        connectDatabase = ConnectDatabase()
        # views
        query_str = "SELECT COUNT(*) FROM history_view WHERE usernameRenter = ? AND NOW() >= time"
        views = connectDatabase.cursor.execute(query_str, usernameRenter).fetchval()
        # favorites
        query_str = "SELECT COUNT(*) FROM favorite_post WHERE usernameRenter = ? AND NOW() >= time AND status = ?"
        favorites = connectDatabase.cursor.execute(query_str, usernameRenter, "yes").fetchval()
        # reviews
        query_str = "SELECT COUNT(*) FROM review WHERE usernameRenter = ? AND NOW() >= time"
        reviews = connectDatabase.cursor.execute(query_str, usernameRenter).fetchval()
        # reports
        query_str = "SELECT COUNT(*) FROM report_post WHERE usernameRenter = ? AND NOW() >= time"
        reports = connectDatabase.cursor.execute(query_str, usernameRenter, "yes").fetchval()
        connectDatabase.close()
        return {"views": views, "favorites": favorites, "reviews": reviews, "reports": reports}
        
    def handleAddressSearch(self, stringSearch, limit):
        stringSearch = stringSearch.title()
        connectDatabase = ConnectDatabase()
        query_str = """
            SELECT DISTINCT(province) address, MATCH(province) AGAINST (?) + 5 score, 1 type FROM address
            UNION SELECT DISTINCT(CONCAT(province, ", ", district)) address, MATCH(province, district) AGAINST (?) + 3 score, 2 type FROM address
            UNION SELECT CONCAT(province, ", ", district, ", ", ward), MATCH(province, district, ward) AGAINST (?) score, 3 type FROM address
            ORDER BY SCORE DESC LIMIT ?
            """
        rows = connectDatabase.cursor.execute(query_str, stringSearch, stringSearch, stringSearch, limit).fetchall()
        return [{"address": row.address, "score": row.score, "type": row.type} for row in rows]
    
    def fuzzywuzzySearch(self, stringSearch, limit = 1):
        data = []
        stringSearch = stringSearch.title()
        connectDatabase = ConnectDatabase()

        # find province
        query_str = "SELECT DISTINCT(province) FROM address"
        for row in connectDatabase.cursor.execute(query_str).fetchall():
            score = fuzz.token_set_ratio(stringSearch, row.province)
            if score > 70:
                data.append({"address": row.province, "score": score})

        # find district
        query_str = """SELECT DISTINCT(CONCAT(district, ", ", province)) address FROM address"""
        for row in connectDatabase.cursor.execute(query_str).fetchall():
            score = fuzz.token_set_ratio(stringSearch, row.address)
            if score > 70:
                data.append({"address": row.address, "score": score})

        # find ward
        # query_str = """SELECT CONCAT(ward, ", ", district, ", ", province) address FROM address"""
        # for row in connectDatabase.cursor.execute(query_str).fetchall():
        #     score = fuzz.token_set_ratio(stringSearch, row.address)
        #     if score > 70:
        #         data.append({"address": row.address, "score": score})
        connectDatabase.close()
        if data != []:
            if limit == 1:
                data.sort(reverse=True, key=lambda row: (row["score"], len(row["address"])))
            else:
                data.sort(reverse=True, key=lambda row: (row["score"]))
        if len(data) > limit:
            data = data[:limit]
        return data

    def saveHistorySearch(self, addressSearch, usernameRenter):
        connectDatabase = ConnectDatabase()
        query_str = """
            INSERT INTO history_search(addressSearch, usernameRenter)
            VALUES(?, ?)
            """
        connectDatabase.cursor.execute(query_str, addressSearch, usernameRenter)
        connectDatabase.connection.commit()
        connectDatabase.close()
        