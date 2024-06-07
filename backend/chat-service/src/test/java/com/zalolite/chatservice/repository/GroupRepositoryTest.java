package com.zalolite.chatservice.repository;

import com.zalolite.chatservice.entity.Group;
import com.zalolite.chatservice.entity.PersonInfo;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class GroupRepositoryTest {
    @Autowired private GroupRepository groupRepository;

    @Test
    void appendMember() {
        UUID id = UUID.randomUUID();
        Group group = new Group();
        group.setId(id);

        groupRepository.save(group).block();
        Long block = groupRepository.appendMember(id.toString(), new PersonInfo()).block();

        assertNotNull(block);
        assertTrue(block >= 0);

        groupRepository.deleteById(id).block();
    }

    @Test
    void removeMember() {
        UUID id = UUID.randomUUID();
        Group group = new Group();
        group.setId(id);
        PersonInfo personInfo = new PersonInfo();
        personInfo.setUserID(UUID.randomUUID());

        groupRepository.save(group).block();
        Long block = groupRepository.appendMember(id.toString(), personInfo).block();

        assertNotNull(block);
        assertTrue(block >= 0);

        Long aLong = groupRepository.removeMember(id.toString(), personInfo.getUserID().toString()).block();
        assertNotNull(aLong);
        assertTrue(aLong >= 0);

        groupRepository.deleteById(id).block();
    }

    @Test
    void appendAdmin() {
        UUID id = UUID.randomUUID();
        Group group = new Group();
        group.setId(id);

        groupRepository.save(group).block();
        Long block = groupRepository.appendAdmin(id.toString(), new PersonInfo()).block();

        assertNotNull(block);
        assertTrue(block >= 0);

        groupRepository.deleteById(id).block();
    }

    @Test
    void removeAdmin() {
        UUID id = UUID.randomUUID();
        Group group = new Group();
        group.setId(id);
        PersonInfo personInfo = new PersonInfo();
        personInfo.setUserID(UUID.randomUUID());

        groupRepository.save(group).block();
        Long block = groupRepository.appendAdmin(id.toString(), personInfo).block();

        assertNotNull(block);
        assertTrue(block >= 0);

        Long aLong = groupRepository.removeAdmin(id.toString(), personInfo.getUserID().toString()).block();
        assertNotNull(aLong);
        assertTrue(aLong >= 0);

        groupRepository.deleteById(id).block();
    }

    @Test
    void changeOwner() {
        UUID id = UUID.randomUUID();
        Group group = new Group();
        group.setId(id);

        groupRepository.save(group).block();
        Long block = groupRepository.changeOwner(id.toString(), new PersonInfo()).block();

        assertNotNull(block);
        assertTrue(block >= 0);

        groupRepository.deleteById(id).block();
    }
}