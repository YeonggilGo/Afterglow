package ssafy.backend.afterglow.controller;

import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ssafy.backend.afterglow.domain.*;
import ssafy.backend.afterglow.dto.ImageInputDto;
import ssafy.backend.afterglow.repository.*;
import ssafy.backend.afterglow.service.RecordService;
import ssafy.backend.afterglow.service.UserService;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("records")
@RequiredArgsConstructor
public class RecordController {
    static final int SUCCESS = 1;
    static final int FAIL = -1;

    @Autowired
    private final RecordService recordService;
    @Autowired
    private final UserService userService;

    private final UserRepository userRepository;
    private final ImageRepository imageRepository;
    private final RecordRepository recordRepository;
    private final DailyRepository dailyRepository;
    private final RouteRepository routeRepository;
    private final ConsumptionRepository conRepository;
    private final TourDestinationRepository tourDestinationRepository;


    // 이미지 저장
    @SneakyThrows
    @PostMapping(value = "/saveImg")
    public ResponseEntity<Integer> saveImg(@RequestBody List<ImageInputDto> images) {
        images
                .stream()
                .forEach(image -> {
                    ImageRecord ir = new ImageRecord();
                    try {
                        ir.setIrImage(image.getIrImage().getBytes());
                        ir.setImgHeight(image.getHeight());
                        ir.setImgWidth(image.getWidth());
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                    ir.setRr(routeRepository.findById(image.getRrId()).get());
                    imageRepository.save(ir);
                });
        return new ResponseEntity<Integer>(SUCCESS, HttpStatus.OK);
    }

    // 여행 시작
    @PostMapping("/startTrip")
    public ResponseEntity<Record> startTrip(@RequestParam("title") String recTitle,
                                            HttpServletRequest request,
                                            HttpServletResponse response) throws IOException {
        var ref = new Object() {
            Record record = null;
            DailyRecord dr = null;
        };

        userService
                .findUserByToken(request, response)
                .ifPresent(user -> {
                    ref.record = recordRepository.save(Record.builder()
                            .user(user)
                            .recName(recTitle)
                            .build());
                    ref.dr = dailyRepository.save(DailyRecord.builder()
                            .rec(ref.record)
                            .drDate(LocalDate.now())
                            .drStartTime(LocalDateTime.now())
                            .build());
                });
        return ResponseEntity.ok(recordRepository.findById(ref.record.getRecId()).get());
    }

    // 하루 시작
    @PostMapping("/startDay")
    public ResponseEntity<DailyRecord> startDay(@RequestParam("recId") Long recId,
                                                HttpServletRequest request,
                                                HttpServletResponse response) throws IOException {
        var ref = new Object() {
            DailyRecord dr = null;
        };

        userService
                .findUserByToken(request, response)
                .ifPresent(user -> {
                    recordRepository.findById(recId)
                            .ifPresent(record -> {
                                ref.dr = dailyRepository.save(DailyRecord.builder()
                                        .drDate(LocalDate.now())
                                        .rec(record)
                                        .drStartTime(LocalDateTime.now())
                                        .build());
                            });
                });
        return ResponseEntity.ok(ref.dr);

    }


    // 가계부 등록
    @PostMapping("/consumption")
    public ResponseEntity<List<ConsumptionRecord>> setConsumption(@RequestParam("day_id") Long dayId,
                                                                  @RequestParam("consumption_name") String conName,
                                                                  @RequestParam("consumption_money") Integer conMoney) {
        var ref = new Object() {
            List<ConsumptionRecord> result;
        };
        dailyRepository
                .findById(dayId)
                .ifPresent(dr -> {
                    conRepository.save(ConsumptionRecord.builder()
                            .dr(dr)
                            .crName(conName)
                            .crMoney(conMoney)
                            .crDatetime(LocalDateTime.now())
                            .build());
                    ref.result = conRepository.findAllByDr(dr).get();

                });
        return ResponseEntity.ok(ref.result);
    }


    // 가계부 수정
    @PutMapping("/consumption")
    public ResponseEntity<List<ConsumptionRecord>> modifyConsumption(@RequestParam("consumption_id") Long conId,
                                                                     @RequestParam("consumption_name") String conName,
                                                                     @RequestParam("consumption_money") Integer conMoney,
                                                                     @RequestParam("consumption_time") @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm") LocalDateTime conTime) {
        var ref = new Object() {
            List<ConsumptionRecord> result;
        };
        conRepository
                .findById(conId)
                .ifPresent(cr -> {
                    conRepository.save(ConsumptionRecord.builder()
                            .crName(conName)
                            .crMoney(conMoney)
                            .crDatetime(conTime)
                            .build());
                    ref.result = conRepository.findAllByDr(cr.getDr()).get();

                });
        return ResponseEntity.ok(ref.result);
    }

    // 가계부 삭제
    @DeleteMapping("/consumption")
    public ResponseEntity<List<ConsumptionRecord>> deleteConsumption(@RequestParam("consumption_id") Long conId) {
        var ref = new Object() {
            List<ConsumptionRecord> result;
        };
        conRepository
                .findById(conId)
                .ifPresent(cr -> {
                    conRepository.delete(cr);
                    ref.result = conRepository.findAllByDr(cr.getDr()).get();
                });
        return ResponseEntity.ok(ref.result);
    }


    // 유저 전체 여행
    @GetMapping("/total")
    public ResponseEntity<Object> totalTrip(HttpServletRequest request, HttpServletResponse response) throws IOException {
        var ref = new Object() {
            List<Record> result = null;
        };
        userService
                .findUserByToken(request, response)
                .ifPresent(user -> {
                    ref.result = recordRepository.findByUser(user);
                });
        return ResponseEntity.ok(ref.result);
    }

    // 하루 기준 현 시간까지의 실시간 정보 받아오기
    @GetMapping("/current")
    public ResponseEntity<Object> currentInfo(@RequestParam("drId") Long drId,
                                              HttpServletRequest request,
                                              HttpServletResponse response) throws IOException {
        var ref = new Object() {
            DailyRecord result = null;
        };
        userService
                .findUserByToken(request, response)
                .ifPresent(user -> {
                    dailyRepository.findById(drId)
                            .ifPresent(dr -> {
                                Duration duration = Duration.between(dr.getDrStartTime(), LocalDateTime.now());
                                long hours = Math.floorDiv(duration.getSeconds(), 3600);
                                long minutes = Math.floorDiv(duration.getSeconds() - 3600 * hours, 60);
                                dr.setDrTimeSpent(String.format("%d:%d", hours, minutes));
                                ref.result = dr;
                            });
                });
        return ResponseEntity.ok(ref.result);
    }


    // 하루끝
    @GetMapping("/dayEnd")
    public ResponseEntity<DailyRecord> dayEnd(HttpServletRequest request,
                                              HttpServletResponse response,
                                              @RequestParam("drId") Long drId) throws IOException {
        var ref = new Object() {
            DailyRecord result;
        };
        userService
                .findUserByToken(request, response)
                .ifPresent(user -> {
                    dailyRepository.findById(drId)
                            .ifPresent(dr -> {
                                dr.setDrEndTime(LocalDateTime.now());
                                Duration duration = Duration.between(dr.getDrStartTime(), dr.getDrEndTime());
                                long hours = Math.floorDiv(duration.getSeconds(), 3600);
                                long minutes = Math.floorDiv(duration.getSeconds() - 3600 * hours, 60);
                                dr.setDrTimeSpent(String.format("%d:%d", hours, minutes));
                                ref.result = dailyRepository.save(dr);
                            });
                });
        return ResponseEntity.ok(ref.result);
    }

    // 여행 중 위치 저장
    @PostMapping("/route")
    public ResponseEntity<Map<String, Object>> saveRoute(@RequestParam("dr_id") Long drId,
                                                         @RequestParam("rr_latitude") Double rrLat,
                                                         @RequestParam("rr_longitude") Double rrLong) {
        var ref = new Object() {
            TourDestination nearestTd = null;
            String tdName = "place";
        };
        Map<String, Object> result = new HashMap<>();
        result.put("rr", null);
        dailyRepository.findById(drId)
                .ifPresent(dr -> {
                    Optional<RouteRecord> latestRr = recordService.getLatestRr(dr);
                    // 전의 기록이 없을 때
                    if (latestRr != null) {
                        result.put("isUserMoving", recordService.isUserMoving(latestRr.get(), rrLat, rrLong));
                        // 전의 기록이 장소 일 때
                        if (latestRr.get().getRrName() != null) {
                            // 장소에서 3km 벗어남
                            if (recordService.getDist(latestRr.get().getRrLatitude(), latestRr.get().getRrLongitude(), rrLat, rrLong) > 3) {
                                result.replace("rr", routeRepository.save(recordService.customBuilder(dr, rrLat, rrLong)));
                            } else {
                                // 최근 위치로 저장
                                latestRr.get().setLatest_latitude(rrLat);
                                latestRr.get().setLatest_longitude(rrLong);
                            }
                            // 1분에 400미터 이상 움직임 -> 이동수단으로 이동중
                        } else if (recordService.getDist(latestRr.get().getLatest_latitude(), latestRr.get().getLatest_longitude(), rrLat, rrLong) > 0.4) {
                            result.replace("rr", routeRepository.save(recordService.customBuilder(dr, rrLat, rrLong)));
                            // 장소도 아니고 이동수단도 이용하지 않는 중
                        } else {
                            // 1분에 100미터 이상 움직이지 않음 : 도보로 걷는중
                            if ((Boolean) result.get("isUserMoving") == false) {
                                latestRr.get().setRrStaying_minute(latestRr.get().getRrStaying_minute() + 1); // 체류시간 1분 증가
                                latestRr.get().setLatest_latitude(rrLat); // 최근 위치 저장
                                latestRr.get().setLatest_longitude(rrLong);

                                // 체류시간이 10분 지속 : 가장 가까운 관광지 탐색, 없으면 이름은 없지만 장소로 인식
                                if (latestRr.get().getRrName() == null && latestRr.get().getRrStaying_minute() >= 10) {
                                    final double[] nearestDist = {3};
                                    tourDestinationRepository.findAll()
                                            .stream()
                                            .forEach(td -> {
                                                Double curDist = recordService.getDist(latestRr.get().getRrLatitude(), latestRr.get().getRrLongitude(), td.getTdLatitude(), td.getTdLongitude());
                                                System.out.println(td.getTdName() + " : " + curDist);
                                                System.out.println(latestRr.get().getRrLatitude() + " / " + latestRr.get().getRrLongitude() + " / " + td.getTdLatitude() + " / " + td.getTdLongitude());

                                                if (curDist < nearestDist[0]) {
                                                    nearestDist[0] = curDist;
                                                    ref.nearestTd = td;
                                                    ref.tdName = td.getTdName();
                                                }
                                            });
                                    if (ref.nearestTd != null) {
                                        latestRr.get().setRrLatitude(ref.nearestTd.getTdLatitude());
                                        latestRr.get().setRrLongitude(ref.nearestTd.getTdLongitude());
                                        latestRr.get().setLatest_latitude(ref.nearestTd.getTdLatitude());
                                        latestRr.get().setLatest_longitude(ref.nearestTd.getTdLongitude());
                                    }
                                    latestRr.get().setRrName(ref.tdName);
                                    result.put("place", ref.tdName);
                                }
                                routeRepository.save(latestRr.get());
                            } else {
                                result.replace("rr", routeRepository.save(recordService.customBuilder(dr, rrLat, rrLong)));
                            }
                        }
                    } else {
                        result.put("isUserMoving", false);
                        result.replace("rr", routeRepository.save(recordService.customBuilder(dr, rrLat, rrLong)));
                    }
                });
        return ResponseEntity.ok(result);
    }

    // 경로 이름 작성
    @PostMapping("/route/name")
    public ResponseEntity<RouteRecord> routeNaming(@RequestParam("route_name") String routeName,
                                                   @RequestParam("Rr_id") Long RrId) {
        var ref = new Object() {
            RouteRecord result = null;
        };
        routeRepository.findById(RrId)
                .ifPresent(rr -> {
                    rr.setRrName(routeName);
                    ref.result = rr;
                });
        return ResponseEntity.ok(ref.result);
    }


    // 메모 작성 and 수정
    @PostMapping("/memo/create")
    public ResponseEntity<RouteRecord> addAndUpdateMemo(@RequestParam("Rr_id") Long RrId,
                                                        @RequestParam("memo_content") String memoContent) {
        var ref = new Object() {
            RouteRecord result = null;
        };
        routeRepository
                .findById(RrId)
                .ifPresent(rr -> {
                    rr.setRrMemo(memoContent);
                    routeRepository.save(rr);
                    ref.result = rr;
                });
        return ResponseEntity.ok(ref.result);
    }

    // 하루 사진
    @GetMapping("/daily/picture")
    public ResponseEntity<List<ImageRecord>> dailyPicture(HttpServletRequest request,
                                                          HttpServletResponse response,
                                                          @RequestParam("drId") Long drId) throws IOException {
        var ref = new Object() {
            List<ImageRecord> result = null;
        };
        userService
                .findUserByToken(request, response)
                .ifPresent(user -> {
                    dailyRepository.findById(drId)
                            .ifPresent(dr -> {
                                routeRepository.findByDr(dr)
                                        .ifPresent(rrs -> {
                                            rrs.stream()
                                                    .forEach(rr -> {
                                                        ref.result.addAll(imageRepository.findAllByRr(rr)
                                                                .orElse(new ArrayList<>()));
                                                    });
                                        });
                            });
                });
        return ResponseEntity.ok(ref.result);
    }


    // 전체 사진
    @GetMapping("/trip/picture")
    public ResponseEntity<Map<LocalDate, List<ImageRecord>>> tripPicture(@RequestParam("rec_id") Long recId) {
        Map<LocalDate, List<ImageRecord>> result = null;
        recordRepository
                .findById(recId)
                .ifPresent(rec -> {
                    dailyRepository.findByRec(rec)
                            .forEach(dr -> {
                                routeRepository.findByDr(dr)
                                        .ifPresent(rrs -> {
                                            rrs.stream()
                                                    .forEach(rr -> {
                                                        if (result.containsKey(rr.getRrTime().toLocalDate())) {
                                                            result.get(rr.getRrTime().toLocalDate()).addAll(imageRepository.findAllByRr(rr)
                                                                    .orElse(new ArrayList<>()));
                                                        } else {
                                                            result.put(rr.getRrTime().toLocalDate(), imageRepository.findAllByRr(rr)
                                                                    .orElse(new ArrayList<>()));
                                                        }
                                                    });
                                        })
                                ;
                            });
                });
        return ResponseEntity.ok(result);
    }


    // 여행 정보
    @GetMapping("/tripInfo")
    public ResponseEntity<Record> getRecord(@RequestParam("Record_id") Long recId,
                                            HttpServletRequest request,
                                            HttpServletResponse response) {
        var ref = new Object() {
            Record result;
        };
        recordRepository.findById(recId)
                .ifPresent(rec -> {
                    ref.result = rec;
                });
        return ResponseEntity.ok(ref.result);
    }

    // 장소만 반환
    @GetMapping("/places")
    public ResponseEntity<List<RouteRecord>> getPlaces(@RequestParam("drId") Long drId) {
        var ref = new Object() {
            List<RouteRecord> result;
        };
        dailyRepository.findById(drId)
                .ifPresent(dr -> {
                    routeRepository.findByDr(dr)
                            .ifPresent(rrs -> {
                                ref.result = rrs.stream()
                                        .filter(rr -> rr.getRrName() != null)
                                        .collect(Collectors.toList());
                            });

                });
        return ResponseEntity.ok(ref.result);
    }
}
