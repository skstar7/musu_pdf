from __future__ import annotations

import re
from typing import List


def parse_page_ranges(range_expr: str, total_pages: int) -> List[int]:
    if not range_expr:
        raise ValueError("Page range expression is required")

    result: list[int] = []
    parts = [part.strip() for part in range_expr.split(",") if part.strip()]
    for part in parts:
        if re.fullmatch(r"\d+", part):
            page = int(part)
            _assert_valid_page(page, total_pages)
            result.append(page)
            continue

        match = re.fullmatch(r"(\d+)-(\d+)", part)
        if not match:
            raise ValueError(f"Invalid range token: {part}")

        start = int(match.group(1))
        end = int(match.group(2))
        if start > end:
            raise ValueError(f"Invalid range order: {part}")

        for page in range(start, end + 1):
            _assert_valid_page(page, total_pages)
            result.append(page)

    deduped: list[int] = []
    seen: set[int] = set()
    for page in result:
        if page not in seen:
            seen.add(page)
            deduped.append(page)
    return deduped


def parse_page_order(order: str, total_pages: int) -> List[int]:
    if not order:
        return list(range(1, total_pages + 1))

    numbers = [int(token.strip()) for token in order.split(",") if token.strip()]
    if not numbers:
        raise ValueError("Page order cannot be empty")

    for page in numbers:
        _assert_valid_page(page, total_pages)

    return numbers


def _assert_valid_page(page: int, total_pages: int) -> None:
    if page < 1 or page > total_pages:
        raise ValueError(f"Page {page} out of bounds (1-{total_pages})")


def as_int(value: object, default: int) -> int:
    try:
        return int(value)
    except Exception:
        return default


def as_float(value: object, default: float) -> float:
    try:
        return float(value)
    except Exception:
        return default


def as_str(value: object, default: str = "") -> str:
    if value is None:
        return default
    return str(value)
