
export class FriendError extends Error {
	constructor(message: string) {
		super (message)
		this.name = new.target.name
	}
}

export class FriendSelfError extends FriendError {
	constructor(message: string) {
		super (message)
		this.name = new.target.name
	}
}

export class FriendRequestExistsError extends FriendError{
	constructor(message: string) {
		super (message)
		this.name = new.target.name
	}
}

export class AlreadyFriendsError extends FriendError{
	constructor(message: string) {
		super (message)
		this.name = new.target.name
	}
}