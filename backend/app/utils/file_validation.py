ALLOWED_EXTENSIONS = {".mp4", ".mov", ".avi", ".mkv", ".webm"}
MAX_FILE_SIZE_MB = 500

def is_valid_video(filename: str, file_size_bytes: int) -> tuple[bool, str]:
    ext = "." + filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    if ext not in ALLOWED_EXTENSIONS:
        return False, f"Invalid file type '{ext}'. Allowed: {ALLOWED_EXTENSIONS}"
    if file_size_bytes > MAX_FILE_SIZE_MB * 1024 * 1024:
        return False, f"File too large. Max {MAX_FILE_SIZE_MB}MB allowed"
    return True, ""