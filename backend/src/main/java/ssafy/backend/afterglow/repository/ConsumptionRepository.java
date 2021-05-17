package ssafy.backend.afterglow.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ssafy.backend.afterglow.domain.ConsumptionRecord;
import ssafy.backend.afterglow.domain.DailyRecord;
import ssafy.backend.afterglow.domain.Record;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Repository
public interface ConsumptionRepository extends JpaRepository<ConsumptionRecord, Long> {
    Optional<List<ConsumptionRecord>> findAllByDr(DailyRecord dr);

    @Transactional
    void deleteByCrId(Long conId);
}
