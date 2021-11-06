package dev.abelab.jphacks.util;

import java.io.FileInputStream;

import org.springframework.stereotype.Component;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.StorageOptions;
import com.google.auth.oauth2.GoogleCredentials;

import lombok.*;
import dev.abelab.jphacks.model.FileModel;
import dev.abelab.jphacks.property.GcpProperty;
import dev.abelab.jphacks.exception.ErrorCode;
import dev.abelab.jphacks.exception.InternalServerErrorException;

/**
 * Google Cloud Storage Util
 */
@Component
@RequiredArgsConstructor
public class CloudStorageUtil {

    private final GcpProperty gcpProperty;

    /**
     * ファイルをアップロード
     *
     * @param file ファイル
     *
     * @return ファイルURL
     */
    public String uploadFile(final FileModel file) {
        // GESが有効かチェック
        if (!this.gcpProperty.getCloudStorage().isEnabled()) {
            return null;
        }

        try {
            final var storage = StorageOptions.newBuilder() //
                .setProjectId(gcpProperty.getProjectId()) //
                .setCredentials(GoogleCredentials.fromStream(new FileInputStream(this.gcpProperty.getCredentialsPath()))) //
                .build().getService();

            final var blobId = BlobId.of(this.gcpProperty.getCloudStorage().getBucketName(), file.getName());
            final var blobInfo = BlobInfo.newBuilder(blobId).build();
            storage.create(blobInfo, file.getContent());

            return String.format("https://storage.googleapis.com/%s/%s", this.gcpProperty.getCloudStorage().getBucketName(),
                file.getName());
        } catch (final Exception e) {
            System.out.println(e);
            throw new InternalServerErrorException(ErrorCode.FAILED_TO_UPLOAD_FILE_TO_GCS);
        }

    }

}
