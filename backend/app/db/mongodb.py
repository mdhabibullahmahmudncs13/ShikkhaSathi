from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class MongoDB:
    client: AsyncIOMotorClient = None
    database = None

mongodb = MongoDB()

async def connect_to_mongo():
    """Create database connection"""
    try:
        mongodb.client = AsyncIOMotorClient(
            settings.MONGODB_URL,
            serverSelectionTimeoutMS=5000  # 5 second timeout
        )
        # Test the connection
        await mongodb.client.admin.command('ping')
        mongodb.database = mongodb.client[settings.MONGODB_DB_NAME]
        logger.info("MongoDB connected successfully")
    except Exception as e:
        logger.warning(f"MongoDB connection failed: {e}. Using mongomock for development.")
        try:
            from mongomock_motor import AsyncMongoMockClient
            mongodb.client = AsyncMongoMockClient()
            mongodb.database = mongodb.client[settings.MONGODB_DB_NAME]
            logger.info("Using mongomock in-memory database")
        except ImportError:
            logger.error("mongomock-motor not installed. Install with: pip install mongomock-motor")
            raise

async def close_mongo_connection():
    """Close database connection"""
    if mongodb.client:
        mongodb.client.close()

def get_mongodb():
    return mongodb.database