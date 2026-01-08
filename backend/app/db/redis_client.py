import redis.asyncio as redis
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

class RedisClient:
    client: redis.Redis = None

redis_client = RedisClient()

async def connect_to_redis():
    """Create Redis connection"""
    try:
        redis_client.client = redis.from_url(
            settings.REDIS_URL, 
            decode_responses=True,
            socket_connect_timeout=5
        )
        # Test the connection
        await redis_client.client.ping()
        logger.info("Redis connected successfully")
    except Exception as e:
        logger.warning(f"Redis connection failed: {e}. Using fakeredis for development.")
        try:
            import fakeredis.aioredis
            redis_client.client = fakeredis.aioredis.FakeRedis(decode_responses=True)
            logger.info("Using fakeredis in-memory database")
        except ImportError:
            logger.error("fakeredis not installed. Install with: pip install fakeredis")
            raise

async def close_redis_connection():
    """Close Redis connection"""
    if redis_client.client:
        await redis_client.client.close()

def get_redis():
    return redis_client.client