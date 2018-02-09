#---------------------------------------------------------

# Description: Script to transfer historical data set into
#              MongoDB.
# Author: Shannon W.
# Related Task: *
#---------------------------------------------------------

# Python version 3+
# Ensure to have pymongo installed -- python3 -m pip3 install pymongo
from pymongo import MongoClient

client = MongoClient(port=27017)
db = client.PHF     # PA History Finder Database

# Function to read file called filename
# ensure the file is in current working directory or simply pass the full file path
def readFile(filename):
    linenum = 0

    with open(filename) as f:
        for line in f:

            if linenum == 0:    # skip the first line that contains the column headers
                linenum += 1
                continue
            else:
                c = line.strip('\n').split('\t')

                # construct document object to insert into PHF collection named markers
                marker = {
                    'Historical_Marker_Id': c[0],
                    'Name_of_the_Marker': f'{c[1]}',
                    'County': f'{c[2]}',
                    'Dedicated_Year': c[3],
                    'Dedicated_Month': c[4],
                    'Dedicated_Day_Date': c[5],
                    'Marker_Type': f'{c[6]}',
                    'Location_Description': f'{c[7]}',
                    'Marker_Description': f'{c[8]}',
                    'Status': f'{c[9]}',
                    'Longitude': c[10],
                    'Latitude': c[11],
                    'Category': f'{c[12]}',
                    'Category_Counter': f'{c[13]}',
                    'LAT/LONG_Location': f'{c[14]}'
                }

                # enter into markers collection
                result = db.markers.insert_one(marker)
                print(f'Inserted record with objectid: {result.inserted_id} successfully')
    print('Data Transfer Successful !')


readFile("Pennsylvania_Historical_Markers__Historical_and_Museum_Commission.tsv")
