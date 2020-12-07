from models.user import User
from models.connectDatabase import ConnectDatabase
from datetime import datetime

query_str = """
    SELECT * FROM owner LIMIT 10 OFFSET 10
    """
connectDatabase = ConnectDatabase()
rows = connectDatabase.cursor.execute(query_str)
count = rows.rowcount
print(count)
for x in rows:
    print(x)