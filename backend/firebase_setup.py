import firebase_admin
from firebase_admin import credentials, firestore
import os

def initialize_firebase():
    if not firebase_admin._apps:
        # Use default credentials (GOOGLE_APPLICATION_CREDENTIALS)
        cred = credentials.ApplicationDefault()
        firebase_admin.initialize_app(cred, {
            'projectId': os.getenv('GOOGLE_CLOUD_PROJECT'),
            'storageBucket': os.getenv('GOOGLE_CLOUD_STORAGE_BUCKET')
        })

    return firestore.client()

db = initialize_firebase()
