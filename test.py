from models.user import User
from models.connectDatabase import ConnectDatabase
from datetime import datetime, timedelta
from fuzzywuzzy import fuzz
from fuzzywuzzy import process
import time
import unidecode


start = datetime.date(datetime.strptime("2020-12-01", "%Y-%m-%d"))
end = datetime.date(datetime.now())


date_generated = [start + timedelta(days=x) for x in range(0, (end-start).days + 1)]




# from calendar import monthrange

# def allDays(y, m):
#     return ['{:04d}-{:02d}-{:02d}'.format(y, m, d) for d in range(1, monthrange(y, m)[1] + 1)]

# print(allDays(2020, 12))

# def string_no_accent(string):
#     return unidecode.unidecode(string)

# data = []

# stringSearch = "hà lội".title()
# connectDatabase = ConnectDatabase()

# # find province
# query_str = "SELECT DISTINCT(province) FROM address"
# for row in connectDatabase.cursor.execute(query_str).fetchall():
#     score = fuzz.token_set_ratio(stringSearch, row.province)
#     if score > 70:
#         data.append({"address": row.province, "score": score})

# # find district
# query_str = """SELECT DISTINCT(CONCAT(district, ", ", province)) address FROM address"""
# for row in connectDatabase.cursor.execute(query_str).fetchall():
#     score = fuzz.token_set_ratio(stringSearch, row.address)
#     if score > 70:
#         data.append({"address": row.address, "score": score})

# # find ward
# query_str = """
#     SELECT CONCAT(ward, ", ", district, ", ", province) address, CONCAT(ward, ", ", district) address1, ward 
#     FROM address
#     """
# for row in connectDatabase.cursor.execute(query_str).fetchall():
#     score = fuzz.token_set_ratio(stringSearch, row.address)
#     if score > 70:
#         data.append({"address": row.address, "score": score})

# if data != []:
#     data.sort(reverse=True, key=lambda row: row["score"])
# if len(data) > 5:
#     data = data[:5]
# print(data)