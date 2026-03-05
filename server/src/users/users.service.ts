import {ConflictException, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./entity/user.entity";
import {Repository} from "typeorm";



@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {
    }
    // 插入一条用户
    async create(user: User){
        const exists = await this.findOneByPhone(user.phone);
        if (exists) {
            throw new ConflictException('手机号已注册');
        }
        return await this.userRepository.save(user);
    }
    // 根据手机号查询用户
    async findOneByPhone(phone: string): Promise<User | null> {
        return await this.userRepository.findOne({where: {phone}});
    }

    async findOne(id: string): Promise<User | null> {
        return await this.userRepository.findOne({where: {id}});
    }
    async update(id: string, user: User) {

        return await this.userRepository.update(id, user);
    }

}
