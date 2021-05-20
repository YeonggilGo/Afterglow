package ssafy.backend.afterglow.domain;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity(name="ImageRecord")
@Getter
@Setter
@NoArgsConstructor
@JsonIdentityInfo(generator = ObjectIdGenerators.IntSequenceGenerator.class)
public class ImageRecord {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("img_id")
    private Long imgId;

    @Lob @JsonProperty("ir_image")
    private byte[] irImage;

    @ManyToOne
    @JoinColumn(name = "rrId")
    @JsonIgnore
    private RouteRecord rr;

    @JsonProperty("height")
    private Integer height;

    @JsonProperty("width")
    private Integer width;


    @Builder
    public ImageRecord(RouteRecord rr, byte[] irImage){
        super();
        this.rr = rr;
        this.irImage = irImage;
    }
}
