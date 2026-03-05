

export class UpdateUserInfoDto{
    id :string
    username: string;

    email?: string | null;

    avatar: string;

    bio?: string | null;

    location?: string | null;

    business?: string | null;

    school?: string | null;

    major?: string | null;
    updatedAt: Date;
    constructor(username: string, email: string | null, avatar: string, bio: string | null, location: string | null, business: string | null, school: string | null, major: string | null) {
        this.username = username;
        this.email = email;
        this.avatar = avatar;
        this.bio = bio;
        this.location = location;
        this.business = business;
        this.school = school;
        this.major = major;
        this.updatedAt = new Date();
    }
}