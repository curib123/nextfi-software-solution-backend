import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY_ALLOWED_FORMATS } from '../common/constants';

export interface UploadedMedia {
  publicId: string;
  secureUrl: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

@Injectable()
export class MediaService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.getOrThrow<string>('cloudinary.cloudName'),
      api_key: this.configService.getOrThrow<string>('cloudinary.apiKey'),
      api_secret: this.configService.getOrThrow<string>('cloudinary.apiSecret'),
      secure: true,
    });
  }

  private validateMimeType(mimeType: string) {
    const format = mimeType.split('/').at(-1)?.toLowerCase() ?? '';

    if (!CLOUDINARY_ALLOWED_FORMATS.includes(format as never)) {
      throw new BadRequestException(
        `Unsupported file format. Allowed formats: ${CLOUDINARY_ALLOWED_FORMATS.join(', ')}`,
      );
    }
  }

  private mapUpload(upload: UploadApiResponse): UploadedMedia {
    return {
      publicId: upload.public_id,
      secureUrl: upload.secure_url,
      width: upload.width,
      height: upload.height,
      format: upload.format,
      bytes: upload.bytes,
    };
  }

  async upload(
    fileBuffer: Buffer,
    mimeType: string,
    folder: string,
  ): Promise<UploadedMedia> {
    this.validateMimeType(mimeType);

    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
        },
        (error, result) => {
          if (error || !result) {
            reject(error ?? new Error('Cloudinary upload failed'));
            return;
          }

          resolve(this.mapUpload(result));
        },
      );

      stream.end(fileBuffer);
    });
  }

  async replace(
    fileBuffer: Buffer,
    mimeType: string,
    folder: string,
    oldPublicId?: string | null,
  ): Promise<UploadedMedia> {
    if (oldPublicId) {
      await this.delete(oldPublicId);
    }

    return this.upload(fileBuffer, mimeType, folder);
  }

  async delete(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
  }
}
