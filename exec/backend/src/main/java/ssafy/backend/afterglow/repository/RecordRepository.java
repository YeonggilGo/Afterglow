package ssafy.backend.afterglow.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ssafy.backend.afterglow.domain.Record;
import ssafy.backend.afterglow.domain.User;

import java.util.List;

@Repository
public interface RecordRepository extends JpaRepository<Record, Long> {
    List<Record> findByUser(User user);
}