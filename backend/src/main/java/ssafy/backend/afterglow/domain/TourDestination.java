package ssafy.backend.afterglow.domain;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import javax.persistence.*;

@Entity(name="TourDestination")
@Getter
@Setter
@NoArgsConstructor
public class TourDestination {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("td_id")
    @Id
    private Integer tdId;

    @JsonProperty("td_name")
    private String tdName;
    @JsonProperty("td_latitude")
    private String tdLatitude;
    @JsonProperty("td_longitude")
    private String tdLongitude;

}
