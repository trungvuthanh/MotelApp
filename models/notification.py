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
        