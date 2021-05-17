package ssafy.backend.afterglow.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ssafy.backend.afterglow.domain.TourDestination;

@Repository
public interface TourDestinationRepository extends JpaRepository<TourDestination, Long> {

}
