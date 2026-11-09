import axios from "axios";

// S3 presigned URL로 파일을 직접 업로드
export async function putImageToS3(presignedUrl: string, file: File) {
  await axios.put(presignedUrl, file, {
    headers: { "Content-Type": file.type },
  });
}
