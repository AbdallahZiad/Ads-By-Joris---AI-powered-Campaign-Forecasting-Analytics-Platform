import logging
import time
from sqlalchemy import text
from sqlmodel import Session
from app.core.db import engine

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def check_db_connection() -> bool:
    """
    Attempts to create a session and execute a simple query.
    Returns True if successful, False if the DB is unreachable.
    """
    try:
        with Session(engine) as session:
            # Try to execute a simple keep-alive query
            session.exec(text("SELECT 1"))
        return True
    except Exception as e:
        # We log strictly as a warning because this is expected behavior
        # during the first few seconds of container startup.
        logger.warning(f"Database not ready yet... Waiting. (Error: {e})")
        return False

def main() -> None:
    logger.info("--- Checking Database Connection ---")

    # Retry Loop
    while True:
        if check_db_connection():
            break
        # Wait 1 second before retrying to prevent CPU thrashing
        time.sleep(1)

    logger.info("--- Database Connection Established! ---")

if __name__ == "__main__":
    main()