"use client";
import { FaSpinner, FaUpload } from "react-icons/fa";

type FileType = "image" | "video" | "audio" | "document";

const getMimeType = (fileType?: string | string[]): string | undefined => {
    if (!fileType) return;
    if (Array.isArray(fileType)) {
        return fileType.join(",");
    }

    if (!fileType.includes("/")) {
        return `${fileType}/*`;
    }

    const [type, subtype] = fileType.split("/");
    if (!subtype) {
        return `${type}/*`;
    }

    return `${type}/${subtype}`;
}

interface FileUploadProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fileType?: FileType | `${FileType}/${string}` | Array<`${FileType}/${string}`>;
  isLoading?: boolean;
}

export default function FileUpload({
  onChange,
  fileType,
  isLoading,
}: FileUploadProps) {
  return (
    <div className="relative inline-block mr-3">
      <input
        type="file"
        accept={getMimeType(fileType)}
        onChange={onChange}
        className="hidden"
        disabled={isLoading}
        id="file-upload-input"
      />
      <label
        htmlFor="file-upload-input"
        className="flex items-center justify-center h-10 p-2 border cursor-pointer bg-amber-200 text-amber-800 w-10 rounded-full border-amber-600"
      >
        {isLoading ? (
          <FaSpinner className="animate-spin text-amber-500" />
        ) : (
          <FaUpload />
        )}
      </label>
    </div>
  );
}
