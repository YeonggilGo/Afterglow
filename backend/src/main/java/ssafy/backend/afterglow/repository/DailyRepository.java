package ssafy.backend.afterglow.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ssafy.backend.afterglow.domain.DailyRecord;
import ssafy.backend.afterglow.domain.Record;
import ssafy.backend.afterglow.domain.User;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DailyRepository extends JpaRepository<DailyRecord, Long> {
    List<DailyRecord> findByRec(Record rec);

    Optional<DailyRecord> findById(Long drId);

    Optional<DailyRecord> findByDrDateAndRec_User(LocalDate date, User user);
}
