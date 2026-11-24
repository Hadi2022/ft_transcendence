export class FollowRelationshipError extends Error {
    constructor(message = 'Follow relationship error') {
        super(message);
        this.name = 'FollowRelationshipError';
    }
}