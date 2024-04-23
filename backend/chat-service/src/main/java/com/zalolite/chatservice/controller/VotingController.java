cdpackage com.zalolite.chatservice.controller;

import com.zalolite.chatservice.dto.handleChat.VotingDTO;
import com.zalolite.chatservice.entity.Voting;
import com.zalolite.chatservice.repository.VotingRepository;
import com.zalolite.chatservice.serialization.JsonConverter;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.UUID;

@RestController
@AllArgsConstructor
@RequestMapping("/api/v1/voting")
@Slf4j
public class VotingController {
    private VotingRepository votingRepository;
    private final JsonConverter jsonConverter;

    @PostMapping("/create")
    public Mono<ResponseEntity<String>> createVoting(@RequestBody VotingDTO info){
        log.info("### enter create voting ###");
        log.info("# {} #", jsonConverter.objToString(info));
        return votingRepository.save(new Voting(info))
                .switchIfEmpty(Mono.defer(() -> Mono.just(ResponseEntity.status(500).body("Create voting fail"))).then(Mono.empty()))
                .flatMap(v -> Mono.just(ResponseEntity.status(200).body(jsonConverter.objToString(v))));
    }

    @GetMapping("/search")
    public Mono<ResponseEntity<String>> search(@RequestParam UUID id){
        log.info("### enter search voting ###");
        log.info("# {} #", jsonConverter.objToString(id));
        return votingRepository.findById(id)
                .switchIfEmpty(Mono.defer(() -> Mono.just(ResponseEntity.status(404).body("Not found"))).then(Mono.empty()))
                .flatMap(v -> Mono.just(ResponseEntity.status(200).body(jsonConverter.objToString(v))));
    }

    @PostMapping("/append-voter")
    public Mono<ResponseEntity<String>> appendVoter(@RequestBody VotingDTO info){
        log.info("### enter create voting ###");
        log.info("# {} #", jsonConverter.objToString(info));
        return votingRepository.save(new Voting(info))
                .switchIfEmpty(Mono.defer(() -> Mono.just(ResponseEntity.status(500).body("Create voting fail"))).then(Mono.empty()))
                .flatMap(v -> Mono.just(ResponseEntity.status(200).body(jsonConverter.objToString(v))));
    }
}
