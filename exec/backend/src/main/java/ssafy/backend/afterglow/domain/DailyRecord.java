package ssafy.backend.afterglow.domain;

import com.fasterxml.jackson.annotation.*;
import lombok.*;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity(name="daily_record")
@Getter @Setter
@NoArgsConstructor
@JsonIdentityInfo(generator = ObjectIdGenerators.IntSequenceGenerator.class)
public class DailyRecord {
    
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("dr_id")
    private Long drId;

    @JsonProperty("dr_date")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
    private LocalDate drDate;

    @JsonProperty("dr_start_time")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd 'T'HH:mm:ss", timezone = "Asia/Seoul")
    private LocalDateTime drStartTime;

    @JsonProperty("dr_end_time")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd 'T'HH:mm:ss", timezone = "Asia/Seoul")
    private LocalDateTime drEndTime;

    @ManyToOne @JoinColumn(name = "rec_id")
    @JsonIgnore
    //@JsonProperty("rec")
    private Record rec;

    @LazyCollection(LazyCollectionOption.FALSE)
    @OneToMany(mappedBy = "dr", cascade = CascadeType.ALL)
    private List<RouteRecord> routeRecs = new ArrayList<>();

    @LazyCollection(LazyCollectionOption.FALSE)
    @OneToMany(mappedBy = "dr", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ConsumptionRecord> conRecs = new ArrayList<>();

    @JsonProperty("dr_time_spent")
    private String drTimeSpent = "00:00";

    @Builder
    public DailyRecord(Record rec, LocalDate drDate, LocalDateTime drStartTime, LocalDateTime drEndTime, String drTimeSpent){
        super();
        this.rec = rec;
        this.drDate = drDate;
        this.drStartTime = drStartTime;
        this.drEndTime = drEndTime;
        this.drTimeSpent = drTimeSpent;
    }
}
