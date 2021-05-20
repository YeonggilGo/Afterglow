package ssafy.backend.afterglow.domain;

import com.fasterxml.jackson.annotation.*;
import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity(name="ConsumptionRecord")
@Getter
@Setter
@NoArgsConstructor
@JsonIdentityInfo(generator = ObjectIdGenerators.IntSequenceGenerator.class)
public class ConsumptionRecord {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("cr_id")
    private Long crId;

    @JsonProperty("cr_name")
    private String crName;

    @JsonProperty("cr_money")
    private Integer crMoney;

    @JsonProperty("cr_datetime")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd 'T'HH:mm:ss", timezone = "Asia/Seoul")
    private LocalDateTime crDatetime;

    @ManyToOne
    @JoinColumn(name = "drId")
    @JsonIgnore
    private DailyRecord dr;

    @Builder
    public ConsumptionRecord(DailyRecord dr, String crName, Integer crMoney, LocalDateTime crDatetime){
        super();
        this.dr = dr;
        this.crName = crName;
        this.crMoney = crMoney;
        this.crDatetime = crDatetime;
    }
}
