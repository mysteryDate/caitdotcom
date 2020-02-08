from __future__ import print_function
import pickle
import os.path
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.http import MediaIoBaseDownload
import io
import json

# If modifying these scopes, delete the file token.pickle.
SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']
# For the drive auth, delete token-drive.pickle if changing
DRIVE_SCOPES = ['https://www.googleapis.com/auth/drive']

# The ID and range of a sample spreadsheet.
SAMPLE_SPREADSHEET_ID = '1dlaWXhgQ1O1Mc9qkUiRA0OfEgT-OsqrYatltgypJJvU'
SAMPLE_RANGE_NAME = 'Sheet1!A1:G'

# An array of dicts that we will output to json
portfolio_data = []

def main():
    """Shows basic usage of the Sheets API.
    Prints values from a sample spreadsheet.
    """
    creds = None
    # The file token.pickle stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)

    service = build('sheets', 'v4', credentials=creds)

    # Call the Sheets API
    sheet = service.spreadsheets()
    result = sheet.values().get(spreadsheetId=SAMPLE_SPREADSHEET_ID,
                                range=SAMPLE_RANGE_NAME).execute()
    values = result.get('values', [])

    if not values:
        print('No data found.')
    else:
        headers = values[0]
        for row in values[1:]:
            entry = {headers[x]: row[x] for x in range(len(row))}
            portfolio_data.append(entry)

    # Authenticate with drive
    drive_creds = None
    if os.path.exists('token-drive.pickle'):
        with open('token-drive.pickle', 'rb') as token:
            drive_creds = pickle.load(token)
    # If there are no (valid) credentials available, let the user log in.
    if not drive_creds or not drive_creds.valid:
        if drive_creds and drive_creds.expired and drive_creds.refresh_token:
            drive_creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials-drive.json', DRIVE_SCOPES)
            drive_creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open('token-drive.pickle', 'wb') as token:
            pickle.dump(drive_creds, token)

    service = build('drive', 'v3', credentials=drive_creds)
    for entry in portfolio_data:
        if "photo-link" in entry.keys():
            photo_link = entry["photo-link"]
            file_id = photo_link.split('/d/')[1].split('/')[0]
            photo_file = service.files().get(fileId=file_id).execute()
            photo_name = photo_file['name']
            request = service.files().get_media(fileId=file_id)
            fh = io.BytesIO()
            downloader = MediaIoBaseDownload(fh, request)
            done = False
            entry['image'] = photo_name
            file_path = "images/{}".format(photo_name)
            if os.path.isfile(file_path):
                print("Skipping {name}.".format(name=photo_name)) 
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