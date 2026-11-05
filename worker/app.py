from __future__ import annotations

from typing import Any, Dict, List

from fastapi import FastAPI
from pydantic import BaseModel

from processing.operations import process_operation


class ProcessRequest(BaseModel):
    operation: str
    inputFiles: List[str]
    outputFile: str
    configuration: Dict[str, Any] = {}


class ProcessResponse(BaseModel):
    success: bool
    outputFile: str | None = None
    error: str | None = None


app = FastAPI(title="PDF Processing Worker", version="0.1.0")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/process", response_model=ProcessResponse)
def process(req: ProcessRequest) -> ProcessResponse:
    try:
        process_operation(req.operation, req.inputFiles, req.outputFile, req.configuration)
        return ProcessResponse(success=True, outputFile=req.outputFile)
    except Exception as exc:
        return ProcessResponse(success=False, error=str(exc))
