import hashlib
import hmac
import json
import os
import time
from typing import Tuple

import httpx


def get_cert_webhook_config() -> Tuple[str | None, str]:
    url = os.getenv("CERT_WEBHOOK_URL")
    secret = os.getenv("CERT_WEBHOOK_SECRET", "dev_cert_secret")
    return url, secret


def _compute_signature(message: bytes, secret: str) -> str:
    mac = hmac.new(secret.encode("utf-8"), msg=message, digestmod=hashlib.sha256)
    return mac.hexdigest()


def build_signature_headers(payload_bytes: bytes, secret: str, timestamp: int | None = None) -> dict:
    ts = int(timestamp or time.time())
    to_sign = f"{ts}.".encode("utf-8") + payload_bytes
    digest_hex = _compute_signature(to_sign, secret)
    return {"X-CERT-Signature": f"t={ts},v1={digest_hex}"}


def verify_signature(header_value: str, payload_bytes: bytes, secret: str, tolerance_seconds: int = 300) -> bool:
    try:
        parts = dict(part.split("=", 1) for part in header_value.split(","))
        ts = int(parts.get("t", "0"))
        v1 = parts.get("v1", "")
    except Exception:
        return False

    if abs(time.time() - ts) > tolerance_seconds:
        return False

    expected = _compute_signature(f"{ts}.".encode("utf-8") + payload_bytes, secret)
    try:
        return hmac.compare_digest(expected, v1)
    except Exception:
        return False


async def post_cert_webhook(payload: dict, *, url: str | None = None, secret: str | None = None, timeout_seconds: float = 5.0) -> tuple[int, str]:
    configured_url, configured_secret = get_cert_webhook_config()
    target_url = url or configured_url or "http://nginx/api/v1/cert/ingest"
    signing_secret = secret or configured_secret

    data = json.dumps(payload, separators=(",", ":")).encode("utf-8")
    headers = {
        "Content-Type": "application/json",
        **build_signature_headers(data, signing_secret),
    }

    async with httpx.AsyncClient(timeout=timeout_seconds) as client:
        resp = await client.post(target_url, content=data, headers=headers)
        return resp.status_code, resp.text


