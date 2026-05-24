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
    'https://www.googleapis.com/auth/gmail.readonly'
]


# CLEAN HTML TAGS
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

    # DIRECT BODY
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

    # PARTS
    parts = payload.get('parts')

    if parts:

        for part in parts:

            mime = part.get('mimeType')

            # PLAIN TEXT
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

            # HTML EMAIL
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

            # NESTED PARTS
            elif part.get('parts'):

                nested_body = extract_body(part)

                if nested_body:

                    return nested_body

    return body


# FETCH EMAILS WITH PAGINATION
@app.route('/emails', methods=['GET'])
def get_emails():

    try:

        page_token = request.args.get(
            'pageToken'
        )

        auth_header = request.headers.get(
            "Authorization"
        )

        if not auth_header:

            return jsonify({
                "error":
                    "No authorization header found"
            }), 401

        token = auth_header.split(
            " "
        )[1]

        creds = Credentials(
            token=token
        )

        service = build(
            'gmail',
            'v1',
            credentials=creds
        )

        # LIGHTWEIGHT FETCH
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

            # FAST METADATA FETCH
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

            # SUBJECT + SENDER
            for header in headers:

                if header['name'] == 'Subject':

                    subject = header['value']

                if header['name'] == 'From':

                    sender = header['value']

            # USE GMAIL SNIPPET
            snippet = msg.get(
                'snippet',
                'No Preview Available'
            )

            # FULL TEXT
            full_text = (
                subject +
                " " +
                snippet
            )

            # GMAIL LABELS
            label_ids = msg.get(
                'labelIds',
                []
            )

            # DEFAULT
            category = "general"

            confidence = 85

            # GMAIL SOCIAL
            if 'CATEGORY_SOCIAL' in label_ids:

                category = "social"

                confidence = 99

            # GMAIL PROMOTIONS
            elif 'CATEGORY_PROMOTIONS' in label_ids:

                category = "promotions"

                confidence = 99

            # HYBRID SPAM
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

            # STORE EMAIL
            email_data.append({

                "id": message['id'],

                "subject": subject,

                "sender": sender,

                "snippet": snippet,

                "category": category,

                "confidence":
                    str(confidence) + "%"

            })

        return jsonify({

            "emails": email_data,

            "nextPageToken":
                next_page_token

        })

    except Exception as e:

        return jsonify({

            "error": str(e)

        })


# FETCH FULL EMAIL ON CLICK
@app.route('/email/<email_id>', methods=['GET'])
def get_single_email(email_id):

    try:

        auth_header = request.headers.get(
            "Authorization"
        )

        if not auth_header:

            return jsonify({
                "error":
                    "No authorization header found"
            }), 401

        token = auth_header.split(
            " "
        )[1]

        creds = Credentials(
            token=token
        )

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

            "confidence":
                str(confidence) + "%"

        })

    except Exception as e:

        return jsonify({

            "error": str(e)

        })


# MANUAL EMAIL ANALYSIS
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

            "confidence":
                str(confidence) + "%"

        })

    except Exception as e:

        return jsonify({

            "error": str(e)

        })


# HOME ROUTE
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