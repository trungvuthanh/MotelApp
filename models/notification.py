from models.connectDatabase import ConnectDatabase
from datetime import datetime, timedelta

class Notification:
    def __init__(self):
        pass
    # createPost, editPost (sửa/trạng thái thuê), extendPost, signUpAccount, editAccount, comment, reportPost
    # (report, post, account)
    
    def create(self, titleNotification, usernameReceiver, icon, content):
        connectDatabase = ConnectDatabase()
        query_str = """
            INSERT INTO notification(titleNotification, usernameReceiver, icon, content, time) 
            VALUES (?, ?, ?, ?, ?)
            """
        connectDatabase.cursor.execute(query_str, titleNotification, usernameReceiver, icon, content, datetime.now())
        connectDatabase.connection.commit()
        connectDatabase.close()
    
    def readNotification(self, idNotification):
        connectDatabase = ConnectDatabase()
        query_str = "UPDATE notification SET status = ? WHERE id = ?"
        connectDatabase.cursor.execute(query_str, "read", idNotification)
        connectDatabase.connection.commit()
        connectDatabase.close()        
        
    def readAllNotifications(self, username):
        connectDatabase = ConnectDatabase()
        query_str = "UPDATE notification SET status = ? WHERE usernameReceiver = ?"
        connectDatabase.cursor.execute(query_str, "read", username)
        connectDatabase.connection.commit()
        connectDatabase.close()
    
    def getAllNotifications(self, username):
        connectDatabase = ConnectDatabase()
        query_str = """
            SELECT id, titleNotification, icon, content, time, status
            FROM notification
            WHERE usernameReceiver = ?
            ORDER BY time DESC 
            LIMIT 10
            """
        rows = connectDatabase.cursor.execute(query_str, username).fetchall()
        connectDatabase.close()
        return [{"id": row.id, "titleNotification": row.titleNotification, "icon": row.icon, "content": row.content, "time": row.time, "status": row.status} for row in rows]
    
    