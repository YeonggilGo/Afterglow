package ssafy.backend.afterglow.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.RouteMatcher;
import ssafy.backend.afterglow.domain.*;
import ssafy.backend.afterglow.dto.*;
import ssafy.backend.afterglow.repository.*;

import java.sql.Timestamp;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.time.temporal.Temporal;
import java.util.*;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;

@Service
public class RecordService {
    @Autowired
    UserRepository userRepo;
    @Autowired
    RecordRepository recRepo;
    @Autowired
    DailyRepository dayRepo;
    @Autowired
    RouteRepository rouRepo;
    @Autowired
    ConsumptionRepository conRepo;
    @Autowired
    ImageRepository imgRepo;
    @Autowired
    TourDestinationRepository tourRepo;

    public Long getRecTotalTime(Long recId) {
        Optional<Record> rec = recRepo.findById(recId);
        if (rec.isPresent()) {
            List<DailyRecord> dayRec = dayRepo.findByRec(rec.get());
            Long totalTime = 0L;
            for (DailyRecord day : dayRec)
                totalTime += ChronoUnit.HOURS.between(day.getDrStartTime(), day.getDrEndTime());
            return totalTime;
        } else
            return null;
    }

    public Boolean isUserMoving(RouteRecord latestRr, Double latitude, Double longitude) {
        return getDist(latestRr.getLatest_latitude(), latestRr.getLatest_longitude(), latitude, longitude) > 0.1;
    }

    public Optional<RouteRecord> getLatestRr(DailyRecord dr) {
        Optional<List<RouteRecord>> rrList = rouRepo.findByDr(dr);
        if (rrList == null || rrList.get().size() == 0) {
            return null;
        } else {
            return Optional.ofNullable(rrList.get().get(rrList.get().size() - 1));
        }
    }

    public Optional<RouteRecord> findNearestRr(Long drId, Double longitude, Double latitude, Timestamp timestamp) {
        var ref = new Object() {
            Optional<RouteRecord> result;
        };
        dayRepo.findById(drId).
                ifPresent(dr -> {

                    rouRepo.findByDr(dr)
                            .ifPresent(rrs -> {
                                ref.result = rrs.stream()
                                        .filter(rr -> rr.getRrTime().compareTo(timestamp.toLocalDateTime()) < 0)
                                        .min(new Comparator<RouteRecord>() {
                                            @Override
                                            public int compare(RouteRecord rr1, RouteRecord rr2) {
                                                return Duration.between(rr1.getRrTime(), (Temporal) timestamp).compareTo(Duration.between(rr2.getRrTime(), (Temporal) timestamp));
                                            }
                                        });
                            });
                });
        return ref.result;
    }

    public Double getDistBtwRr(RouteRecord rr1, RouteRecord rr2) {
        return getDist(rr1.getRrLatitude(), rr1.getRrLongitude(), rr2.getRrLatitude(), rr2.getRrLongitude());
    }

    public Double getDist(Double lat1, Double lon1, Double lat2, Double lon2) {

        Double theta = lon1 - lon2;
        Double dist = Math.sin(deg2rad(lat1)) * Math.sin(deg2rad(lat2)) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.cos(deg2rad(theta));

        dist = Math.acos(dist);
        dist = rad2deg(dist);
        dist = dist * 60 * 1.1515;

        dist = dist * 1.609344;

        return dist;
    }

    public static Double deg2rad(Double deg) {
        return (deg * Math.PI / 180.0);
    }

    public static Double rad2deg(Double rad) {
        return (rad * 180 / Math.PI);
    }

    public RouteRecord customBuilder(DailyRecord dr, Double lat, Double lng){
        return RouteRecord.builder()
                .dr(dr)
                .latest_longitude(lng)
                .latest_latitude(lat)
                .rrLongitude(lng)
                .rrLatitude(lat)
                .rrTime(LocalDateTime.now())
                .build();
    }



    public List<TourDestination> getToursInRange(Double radius, Double latitude, Double longitude){
        List<TourDestination> result = new ArrayList<>();
        tourRepo.findAll()
                .stream()
                .forEach(td -> {
                    if(getDist(latitude, longitude, td.getTdLatitude(), td.getTdLongitude()) <= radius){
                        result.add(td);
                    }
                });
        return result;
    }
}
