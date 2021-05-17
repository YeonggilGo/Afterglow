package ssafy.backend.afterglow.domain;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import lombok.*;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity(name="record")
@Getter @Setter
@NoArgsConstructor
@JsonIdentityInfo(generator = ObjectIdGenerators.IntSequenceGenerator.class)
public class Record {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("rec_id")
    private Long recId;
    @JsonProperty("rec_name")
    private String recName;

    @ManyToOne @JoinColumn(name = "usr_id")
    @JsonIgnore
//    @JsonProperty("usr")
    private User user;

    @LazyCollection(LazyCollectionOption.FALSE)
    @OneToMany(mappedBy = "rec", cascade = CascadeType.ALL)
    private List<DailyRecord> dayRecs = new ArrayList<>();

    @JsonProperty("total_img_count")
    private Integer totalPhotoCount;

    @Builder
    public Record(User user, String recName, Integer totalPhotoCount){
        super();
        this.recName = recName;
        this.user = user;
        this.totalPhotoCount = totalPhotoCount;
    }
}
