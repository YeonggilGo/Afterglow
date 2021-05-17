package ssafy.backend.afterglow.dto;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.sql.Timestamp;

@Data
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ImageInputDto {
    private Long imgId;
    private MultipartFile irImage;
    private Integer height;
    private Integer width;
    private Long RrId;
}
