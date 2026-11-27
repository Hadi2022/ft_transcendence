export class FollowRelationshipError extends Error {
    constructor(message = 'Follow relationship error') {
        super(message);
        this.name = 'FollowRelationshipError';
    }
}

export class AlreadyFollowingError extends FollowRelationshipError {
    constructor(message = 'Follow relationship error') {
        super(message);
        this.name = 'AlreadyFollowingError';
    }
}

export class FollowNotFoundError extends FollowRelationshipError {
    constructor(message = 'Follow relationship error') {
        super(message);
        this.name = 'FollowNotFoundError';
    }
}