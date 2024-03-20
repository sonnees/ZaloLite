package com.zalolite.chatservice;

import com.zalolite.chatservice.entity.*;
import com.zalolite.chatservice.repository.ChatRepository;
import com.zalolite.chatservice.repository.GroupRepository;
import com.zalolite.chatservice.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@SpringBootApplication
@Slf4j
@AllArgsConstructor
public class ChatServiceApplication {
	UserRepository userRepository;
	ChatRepository chatRepository;
	GroupRepository groupRepository;

	public static void main(String[] args) {
		SpringApplication.run(ChatServiceApplication.class, args);
	}

	@Bean
	CommandLineRunner commandLineRunner(){
		return new CommandLineRunner() {
			@Override
			public void run(String... args) throws Exception {
				User user = userRepository.findById(UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db1")).block();
				if( user != null ) return;

				List<ChatActivity> chatActivities = List.of(
						new ChatActivity(
								UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db1"),
								UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db1"),
								new Date(),
								null,
								List.of(
										new Content(
												"text",
												"Chao mn!"
										)
								),
								new Status(
										new ArrayList<>(),
										List.of(
												new Delivery(
														UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db1"),
														"https://cdn1.vectorstock.com/i/1000x1000/23/70/man-avatar-icon-flat-vector-19152370.jpg"
												),
												new Delivery(
														UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db2"),
														"https://cdn4.iconfinder.com/data/icons/circle-avatars-1/128/050_girl_avatar_profile_woman_suit_student_officer-2-1024.png"
												),
												new Delivery(
														UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db3"),
														"https://cdn4.iconfinder.com/data/icons/circle-avatars-1/128/050_girl_avatar_profile_woman_suit_student_officer-2-1024.png"
												)
										),
										new ArrayList<>(),
										false
								)
						),
						new ChatActivity(
								UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db2"),
								UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db1"),
								new Date(),
								null,
								List.of(
										new Content(
												"image",
												"https://s-vnba-cdn.aicms.vn/vnba-media/24/1/23/mb-the-nghe-sy-son-tung-mtp-fandom_65af259ecb1a1.jpg"
										)
								),
								new Status(
										List.of(
												new Delivery(
														UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db3"),
														"https://cdn4.iconfinder.com/data/icons/circle-avatars-1/128/050_girl_avatar_profile_woman_suit_student_officer-2-1024.png"
												)
										),
										List.of(
												new Delivery(
														UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db1"),
														"https://cdn1.vectorstock.com/i/1000x1000/23/70/man-avatar-icon-flat-vector-19152370.jpg"
												),
												new Delivery(
														UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db2"),
														"https://cdn4.iconfinder.com/data/icons/circle-avatars-1/128/050_girl_avatar_profile_woman_suit_student_officer-2-1024.png"
												)
										),
										List.of(
												UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db1")
										),
										false
								)
						),
						new ChatActivity(
								UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db3"),
								UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db2"),
								new Date(),
								UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db2"),
								List.of(
										new Content(
												"text",
												"kkk"
										),
										new Content(
												"image",
												"https://th.bing.com/th/id/OIP.y8n2gSp1iMy-laZRufBT-QHaIW?rs=1&pid=ImgDetMain"
										)
								),
								new Status(
										List.of(
												new Delivery(
														UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db3"),
														"https://cdn4.iconfinder.com/data/icons/circle-avatars-1/128/050_girl_avatar_profile_woman_suit_student_officer-2-1024.png"
												)
										),
										List.of(
												new Delivery(
														UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db1"),
														"https://cdn1.vectorstock.com/i/1000x1000/23/70/man-avatar-icon-flat-vector-19152370.jpg"
												),
												new Delivery(
														UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db2"),
														"https://cdn4.iconfinder.com/data/icons/circle-avatars-1/128/050_girl_avatar_profile_woman_suit_student_officer-2-1024.png"
												)
										),
										new ArrayList<>(),
										false
								)
						),
						new ChatActivity(
								UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db4"),
								UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db1"),
								new Date(),
								null,
								List.of(
										new Content(
												"text",
												"kkk"
										),
										new Content(
												"image",
												"https://th.bing.com/th/id/OIP.y8n2gSp1iMy-laZRufBT-QHaIW?rs=1&pid=ImgDetMain"
										)
								),
								new Status(
										List.of(
												new Delivery(
														UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db3"),
														"https://cdn4.iconfinder.com/data/icons/circle-avatars-1/128/050_girl_avatar_profile_woman_suit_student_officer-2-1024.png"
												)
										),
										List.of(
												new Delivery(
														UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db1"),
														"https://cdn1.vectorstock.com/i/1000x1000/23/70/man-avatar-icon-flat-vector-19152370.jpg"
												),
												new Delivery(
														UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db2"),
														"https://cdn4.iconfinder.com/data/icons/circle-avatars-1/128/050_girl_avatar_profile_woman_suit_student_officer-2-1024.png"
												)
										),
										new ArrayList<>(),
										false
								)
						)
				);
				List<ChatActivity> chatActivities1 = List.of(
						new ChatActivity(
								UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db1"),
								UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db1"),
								new Date(),
								null,
								List.of(
										new Content(
												"text",
												"Alo!"
										)
								),
								new Status(
										new ArrayList<>(),
										List.of(
												new Delivery(
														UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db1"),
														"https://cdn1.vectorstock.com/i/1000x1000/23/70/man-avatar-icon-flat-vector-19152370.jpg"
												),
												new Delivery(
														UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db2"),
														"https://cdn4.iconfinder.com/data/icons/circle-avatars-1/128/050_girl_avatar_profile_woman_suit_student_officer-2-1024.png"
												)
										),
										new ArrayList<>(),
										false
								)
						),
						new ChatActivity(
								UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db2"),
								UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db1"),
								new Date(),
								null,
								List.of(
										new Content(
												"image",
												"https://s-vnba-cdn.aicms.vn/vnba-media/24/1/23/mb-the-nghe-sy-son-tung-mtp-fandom_65af259ecb1a1.jpg"
										)
								),
								new Status(
										new ArrayList<>(),
										List.of(
												new Delivery(
														UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db1"),
														"https://cdn1.vectorstock.com/i/1000x1000/23/70/man-avatar-icon-flat-vector-19152370.jpg"
												),
												new Delivery(
														UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db2"),
														"https://cdn4.iconfinder.com/data/icons/circle-avatars-1/128/050_girl_avatar_profile_woman_suit_student_officer-2-1024.png"
												)
										),
										List.of(
												UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db1")
										),
										false
								)
						),
						new ChatActivity(
								UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db3"),
								UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db2"),
								new Date(),
								UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db2"),
								List.of(
										new Content(
												"text",
												"kkk"
										),
										new Content(
												"image",
												"https://th.bing.com/th/id/OIP.y8n2gSp1iMy-laZRufBT-QHaIW?rs=1&pid=ImgDetMain"
										)
								),
								new Status(
										new ArrayList<>(),
										List.of(
												new Delivery(
														UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db1"),
														"https://cdn1.vectorstock.com/i/1000x1000/23/70/man-avatar-icon-flat-vector-19152370.jpg"
												),
												new Delivery(
														UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db2"),
														"https://cdn4.iconfinder.com/data/icons/circle-avatars-1/128/050_girl_avatar_profile_woman_suit_student_officer-2-1024.png"
												)
										),
										new ArrayList<>(),
										false
								)
						),
						new ChatActivity(
								UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db4"),
								UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db1"),
								new Date(),
								null,
								List.of(
										new Content(
												"text",
												"kkk"
										),
										new Content(
												"image",
												"https://th.bing.com/th/id/OIP.y8n2gSp1iMy-laZRufBT-QHaIW?rs=1&pid=ImgDetMain"
										)
								),
								new Status(
										List.of(
												new Delivery(
														UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db2"),
														"https://cdn4.iconfinder.com/data/icons/circle-avatars-1/128/050_girl_avatar_profile_woman_suit_student_officer-2-1024.png"
												)
										),
										List.of(
												new Delivery(
														UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db1"),
														"https://cdn1.vectorstock.com/i/1000x1000/23/70/man-avatar-icon-flat-vector-19152370.jpg"
												)
										),
										List.of(UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db1")),
										false
								)
						),
						new ChatActivity(
								UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db5"),
								UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db1"),
								new Date(),
								null,
								List.of(
										new Content(
												"text",
												"kkk"
										)
								),
								new Status(
										List.of(
												new Delivery(
														UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db2"),
														"https://cdn4.iconfinder.com/data/icons/circle-avatars-1/128/050_girl_avatar_profile_woman_suit_student_officer-2-1024.png"
												)
										),
										List.of(
												new Delivery(
														UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db1"),
														"https://cdn1.vectorstock.com/i/1000x1000/23/70/man-avatar-icon-flat-vector-19152370.jpg"
												)
										),
										new ArrayList<>(),
										true
								)
						)
				);

				userRepository.save(new User(
						UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db1"),
						new ArrayList<>(),
						List.of(
								new Conversation(
										UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db1"),
										"chatName",
										null,
										Type.GROUP,
										UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db1"),
										new Date(),
										new Date(),
										chatActivities
								),
								new Conversation(
										UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db2"),
										"Nguyen Thi Son",
										"https://cdn4.iconfinder.com/data/icons/circle-avatars-1/128/050_girl_avatar_profile_woman_suit_student_officer-2-1024.png",
										Type.FRIEND,
										UUID.fromString("09a9768c-a2a8-4290-9653-5291b9718db0"),
										new Date(),
										new Date(),
										chatActivities1
								)
						)
				)).block();
				userRepository.save(new User(
						UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db2"),
						new ArrayList<>(),
						List.of(
								new Conversation(
										UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db1"),
										"chatName",
										null,
										Type.GROUP,
										UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db1"),
										new Date(),
										new Date(),
										chatActivities
								),
								new Conversation(
										UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db2"),
										"Nguyen Van Son",
										"https://cdn1.vectorstock.com/i/1000x1000/23/70/man-avatar-icon-flat-vector-19152370.jpg",
										Type.FRIEND,
										UUID.fromString("09a9768c-a2a8-4290-9653-5291b9718db0"),
										new Date(),
										new Date(),
										chatActivities1
								)
						)
				)).block();
				userRepository.save(new User(
						UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db3"),
						new ArrayList<>(),
						List.of(
								new Conversation(
										UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db1"),
										"chatName",
										null,
										Type.GROUP,
										UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db1"),
										new Date(),
										new Date(),
										chatActivities
								)
						)
				)).block();

				groupRepository.save(new Group(
						UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db1"),
						"chatName",
						new PersonInfo(
								UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db1"),
								"Nguyen Van Son",
								"https://cdn1.vectorstock.com/i/1000x1000/23/70/man-avatar-icon-flat-vector-19152370.jpg"
						),
						List.of(new PersonInfo(
								UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db2"),
								"Nguyen Thi Son",
								"https://cdn4.iconfinder.com/data/icons/circle-avatars-1/128/050_girl_avatar_profile_woman_suit_student_officer-2-1024.png"
						)),
						List.of(new PersonInfo(
								UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db3"),
								"Ha Thi Son",
								"https://cdn4.iconfinder.com/data/icons/circle-avatars-1/128/050_girl_avatar_profile_woman_suit_student_officer-2-1024.png"
						)),
						new Date(),
						null,
						new GroupSetting(false,false,false,false,false)
				)).block();

				chatRepository.save(new Chat(
						UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db1"),
						chatActivities
						)
				).block();

				chatRepository.save(new Chat(
						UUID.fromString("49a9768c-a2a8-4290-9653-5291b9718db2"),
						chatActivities1
				)).block();
			}
		};
	}
}
