from __future__ import print_function
import pickle
import os.path
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from google.oauth2.service_account import Credentials
from googleapiclient.http import MediaIoBaseDownload
import io
import json

# The ID and range of a sample spreadsheet.
CREDENTIALS_FILE = "caitdotcom-06c816441973.json"
SPREADSHEET_ID = '1dlaWXhgQ1O1Mc9qkUiRA0OfEgT-OsqrYatltgypJJvU'
RANGE_NAME = 'Sheet1!A1:G'

# An array of dicts that we will output to json
portfolio_data = []

def main():
    creds = None
    creds = Credentials.from_service_account_file(CREDENTIALS_FILE,
                                                      scopes=['https://www.googleapis.com/auth/spreadsheets.readonly',
                                                                  'https://www.googleapis.com/auth/drive.readonly'])
    service = build('sheets', 'v4', credentials=creds)

    # Call the Sheets API
    sheet = service.spreadsheets()
    result = sheet.values().get(spreadsheetId=SPREADSHEET_ID,
                                range=RANGE_NAME).execute()
    values = result.get('values', [])

    if not values:
        print('No data found.')
    else:
        headers = values[0]
        for row in values[1:]:
            entry = {headers[x]: row[x] for x in range(len(row))}
            portfolio_data.append(entry)

    drive_service = build('drive', 'v3', credentials=creds)
    for entry in portfolio_data:
        if "photo-link" in entry.keys() and entry["photo-link"]:
            photo_link = entry["photo-link"]
            try:
              file_id = photo_link.split('/d/')[1].split('/')[0]
            except Exception as e:
              print(e)
              print(entry)
              continue
            photo_file = {}
            try:
                photo_file = drive_service.files().get(fileId=file_id).execute()
            except Exception as e:
                print(e)
                print(entry)
                continue
            photo_name = photo_file['name']
            request = drive_service.files().get_media(fileId=file_id)
            fh = io.BytesIO()
            downloader = MediaIoBaseDownload(fh, request)
            done = False
            entry['image'] = photo_name
            file_path = "images/{}".format(photo_name)
            if os.path.isfile(file_path):
                # print("Skipping {name}.".format(name=photo_name))
                continue
            while done is False:
                status, done = downloader.next_chunk()
                print("Downloading {name}.".format(name=photo_name))
            with io.open(file_path, 'wb') as photo_file:
                fh.seek(0)
                photo_file.write(fh.read())

    with open("portfolio-data.json", "w") as portfolio_data_file:
        portfolio_data_file.write(json.dumps(portfolio_data, indent=4))

if __name__ == '__main__':
    main()
