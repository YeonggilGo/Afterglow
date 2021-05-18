package ssafy.backend.afterglow.domain;

import com.fasterxml.jackson.annotation.*;
import lombok.*;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity(name="RouteRecord")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIdentityInfo(generator = ObjectIdGenerators.IntSequenceGenerator.class)
public class RouteRecord {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("rr_id")
    private Long rrId;

    @JsonProperty("rr_latitude")
    private Double rrLatitude;

    @JsonProperty("rr_longitude")
    private Double rrLongitude;

    @JsonProperty("rr_time")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd 'T'HH:mm:ss", timezone = "Asia/Seoul")
    private LocalDateTime rrTime;

    @JsonProperty("rr_name")
    private String rrName;

    @JsonProperty("rr_memo")
    private String rrMemo;

    @JsonProperty("latest_latitude")
    private Double latest_latitude;

    @JsonProperty("latest_longitude")
    private Double latest_longitude;

    @ManyToOne @JoinColumn(name = "drId")
    @JsonIgnore
    //@JsonProperty("dr")
    private DailyRecord dr;
    
    @JsonProperty("rr_staying_minute")
    @Builder.Default
    private Integer rrStaying_minute = 1;

    @LazyCollection(LazyCollectionOption.FALSE)
    @OneToMany(mappedBy = "rr", cascade = CascadeType.ALL)
    @Builder.Default
    @JsonIgnore
    private List<ImageRecord> imgRecs = new ArrayList<>();


}
