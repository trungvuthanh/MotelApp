from models.user import User
from models.connectDatabase import ConnectDatabase
from datetime import datetime

query_str = """
    UPDATE post SET totalFavorite = (
        SELECT COUNT(*) FROM favorite_post WHERE favorite_post.idPost = ? AND DATEDIFF(NOW(), favorite_post.time) >= 0
    ) WHERE idPost = ?
    """
connectDatabase = ConnectDatabase()
for i in range(1, 801):
    connectDatabase.cursor.execute(query_str, i, i)
    connectDatabase.connection.commit()
connectDatabase.close()