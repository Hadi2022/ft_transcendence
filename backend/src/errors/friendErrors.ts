
export class FriendSelfError extends Error {
	constructor(message: string) {
		super (message)
		this.name = new.target.name
	}
}

export class FriendRequestExistsError extends Error{
	constructor(message: string) {
		super (message)
		this.name = new.target.name
	}
}

export class AlreadyFriendsError extends Error{
	constructor(message: string) {
		super (message)
		this.name = new.target.name
	}
}