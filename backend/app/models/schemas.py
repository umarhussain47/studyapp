from pydantic import BaseModel
from typing import List

class ChunkResponse(BaseModel):
    chunks: List[str]