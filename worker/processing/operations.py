from __future__ import annotations

import io
import zipfile
from pathlib import Path
from typing import Any, Dict, List

import fitz
from PIL import Image
from pypdf import PdfReader, PdfWriter

from .utils import as_float, as_int, as_str, parse_page_order, parse_page_ranges


def process_operation(operation: str, input_files: List[str], output_file: str, config: Dict[str, Any]) -> None:
    op = operation.strip().lower()

    if op == "merge-pdf":
        merge_pdf(input_files, output_file)
        return
    if op == "split-pdf" or op == "extract-pages":
        split_pdf(input_files, output_file, config)
        return
    if op == "compress-pdf":
        compress_pdf(input_files, output_file, config)
        return
    if op == "rotate-pdf":
        rotate_pdf(input_files, output_file, config)
        return
    if op == "jpg-to-pdf":
        jpg_to_pdf(input_files, output_file)
        return
    if op == "pdf-to-jpg":
        pdf_to_jpg(input_files, output_file, config)
        return
    if op == "organize-pdf":
        organize_pdf(input_files, output_file, config)
        return
    if op == "protect-pdf":
        protect_pdf(input_files, output_file, config)
        return
    if op == "unlock-pdf":
        unlock_pdf(input_files, output_file, config)
        return
    if op == "add-watermark":
        add_text_watermark(input_files, output_file, config)
        return

    raise ValueError(f"Unsupported operation: {operation}")


def merge_pdf(input_files: List[str], output_file: str) -> None:
    writer = PdfWriter()
    for path in input_files:
        writer.append(path)

    with open(output_file, "wb") as fp:
        writer.write(fp)


def split_pdf(input_files: List[str], output_file: str, config: Dict[str, Any]) -> None:
    source = input_files[0]
    reader = PdfReader(source)
    total = len(reader.pages)
    ranges = as_str(config.get("pageRanges") or config.get("extractPages"))
    pages = parse_page_ranges(ranges, total)

    writer = PdfWriter()
    for page_num in pages:
        writer.add_page(reader.pages[page_num - 1])

    with open(output_file, "wb") as fp:
        writer.write(fp)


def compress_pdf(input_files: List[str], output_file: str, config: Dict[str, Any]) -> None:
    source = input_files[0]
    level = as_str(config.get("level"), "balanced")

    doc = fitz.open(source)
    try:
        if level == "low":
            doc.save(output_file, garbage=2, deflate=True, clean=False)
            return

        quality = 72 if level == "strong" else 80
        max_dim = 1400 if level == "strong" else 1800
        handled_xrefs: set[int] = set()

        for page in doc:
            for img in page.get_images(full=True):
                xref = img[0]
                if xref in handled_xrefs:
                    continue
                handled_xrefs.add(xref)

                pix = fitz.Pixmap(doc, xref)
                try:
                    if pix.width <= 0 or pix.height <= 0 or pix.n - pix.alpha >= 4:
                        continue

                    pil_image = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
                    if max(pil_image.size) > max_dim:
                        pil_image.thumbnail((max_dim, max_dim), Image.Resampling.LANCZOS)

                    buffer = io.BytesIO()
                    pil_image.save(buffer, format="JPEG", quality=quality, optimize=True)
                    doc.update_stream(xref, buffer.getvalue())
                    pil_image.close()
                finally:
                    pix = None

        doc.save(output_file, garbage=4, deflate=True, clean=True)
    finally:
        doc.close()


def rotate_pdf(input_files: List[str], output_file: str, config: Dict[str, Any]) -> None:
    source = input_files[0]
    angle = as_int(config.get("rotation"), 90)

    reader = PdfReader(source)
    writer = PdfWriter()

    for page in reader.pages:
        page.rotate(angle)
        writer.add_page(page)

    with open(output_file, "wb") as fp:
        writer.write(fp)


def jpg_to_pdf(input_files: List[str], output_file: str) -> None:
    images: list[Image.Image] = []
    for path in input_files:
        image = Image.open(path).convert("RGB")
        images.append(image)

    first, rest = images[0], images[1:]
    first.save(output_file, save_all=True, append_images=rest)

    for image in images:
        image.close()


def pdf_to_jpg(input_files: List[str], output_file: str, config: Dict[str, Any]) -> None:
    source = input_files[0]
    doc = fitz.open(source)

    output_path = Path(output_file)
    if output_path.suffix.lower() != ".zip":
        output_path = output_path.with_suffix(".zip")

    quality = min(max(as_int(config.get("quality"), 85), 60), 95)
    zoom = max(as_float(config.get("zoom"), 1.6), 1.0)

    with zipfile.ZipFile(output_path, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=6) as zf:
        for index, page in enumerate(doc, start=1):
            pix = page.get_pixmap(matrix=fitz.Matrix(zoom, zoom))
            image_name = f"page-{index:03d}.jpg"
            image_bytes = pix.tobytes("jpg", jpg_quality=quality)
            zf.writestr(image_name, image_bytes)

    doc.close()


def organize_pdf(input_files: List[str], output_file: str, config: Dict[str, Any]) -> None:
    source = input_files[0]
    reader = PdfReader(source)
    total = len(reader.pages)
    page_order = parse_page_order(as_str(config.get("pageOrder")), total)

    writer = PdfWriter()
    for page_num in page_order:
        writer.add_page(reader.pages[page_num - 1])

    with open(output_file, "wb") as fp:
        writer.write(fp)


def protect_pdf(input_files: List[str], output_file: str, config: Dict[str, Any]) -> None:
    password = as_str(config.get("password"))
    if not password:
        raise ValueError("Password is required for protect operation")

    reader = PdfReader(input_files[0])
    writer = PdfWriter()
    for page in reader.pages:
        writer.add_page(page)

    writer.encrypt(password)
    with open(output_file, "wb") as fp:
        writer.write(fp)


def unlock_pdf(input_files: List[str], output_file: str, config: Dict[str, Any]) -> None:
    password = as_str(config.get("password"))
    reader = PdfReader(input_files[0])
    if reader.is_encrypted:
        ok = reader.decrypt(password)
        if ok == 0:
            raise ValueError("Invalid password")

    writer = PdfWriter()
    for page in reader.pages:
        writer.add_page(page)

    with open(output_file, "wb") as fp:
        writer.write(fp)


def add_text_watermark(input_files: List[str], output_file: str, config: Dict[str, Any]) -> None:
    source = input_files[0]
    text = as_str(config.get("text"), "CONFIDENTIAL")

    doc = fitz.open(source)
    try:
        for page in doc:
            rect = page.rect
            page.insert_text(
                fitz.Point(rect.width * 0.3, rect.height * 0.5),
                text,
                fontsize=36,
                color=(0.3, 0.3, 0.3),
                rotate=0,
                overlay=True,
            )

        doc.save(output_file)
    finally:
        doc.close()
