-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "youtube_url" TEXT NOT NULL,
    "video_title" TEXT NOT NULL,
    "raw_transcript" TEXT NOT NULL,
    "structured_chapters" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
