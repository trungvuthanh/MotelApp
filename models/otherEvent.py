from models.connectDatabase import ConnectDatabase

class OtherEvent:
    def __init__(self):
        pass
    
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
                SELECT COUNT(*) FROM history_view WHERE history_view.idPost = ? AND DATEDIFF(NOW(), history_view.time) >= 0
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
                SELECT COUNT(*) FROM history_view WHERE history_view.idPost = ? AND DATEDIFF(NOW(), history_view.time) >= 0
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
            WHERE idPost = ? AND usernameRenter = ? AND DATEDIFF(NOW(), favorite_post.time) >= 0
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
                WHERE favorite_post.idPost = ? AND DATEDIFF(NOW(), favorite_post.time) >= 0 AND favorite_post.status = ?
            ) WHERE idPost = ?
            """
        connectDatabase = ConnectDatabase()
        connectDatabase.cursor.execute(query_str, idPost, "yes")
        connectDatabase.connection.commit()
        connectDatabase.close()       
        
    def updateTotalFavoriteDefault(self):    
        # update totalView()
        query_str = """
            UPDATE post SET totalFavorite = (
                SELECT COUNT(*) 
                FROM favorite_post 
                WHERE favorite_post.idPost = ? AND DATEDIFF(NOW(), favorite_post.time) >= 0 AND favorite_post.status = ?
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
        connectDatabase.close()
    
    def adminGetAllReport(self):
        query_str = """
            SELECT id, idPost, fakeInfo, fakePrice, usernameRenter, content, time 
            FROM report_post 
            WHERE status = ? AND DATEDIFF(NOW(), time) >= 0
            """
        connectDatabase = ConnectDatabase()
        rows = connectDatabase.cursor.execute(query_str, "handling").fetchall()
        connectDatabase.close()
        return [{"id": row.id, "idPost": row.idPost, "fakeInfo": row.fakeInfo, "fakePrice": row.fakePrice, "usernameRenter": row.usernameRenter, "content": row.content, "time": str(row.time)} for row in rows]
    
    def getHistoryPost(self, usernameRenter):
        query_str = """
            SELECT id, DISTINCT(post.idPost), post.titlePost, post.priceItem, post.addressDetail, post.addressWard, post.addressDistrict, post.addressProvince
            FROM history_view
            JOIN post ON history_view.idPost = post.idPost
            WHERE usernameRenter = ? AND history_view.status = ?
            AND DATEDIFF(NOW(), history_view.time) >= 0
            ORDER BY history_view.time DESC
            """
        connectDatabase = ConnectDatabase()
        rows = connectDatabase.cursor.execute(query_str, usernameRenter, "yes").fetchall()
        connectDatabase.close()
        return [{"id": row.id, "idPost": row.idPost, "titlePost": row.titlePost, "priceItem": row.priceItem, "addressDetail": row.addressDetail, "addressWard": row.addressWard, "addressDistrict": row.addressDistrict, "addressProvince": row.addressProvince} for row in rows]
    
    def deleteHistoryPost(self, usernameRenter, idPost):
        query_str = """
            UPDATE history_view 
            SET status = ?
            WHERE usernameRenter = ? AND idPost = ? AND DATEDIFF(NOW(), time) >= 0 
            """
        connectDatabase = ConnectDatabase()
        connectDatabase.cursor.execute(query_str, "no", usernameRenter, idPost)
        connectDatabase.connection.commit()
        connectDatabase.close()
        
    def deleteAllHistoryPost(self, usernameRenter):
        query_str = """
            UPDATE history_view 
            SET status = ?
            WHERE usernameRenter = ? AND DATEDIFF(NOW(), time) >= 0 
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
                WHERE usernameRenter = ? AND AND status = ? AND DATEDIFF(NOW(), time) >= 0 
            )
            """
        connectDatabase = ConnectDatabase()
        rows = connectDatabase.cursor.execute(query_str, usernameRenter, "yes").fetchall()
        connectDatabase.close()
        return [{"idPost": row.idPost, "titlePost": row.titlePost, "priceItem": row.priceItem, "addressDetail": row.addressDetail, "addressWard": row.addressWard, "addressDistrict": row.addressDistrict, "addressProvince": row.addressProvince} for row in rows]
    
    def isFavoritePost(self, usernameRenter, idPost):
        query_str = """
            UPDATE favorite_post 
            SET status = ? 
            WHERE usernameRenter = ? AND idPost = ? AND DATEDIFF(NOW(), time) >= 0 AND time < (SELECT MAX(time) FROM favorite_post WHERE usernameRenter = ? AND idPost = ? AND status = ? AND DATEDIFF(NOW(), time) >= 0)
            """
        connectDatabase = ConnectDatabase()
        connectDatabase.cursor.execute(query_str, usernameRenter, "no", usernameRenter, idPost, usernameRenter, idPost, "yes")
        connectDatabase.connection.commit()
        query_str = """
            SELECT COUNT(*) FROM favorite_post WHERE usernameRenter = ? AND idPost = ? AND DATEDIFF(NOW(), time) >= 0 AND status = ?
            """
        val = connectDatabase.cursor.execute(query_str, usernameRenter, idPost, "yes").fetchval()
        connectDatabase.close()
        return {"isFavorite": val!=0}
    
    def unFavoritePost(self, usernameRenter, idPost):
        query_str = """
            UPDATE favorite_post 
            SET status = ? 
            WHERE usernameRenter = ? AND idPost = ? AND DATEDIFF(NOW(), time) >= 0 AND time < (SELECT MAX(time) FROM favorite_post WHERE usernameRenter = ? AND idPost = ? AND status = ? AND DATEDIFF(NOW(), time) >= 0)
            """
        connectDatabase = ConnectDatabase()
        connectDatabase.cursor.execute(query_str, usernameRenter, "no", usernameRenter, idPost, usernameRenter, idPost, "yes")
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
            SELECT COUNT(*) FROM posts WHERE usernameOwner = ? AND status = ?
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
        connectDatabase.close()
        return {"actives": actives, "handlings": handlings, "reports": reports, "blocks": blocks}