package com.zalolite.chatservice.async;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.zalolite.chatservice.repository.ChatRepository;
import com.zalolite.chatservice.repository.GroupRepository;
import com.zalolite.chatservice.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@AllArgsConstructor
@Service
public class UpdateAsync {
    private UserRepository userRepository;
    private ChatRepository chatRepository;
    private GroupRepository groupRepository;
    private ObjectMapper objectMapper;
    private WebClient.Builder builder;

    @Async
    public void updateAvatarAsync(String oldAvatar, String newAvatar) {
        userRepository.updateAvatarInFriendRequest(oldAvatar,newAvatar).subscribe();
        userRepository.updateAvatarInConversation(oldAvatar, newAvatar).subscribe();
        chatRepository.updateAvatarInDelivery(oldAvatar,newAvatar).subscribe();
        chatRepository.updateAvatarInRead(oldAvatar,newAvatar).subscribe();
        groupRepository.updateAvatarInOwner(oldAvatar,newAvatar).subscribe();
        groupRepository.updateAvatarInAdmin(oldAvatar,newAvatar).subscribe();
        groupRepository.updateAvatarInMembers(oldAvatar,newAvatar).subscribe();
    }

}
