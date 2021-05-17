package ssafy.backend.afterglow.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import ssafy.backend.afterglow.repository.*;

@Configuration
public class SpringConfig {
    private final UserRepository userRepository;
    private final RecordRepository recordRepository;
    private final ImageRepository imageRepository;
    private final ConsumptionRepository consumptionRepository;
    private final DailyRepository dailyRepository;
    private final RouteRepository routeRepository;
    private final TourDestinationRepository tourDestinationRepository;

    @Autowired
    public SpringConfig(UserRepository userRepository, RecordRepository recordRepository, ImageRepository imageRepository, ConsumptionRepository consumptionRepository, DailyRepository dailyRepository, RouteRepository routeRepository, TourDestinationRepository tourDestinationRepository) {
        this.userRepository = userRepository;
        this.recordRepository = recordRepository;
        this.imageRepository = imageRepository;
        this.consumptionRepository = consumptionRepository;
        this.dailyRepository = dailyRepository;
        this.routeRepository = routeRepository;
        this.tourDestinationRepository = tourDestinationRepository;
    }
}
