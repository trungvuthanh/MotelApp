from datetime import datetime, timedelta
from models.connectDatabase import ConnectDatabase

class Chat:
    def __init__(self):
        pass
    
    def sendMessage(self, content, usernameOwner, ownerSend="true"):
        connectDatabase = ConnectDatabase()
        query_str = """
            INSERT INTO chat(usernameOwner, ownerSend, content) 
            VALUES (?, ?, ?)
            """
        connectDatabase.cursor.execute(query_str, usernameOwner, ownerSend, content)
        connectDatabase.connection.commit()
        connectDatabase.close()
    
    def getMessages(self, chatTo, author="admin", numberPage=1):
        connectDatabase = ConnectDatabase()
        # cập nhật tất cả tin chưa đọc chatTo gửi đên author sang đã đọc
        # author: admin hoặc username của owner
        query_str = """
            UPDATE chat
            SET status = ?
            WHERE usernameOwner = ? AND ownerSend = ? and status = ?
            """
        usernameOwner = chatTo
        if author == "admin":
            # quản trị viên đọc tin nhắn của chatTo gửi đến
            connectDatabase.cursor.execute(query_str, "read", chatTo, "true", "unread")
        else:
            # chatTo = "admin"
            # chủ trọ đọc các tin nhắn từ quản trị viên, author: usernameOwner
            connectDatabase.cursor.execute(query_str, "read", author, "false", "unread")
            usernameOwner = author
        connectDatabase.connection.commit()
        
        # lấy tin nhắn
        query_str = """
            SELECT id, usernameOwner, ownerSend, time, content, status
            FROM chat
            WHERE usernameOwner = ?
            ORDER BY time DESC
            LIMIT 20 OFFSET ?
            """
        rows = connectDatabase.cursor.execute(query_str, usernameOwner, (numberPage - 1)*20).fetchall()
        connectDatabase.close()
        
        temp = "false" if author == "admin" else "true"
        
        return [{"id": row.id, "time": str(row.time), "content": row.content, "status": row.status, "isMe": (row.ownerSend == temp)} for row in rows]
    
    def getListChatRecentsOfAdmin(self):
        connectDatabase = ConnectDatabase()
        query_str = """
            SELECT DISTINCT(usernameOwner), ownerSend, content, chat.status, fullname, time
            FROM chat
            JOIN owner ON chat.usernameOwner = owner.username
            WHERE time IN (
                SELECT MAX(time) FROM chat c WHERE c.usernameOwner = usernameOwner GROUP BY c.usernameOwner
            )
            """
        rows = connectDatabase.cursor.execute(query_str).fetchall()
        connectDatabase.close()
        
        return [{"usernameOwner": row.usernameOwner, "isMe": (row.ownerSend == "false"), "time": str(row.time), "content": row.content, "status": row.status, "fullname": row.fullname} for row in rows]
    