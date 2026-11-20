
interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  resource_type: string;
  original_filename?: string;
}

export async function uploadToCloudinary(
  file: File,
  folder: string = "aksaleraverse/informasi/beasiswa"
): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Konfigurasi Cloudinary belum lengkap.");
  }

  if (!file) {
    throw new Error("File gambar belum dipilih.");
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Format gambar harus JPG, PNG, atau WEBP.");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Ukuran gambar maksimal 5 MB.");
  }

  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const result = await response.json();
    throw new Error(
      result.error?.message || "Gagal mengunggah gambar."
    );
  }

  const result: CloudinaryUploadResult = await response.json();

  return result.secure_url;
}
