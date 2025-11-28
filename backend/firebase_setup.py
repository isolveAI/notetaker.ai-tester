import firebase_admin
from firebase_admin import credentials, firestore
import os

_db_client = None

def get_db():
    global _db_client
    if _db_client is None:
        if not firebase_admin._apps:
            # Use default credentials if not already initialized
            cred = credentials.ApplicationDefault()
            firebase_admin.initialize_app(cred, {
                'projectId': os.getenv('GOOGLE_CLOUD_PROJECT'),
                'storageBucket': os.getenv('GOOGLE_CLOUD_STORAGE_BUCKET')
            })
        _db_client = firestore.client()
    return _db_client
