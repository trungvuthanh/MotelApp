from models.user import User
from models.connectDatabase import ConnectDatabase
from datetime import datetime
from fuzzywuzzy import fuzz
from fuzzywuzzy import process

connectDatabase = ConnectDatabase()
query_str = """
    SELECT DISTINCT(addressDetail) FROM renter
    """
rows = connectDatabase.cursor.execute(query_str).fetchall()
for row in rows:
    query_str = """
        UPDATE renter SET addressDetail = ? WHERE addressDetail = ?
        """
    connectDatabase.cursor.execute(query_str, row.addressDetail, row.addressDetail)
    connectDatabase.connection.commit()

# query_str = """
#     SELECT DISTINCT(province) FROM address WHERE province = ?
#     """
# province = "Hà Nội"
# print(connectDatabase.cursor.execute(query_str, province).fetchval() == province)
# province = "Hà Nam"
# print(connectDatabase.cursor.execute(query_str, province).fetchval() == province)
# province = "Hồ Chí Minh"
# print(connectDatabase.cursor.execute(query_str, province).fetchval() == province)
    