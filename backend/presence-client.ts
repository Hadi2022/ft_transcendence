// Usage:
//   npm i socket.io-client
//   npx tsx presence-client.ts --session <sessionID cookie value> --name alice
//   npx tsx presence-client.ts --session <other user's value> --name bob --tabs 2
//
// Run one instance per user (each in its own terminal) to watch presence
// events flow between friends and NOT flow to non-friends.

// d306d2bc856be6d100dd549b76e9c50a8f35b12a4dce539701528c90c3cc6863
// 194e05859bfa7efc10e5b73c2f9082e8d479e07cc66c07f737623c1af25492f5

import { io } from "socket.io-client";
import { parseArgs } from "node:util";

const { values } = parseArgs({
	options: {
		url: { type: "string", default: "https://localhost:443" },
		session: { type: "string" }, // the value of your sessionID cookie
		cookie: { type: "string" }, // optional: raw Cookie header override
		name: { type: "string", default: "client" }, // label for log lines
		tabs: { type: "string", default: "1" }, // simulate N tabs of the same user
		path: { type: "string", default: "/api/socket.io" },
	},
});

const cookieHeader =
	values.cookie ?? (values.session ? `sessionID=${values.session}` : undefined)

if (!cookieHeader) {
	console.error("Missing --session <sessionID cookie value>")
	process.exit(1)
}

const tabs = Number(values.tabs)
const onlineFriends = new Set<string>()

const log = (tab: number, msg: string) => {
	const time = new Date().toISOString().slice(11, 19)
	console.log(`[${time}] [${values.name}#${tab}] ${msg}`)
}

const printState = (tab: number) =>
	log(tab, `online friends now: [${[...onlineFriends].join(", ")}]`)

for (let tab = 1; tab <= tabs; tab++) {
	const socket = io(values.url, {
		path: values.path,
		transports: ["websocket"],
		extraHeaders: { Cookie: cookieHeader },
		reconnection: false, // makes auth failures obvious instead of looping
        rejectUnauthorized: false
	})

	socket.on("connect", () => log(tab, `connected (socket ${socket.id})`))

	socket.on("connect_error", (err) =>
		log(tab, `connect_error: ${err.message}`),
	)

	socket.on("disconnect", (reason) => log(tab, `disconnected: ${reason}`))

	// Initial snapshot: should only contain ONLINE friends
	socket.on("user:online-list", ({ userIds }: { userIds: string[] }) => {
		onlineFriends.clear()
		userIds.forEach((id) => onlineFriends.add(id))
		log(tab, `user:online-list -> [${userIds.join(", ")}]`)
		printState(tab)
	})

	socket.on("user:online", ({ userId }: { userId: string }) => {
		onlineFriends.add(userId)
		log(tab, `user:online  -> ${userId}`)
		printState(tab)
	})

	socket.on("user:offline", ({ userId }: { userId: string }) => {
		onlineFriends.delete(userId)
		log(tab, `user:offline -> ${userId}`)
		printState(tab)
	})

	// Catch-all, useful to spot unexpected events leaking through
	socket.onAny((event) => {
		if (!event.startsWith("user:"))
			log(tab, `(other event) ${event}`)
	})
}

process.on("SIGINT", () => {
	console.log("\nbye")
	process.exit(0)
})