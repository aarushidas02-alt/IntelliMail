from flask import Flask, jsonify, request
from flask_cors import CORS
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

from spam import (
    predict_category,
    predict_confidence
)

import base64
import re

app = Flask(__name__)

CORS(app)

SCOPES = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/userinfo.email',
    'openid'
]


# CLEAN HTML
def clean_html(raw_html):

    clean_text = re.sub(
        '<.*?>',
        '',
        raw_html
    )

    return clean_text


# EXTRACT EMAIL BODY
def extract_body(payload):

    body = ""

    if 'body' in payload:

        data = payload['body'].get('data')

        if data:

            try:

                body = base64.urlsafe_b64decode(
                    data
                ).decode(
                    'utf-8',
                    errors='ignore'
                )

                return clean_html(body)

            except:

                pass

    parts = payload.get('parts')

    if parts:

        for part in parts:

            mime = part.get('mimeType')

            if mime == 'text/plain':

                data = part['body'].get('data')

                if data:

                    try:

                        body = base64.urlsafe_b64decode(
                            data
                        ).decode(
                            'utf-8',
                            errors='ignore'
                        )

                        return body

                    except:

                        pass

            elif mime == 'text/html':

                data = part['body'].get('data')

                if data:

                    try:

                        body = base64.urlsafe_b64decode(
                            data
                        ).decode(
                            'utf-8',
                            errors='ignore'
                        )

                        return clean_html(body)

                    except:

                        pass

            elif part.get('parts'):

                nested_body = extract_body(part)

                if nested_body:

                    return nested_body

    return body


# GET TOKEN FROM HEADER
def get_credentials():

    auth_header = request.headers.get(
        "Authorization"
    )

    if not auth_header:

        return None, jsonify({
            "error":
                "No authorization header found"
        }), 401

    try:

        token = auth_header.split(
            " "
        )[1]

    except:

        return None, jsonify({
            "error":
                "Invalid authorization format"
        }), 401

    creds = Credentials(
        token=token
    )

    return creds, None, None


# FETCH EMAILS
@app.route('/emails', methods=['GET'])
def get_emails():

    try:

        creds, error_response, status = get_credentials()

        if error_response:

            return error_response, status

        page_token = request.args.get(
            'pageToken'
        )

        service = build(
            'gmail',
            'v1',
            credentials=creds
        )

        results = service.users().messages().list(
            userId='me',
            maxResults=15,
            pageToken=page_token
        ).execute()

        messages = results.get(
            'messages',
            []
        )

        next_page_token = results.get(
            'nextPageToken',
            None
        )

        email_data = []

        for message in messages:

            msg = service.users().messages().get(
                userId='me',
                id=message['id'],
                format='metadata',
                metadataHeaders=[
                    'Subject',
                    'From'
                ]
            ).execute()

            payload = msg['payload']

            headers = payload.get(
                'headers',
                []
            )

            subject = "No Subject"

            sender = "Unknown Sender"

            for header in headers:

                if header['name'] == 'Subject':

                    subject = header['value']

                if header['name'] == 'From':

                    sender = header['value']

            snippet = msg.get(
                'snippet',
                'No Preview Available'
            )

            full_text = (
                subject +
                " " +
                snippet
            )

            label_ids = msg.get(
                'labelIds',
                []
            )

            category = "general"

            confidence = 85

            if 'CATEGORY_SOCIAL' in label_ids:

                category = "social"

                confidence = 99

            elif 'CATEGORY_PROMOTIONS' in label_ids:

                category = "promotions"

                confidence = 99

            elif 'SPAM' in label_ids:

                category = "spam"

                confidence = 99

            else:

                ml_category = predict_category(
                    full_text
                )

                confidence = predict_confidence(
                    full_text
                )

                category = ml_category

            email_data.append({

                "id": message['id'],
                "subject": subject,
                "sender": sender,
                "snippet": snippet,
                "category": category,
                "confidence": str(confidence) + "%"

            })

        return jsonify({

            "emails": email_data,
            "nextPageToken": next_page_token

        })

    except Exception as e:

        return jsonify({

            "error": str(e)

        }), 500


# FETCH SINGLE EMAIL
@app.route('/email/<email_id>', methods=['GET'])
def get_single_email(email_id):

    try:

        creds, error_response, status = get_credentials()

        if error_response:

            return error_response, status

        service = build(
            'gmail',
            'v1',
            credentials=creds
        )

        msg = service.users().messages().get(
            userId='me',
            id=email_id
        ).execute()

        payload = msg['payload']

        headers = payload.get(
            'headers',
            []
        )

        subject = "No Subject"

        sender = "Unknown Sender"

        for header in headers:

            if header['name'] == 'Subject':

                subject = header['value']

            if header['name'] == 'From':

                sender = header['value']

        body = extract_body(payload)

        body = body.strip()

        if body == "":

            body = "No email content found."

        full_text = (
            subject +
            " " +
            body
        )

        category = predict_category(
            full_text
        )

        confidence = predict_confidence(
            full_text
        )

        return jsonify({

            "subject": subject,
            "sender": sender,
            "body": body,
            "category": category,
            "confidence": str(confidence) + "%"

        })

    except Exception as e:

        return jsonify({

            "error": str(e)

        }), 500


# MANUAL ANALYSIS
@app.route('/analyze', methods=['POST'])
def analyze_email():

    try:

        data = request.json

        text = data.get("text")

        category = predict_category(
            text
        )

        confidence = predict_confidence(
            text
        )

        return jsonify({

            "prediction": category,
            "confidence": str(confidence) + "%"

        })

    except Exception as e:

        return jsonify({

            "error": str(e)

        }), 500


# HOME
@app.route('/')
def home():

    return jsonify({

        "message":
            "IntelliMail Backend Running"

    })


# RUN SERVER
if __name__ == '__main__':

    app.run(

        host='0.0.0.0',
        port=5000,
        debug=True

    )