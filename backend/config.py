from dotenv import load_dotenv, find_dotenv
import os

load_dotenv(find_dotenv())


class TestingConfig:
    JWT_KEY = os.getenv("JWT_KEY")
    URL_DATABASE = os.getenv("URL_DATABASE")
    ORIGIN_URL = os.getenv("ORIGIN_URL")
    SECURE = False


environments = {"testing": TestingConfig}


config = environments[os.getenv("ENVIRONMENT")]
