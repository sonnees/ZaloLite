mongoimport --db AccountService --collection account --file accounts.json
mongoimport --db ChatService --collection user --file users.json
mongoimport --db ChatService --collection chat --file chats.json
mongoimport --db ChatService --collection group --file groups.json
mongoimport --db ChatService --collection voting --file voting.json