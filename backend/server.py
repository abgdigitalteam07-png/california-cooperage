from fastapi import FastAPI

app = FastAPI()


@app.get("/api/")
async def root():
    return {"status": "ok"}


@app.get("/api/health")
async def health():
    return {"status": "ok"}
