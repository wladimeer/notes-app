from config import config
from jwt.exceptions import DecodeError, ExpiredSignatureError
from datetime import datetime, timedelta
from schemas.user import UserBase
from jwt import encode, decode
import utils.constants as constants
import pytz


def generate_token(user: UserBase, is_refresh_token=False) -> str:
    time_zones = pytz.country_timezones[constants.ISO2_CODE_CHILE]
    time_zone = pytz.timezone(time_zones[0])
    current_time = datetime.now(tz=time_zone)

    payload = {
        "user_id": user.id,
        "sub": user.username,
        "pss": user.password,
        "tz": time_zones[0],
    }

    if is_refresh_token:
        payload.update(
            {"exp": current_time + timedelta(days=constants.TOKEN_DAYS_EXPIRATION)}
        )
    else:
        payload.update(
            {
                "exp": current_time
                + timedelta(minutes=constants.TOKEN_MINUTES_EXPIRATION)
            }
        )

    return encode(payload, config.JWT_KEY, algorithm="HS256")


def verify_token(token) -> bool:
    is_authorized = True

    try:
        decode(token, config.JWT_KEY, algorithms=["HS256"])

    except DecodeError:
        is_authorized = False
    except ExpiredSignatureError:
        is_authorized = False

    return is_authorized


def get_token_data(token) -> dict:
    try:
        return decode(token, config.JWT_KEY, algorithms=["HS256"])
    except Exception:
        return {}
