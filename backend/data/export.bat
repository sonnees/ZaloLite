mongoexport --db AccountService --collection account --out accounts.json
mongoexport --db ChatService --collection user --out users.json
mongoexport --db ChatService --collection group --out groups.json
mongoexport --db ChatService --collection chat --out chats.json

